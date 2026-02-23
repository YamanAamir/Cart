const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const sendEmail = require("../utils/sendEmail");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Shippo
const { Shippo } = require("shippo");
const shippo = new Shippo({
  apiKeyHeader: process.env.SHIPPO_API_KEY,
});

const prisma = new PrismaClient();

// Fishbowl Service
const fishbowl = require('../services/fishbowlService');

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// ────────────────────────────────────────────────
// Stripe Webhook - Payment Complete → Order + Fishbowl Sync
// ────────────────────────────────────────────────
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send("Webhook Error");
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const items = JSON.parse(session.metadata.items || "[]");
    const shippingCost = parseFloat(session.metadata.shippingCost || "0");
    const serviceLevel = session.metadata.serviceLevel || "";
    const serviceName = session.metadata.serviceName || "";

    try {
      await prisma.$transaction(async (tx) => {
        const customer = await tx.customers.findUnique({
          where: { id: Number(session.metadata.customerId) },
        });

        if (!customer) {
          throw new Error("Customer not found");
        }

        // 1. Create order in Prisma
        const order = await tx.order.create({
          data: {
            customerId: Number(session.metadata.customerId),
            status: "PAID",
            totalAmount: session.amount_total / 100,
            shipmentCost: shippingCost,
            shipmentStatus: "UNKNOWN",
            items: {
              create: items.map((item) => ({
                productId: item.id,
                quantity: item.qty,
                priceAtOrder: item.price,
              })),
            },
          },
          include: { items: true },
        });

        // 2. Decrease stock in Prisma
        for (const item of items) {
          const product = await tx.product.findUnique({
            where: { id: item.id },
          });

          if (!product) throw new Error(`Product ID ${item.id} not found`);
          if (product.stock < item.qty) throw new Error(`Insufficient stock for ${product.name}`);

          await tx.product.update({
            where: { id: item.id },
            data: { stock: { decrement: item.qty } },
          });
        }

        // 3. Fishbowl Sync - Start
        // A. Sync Customer if not already in Fishbowl
        let fbCustomerNum = customer.fishbowlCustomerNumber;
        if (!fbCustomerNum) {
          try {
            const custCSV = `CustomerName,BillingAddress,BillingCity,BillingState,BillingZip,BillingCountry,Email\n"${customer.fullName}","${customer.billingStreet || customer.commercialStreet}","${customer.billingCity || customer.commercialCity}","${customer.billingState || customer.commercialState}","${customer.billingZip || customer.commercialZip}","${customer.billingCountry || customer.commercialCountry}","${customer.email}"`;

            await fishbowl.importCustomer(custCSV);
            fbCustomerNum = customer.email; // Using email as unique identifier (change if needed)

            await tx.customers.update({
              where: { id: customer.id },
              data: { fishbowlCustomerNumber: fbCustomerNum },
            });
          } catch (fbErr) {
            console.error("Fishbowl customer sync failed:", fbErr);
            // You can decide to throw or continue
          }
        }

        // B. Create Sales Order in Fishbowl
        try {
          let soCSV = `SONum,CustomerName,ItemNumber,Quantity,Price,UOM,LocationGroup,SOType,Date\n"#${order.id}","${fbCustomerNum}"`;

          for (const item of order.items) {
            const product = await tx.product.findUnique({
              where: { id: item.productId },
            });

            if (!product.fishbowlPartNumber) {
              throw new Error(`Product ${product.name} not synced to Fishbowl`);
            }

            soCSV += `\n"${product.fishbowlPartNumber}",${item.quantity},${item.priceAtOrder},"Each","Main","Standard","${new Date().toISOString().split('T')[0]}"`;
          }

          await fishbowl.importSalesOrder(soCSV);

          await tx.order.update({
            where: { id: order.id },
            data: { fishbowlSalesOrderNumber: `#${order.id}` },
          });

          console.log(`Fishbowl Sales Order created: #${order.id}`);
        } catch (fbErr) {
          console.error("Fishbowl Sales Order creation failed:", fbErr);
          // Optional: notify admin or rollback
        }

        // 4. Shippo Order (existing code)
        const products = await tx.product.findMany({
          where: { id: { in: items.map((i) => i.id) } },
        });

        if (products.length !== items.length) {
          throw new Error("One or more products missing");
        }

        const addressFrom = {
          name: "Test Store Inc",
          company: "Your Company Name",
          street1: "123 Test Street",
          street2: "",
          city: "San Francisco",
          state: "CA",
          zip: "94105",
          country: "US",
          phone: "+14155551234",
          email: "support@yourstore.com",
          is_residential: false,
        };

        const addressTo = {
          name: customer.fullName || "Customer",
          street1: customer.commercialStreet || customer.billingStreet,
          street2: "",
          city: customer.commercialCity || customer.billingCity,
          state: customer.commercialState || customer.billingState,
          zip: customer.commercialZip || customer.billingZip,
          country: customer.commercialCountry || customer.billingCountry || "US",
          phone: "",
          email: customer.email,
          is_residential: true,
        };

        const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);

        const shippoLineItems = items.map((item) => {
          const product = products.find((p) => p.id === item.id);
          return {
            title: product.name,
            variantTitle: product.color || "",
            sku: "",
            quantity: item.qty,
            totalPrice: (item.price * item.qty).toFixed(2),
            currency: "USD",
            weight: product.weightLb.toString(),
            weightUnit: "lb",
            manufactureCountry: "US",
          };
        });

        let orderWeightLb = 0;
        for (const item of items) {
          const product = products.find((p) => p.id === item.id);
          orderWeightLb += Number(product.weightLb) * item.qty;
        }
        orderWeightLb = Math.max(orderWeightLb, 0.5);

        const shippoOrder = await shippo.orders.create({
          orderNumber: `#${order.id}`,
          orderStatus: "PAID",
          weight: orderWeightLb.toString(),
          weightUnit: "lb",
          fromAddress: addressFrom,
          toAddress: addressTo,
          lineItems: shippoLineItems,
          subtotalPrice: subtotal.toFixed(2),
          totalPrice: (session.amount_total / 100).toFixed(2),
          totalTax: "0.00",
          currency: "USD",
          shippingCost: shippingCost.toFixed(2),
          shippingCostCurrency: "USD",
          shippingMethod: serviceName,
          placedAt: new Date().toISOString(),
        });

        console.log('Shippo Order created:', shippoOrder.objectId);
      }, { timeout: 30000 }); // Increased timeout for Fishbowl API calls
    } catch (err) {
      console.error("Critical error in webhook processing:", err);
    }
  }

  res.json({ received: true });
};

// ────────────────────────────────────────────────
// Stripe Checkout Session (with Fishbowl stock check)
// ────────────────────────────────────────────────
exports.stripeSession = async (req, res) => {
  try {
    if (!req.body || !req.body.items) {
      return res.status(400).json({ message: "Missing or invalid items" });
    }

    const { items } = req.body;
    const customerId = req.user.id;

    const customer = await prisma.customers.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.id) } },
    });

    if (products.length !== items.length) {
      return res.status(400).json({ message: "One or more products not found" });
    }

    // ─── Fishbowl Stock Check (Prevent Overselling) ───
    for (const item of items) {
      const product = products.find((p) => p.id === item.id);
      if (!product.fishbowlPartNumber) {
        return res.status(400).json({
          message: `Product "${product.name}" not synced to Fishbowl`,
        });
      }

      const fbStock = await fishbowl.getPartInventory(product.fishbowlPartNumber);
      if (fbStock < item.qty) {
        return res.status(400).json({
          message: `Insufficient stock for "${product.name}" (Fishbowl: ${fbStock} available, requested: ${item.qty})`,
        });
      }
    }

    // ─── Parcel calculation for Shippo ───
    let totalWeightLb = 0;
    let maxLengthIn = 0;
    let maxWidthIn = 0;
    let totalHeightIn = 0;

    for (const item of items) {
      const product = products.find((p) => p.id === item.id);
      totalWeightLb += Number(product.weightLb) * item.qty;
      maxLengthIn = Math.max(maxLengthIn, Number(product.lengthIn));
      maxWidthIn = Math.max(maxWidthIn, Number(product.widthIn));
      totalHeightIn += Number(product.heightIn) * item.qty;
    }

    totalWeightLb = Math.max(0.5, totalWeightLb);
    maxLengthIn = Math.max(5, maxLengthIn);
    maxWidthIn = Math.max(5, maxWidthIn);
    totalHeightIn = Math.max(5, totalHeightIn);

    const parcel = {
      weight: totalWeightLb.toFixed(2),
      massUnit: "lb",
      length: maxLengthIn.toFixed(2),
      width: maxWidthIn.toFixed(2),
      height: totalHeightIn.toFixed(2),
      distanceUnit: "in",
    };

    const addressFrom = {
      name: "Test Store Inc",
      company: "Your Company Name",
      street1: "123 Test Street",
      street2: "",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "US",
      phone: "+14155551234",
      email: "support@yourstore.com",
      is_residential: false,
    };

    const addressTo = {
      name: customer.fullName || "Customer",
      street1: customer.commercialStreet || customer.billingStreet,
      street2: "",
      city: customer.commercialCity || customer.billingCity,
      state: customer.commercialState || customer.billingState,
      zip: customer.commercialZip || customer.billingZip,
      country: customer.commercialCountry || customer.billingCountry || "US",
      phone: "",
      email: customer.email,
      is_residential: true,
    };

    const shipment = await shippo.shipments.create({
      addressFrom,
      addressTo,
      parcels: [parcel],
      async: false,
    });

    if (!shipment.rates || shipment.rates.length === 0) {
      return res.status(400).json({ message: "No shipping rates available" });
    }

    const selectedRate = shipment.rates.reduce((prev, curr) =>
      parseFloat(prev.amount) < parseFloat(curr.amount) ? prev : curr
    );

    const shippingCost = parseFloat(selectedRate.amount);

    // Stripe line items
    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: `Shipping (${selectedRate.servicelevel.name})` },
        unit_amount: Math.round(shippingCost * 100),
      },
      quantity: 1,
    });

    const stripeCustomer = await stripe.customers.create({
      email: customer.email,
      name: customer.fullName,
      address: {
        line1: customer.billingStreet,
        city: customer.billingCity,
        state: customer.billingState,
        postal_code: customer.billingZip,
        country: customer.billingCountry || "US",
      },
      shipping: {
        name: customer.fullName,
        address: {
          line1: customer.commercialStreet || customer.billingStreet,
          city: customer.commercialCity || customer.billingCity,
          state: customer.commercialState || customer.billingState,
          postal_code: customer.commercialZip || customer.billingZip,
          country: customer.commercialCountry || customer.billingCountry || "US",
        },
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer: stripeCustomer.id,
      customer_update: { name: "auto", address: "auto", shipping: "auto" },
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
      line_items,
      metadata: {
        customerId: String(customerId),
        items: JSON.stringify(items.map((item) => ({ id: item.id, qty: item.qty, price: item.price }))),
        shippingCost: shippingCost.toString(),
        serviceLevel: selectedRate.servicelevel.token,
        serviceName: selectedRate.servicelevel.name,
      },
      success_url: `https://clubpromfg.com/greengrass/`,
      cancel_url: `https://clubpromfg.com/greengrass/`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session creation failed:", err);
    res.status(500).json({ message: "Failed to create Stripe checkout session" });
  }
};

// ────────────────────────────────────────────────
// Baaki functions same rahein (getOrders, getOrderById, updateStatus, bulkCancel)
// ────────────────────────────────────────────────
exports.getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;
    const status = req.query.status;
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const where = {
      ...(search && {
        OR: [
          { id: { equals: parseInt(search) || undefined } },
          { customer: { email: { contains: search } } },
          { customer: { fullName: { contains: search } } },
        ],
      }),
      ...(status && { status }),
    };

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              fullName: true,
              email: true,
              billingStreet: true,
              billingCity: true,
              billingState: true,
              billingZip: true,
              billingCountry: true,
              commercialStreet: true,
              commercialCity: true,
              commercialState: true,
              commercialZip: true,
              commercialCountry: true,
              isActive: true,
              createdAt: true,
            },
          },
        },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      data,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        limit,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        customer: true,
        items: {
          include: {
            product: {
              include: {
                brand: true,
                model: true,
                productType: true,
              },
            },
          },
        },
      },
    });

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  if (!["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
    });
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update status" });
  }
};

exports.bulkCancel = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Invalid ids" });
  }

  try {
    await prisma.order.updateMany({
      where: { id: { in: ids } },
      data: { status: "CANCELLED" },
    });
    res.json({ message: "Orders cancelled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to cancel orders" });
  }
};