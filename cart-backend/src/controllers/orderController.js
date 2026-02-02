// const { PrismaClient } = require("@prisma/client");
// const bcrypt = require("bcryptjs");
// const { validationResult } = require("express-validator");
// const nodemailer = require("nodemailer");
// const sendEmail = require("../utils/sendEmail");
// const Stripe = require("stripe");
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // ────────────────────────────────────────────────
// // ShipEngine – use environment variable in production
// // ────────────────────────────────────────────────
// const ShipEngine = require("shipengine");

// const shipengine = new ShipEngine('oBvjoWApITZ+iH+UuU6QKOBEKFfPXydgiD3Un2/STXw');

// const prisma = new PrismaClient();

// // Configure email transporter (unchanged)
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: true,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// exports.stripeWebhook = async (req, res) => {
//   const sig = req.headers["stripe-signature"];

//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET,
//     );
//   } catch (err) {
//     console.error("Webhook signature verification failed:", err.message);
//     return res.status(400).send("Webhook Error");
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;
//     const items = JSON.parse(session.metadata.items || "[]");

//     try {
//       await prisma.$transaction(async (tx) => {
//         const customer = await tx.customers.findUnique({
//           where: { id: Number(session.metadata.customerId) },
//         });

//         if (!customer) {
//           throw new Error("Customer not found for shipping");
//         }

//         const order = await tx.order.create({
//           data: {
//             customerId: Number(session.metadata.customerId),
//             status: "PAID",
//             totalAmount: session.amount_total / 100,
//             items: {
//               create: items.map((item) => ({
//                 productId: item.id,
//                 quantity: item.qty,
//                 priceAtOrder: item.price,
//               })),
//             },
//           },
//           include: { items: true },
//         });

//         for (const item of items) {
//           const product = await tx.product.findUnique({
//             where: { id: item.id },
//           });

//           if (!product) throw new Error(`Product ID ${item.id} not found`);
//           if (product.stock < item.qty)
//             throw new Error(`Insufficient stock for ${product.name}`);

//           await tx.product.update({
//             where: { id: item.id },
//             data: { stock: { decrement: item.qty } },
//           });
//         }

//         const products = await tx.product.findMany({
//           where: { id: { in: items.map((i) => i.id) } },
//         });

//         let totalWeight = 0;
//         let maxLength = 0;
//         let maxWidth = 0;
//         let totalHeight = 0;

//         for (const item of items) {
//           const product = products.find((p) => p.id === item.id);
//           totalWeight += Number(product.weightLb) * item.qty;
//           maxLength = Math.max(maxLength, Number(product.lengthIn));
//           maxWidth = Math.max(maxWidth, Number(product.widthIn));
//           totalHeight += Number(product.heightIn) * item.qty;
//         }

//         if (!totalWeight || !maxLength || !maxWidth || !totalHeight) return;

//         const shipment = {
//           ship_from: {
//             name: "Your Store Name",
//             company_name: "Your Company",
//             address_line1: "Your Store Street",
//             city_locality: "Karachi",
//             state_province: "Sindh",
//             postal_code: "74000",
//             country_code: "PK",
//             phone: "+92xxxxxxxxxx",
//           },
//           ship_to: {
//             name: customer.fullName,
//             address_line1: customer.billingStreet,
//             city_locality: customer.billingCity,
//             state_province: customer.billingState,
//             postal_code: customer.billingZip,
//             country_code: customer.billingCountry,
//             phone: "",
//           },
//           packages: [
//             {
//               weight: {
//                 value: totalWeight,
//                 unit: "kilogram",
//               },
//               dimensions: {
//                 length: maxLength,
//                 width: maxWidth,
//                 height: totalHeight,
//                 unit: "centimeter",
//               },
//             },
//           ],
//         };

//         const rates = await shipengine.getRatesWithShipmentDetails(shipment);

//         if (!rates || !rates.rate_response?.rates?.length) return;

//         const cheapestRate = rates.rate_response.rates.reduce((a, b) =>
//           a.shipping_amount.amount < b.shipping_amount.amount ? a : b,
//         );

//         const label = await shipengine.createLabelFromRate({
//           rate_id: cheapestRate.rate_id,
//           label_format: "pdf",
//         });

//         await tx.order.update({
//           where: { id: order.id },
//           data: {
//             trackingNumber: label.tracking_number,
//             labelUrl: label.label_download.pdf,
//             carrier: label.carrier_code,
//             serviceLevel: label.service_code,
//             status: "SHIPPED",
//           },
//         });

//         console.log(
//           `Order ${order.id} → Label created | Tracking: ${label.tracking_number}`,
//         );
//       });
//     } catch (err) {
//       console.error("Critical error in webhook processing:", err);
//     }
//   }

//   res.json({ received: true });
// };


// const { PrismaClient } = require("@prisma/client");
// const bcrypt = require("bcryptjs");
// const { validationResult } = require("express-validator");
// const nodemailer = require("nodemailer");
// const sendEmail = require("../utils/sendEmail");
// const Stripe = require("stripe");
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // ────────────────────────────────────────────────
// // Shippo – use environment variable in production
// // ────────────────────────────────────────────────
// const { Shippo } = require("shippo");

// const shippo = new Shippo({
//   apiKeyHeader: process.env.SHIPPO_API_KEY,
// });

// const prisma = new PrismaClient();

// // Configure email transporter (unchanged)
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: true,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// exports.stripeWebhook = async (req, res) => {
//   const sig = req.headers["stripe-signature"];

//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET,
//     );
//   } catch (err) {
//     console.error("Webhook signature verification failed:", err.message);
//     return res.status(400).send("Webhook Error");
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;

//     const items = JSON.parse(session.metadata.items || "[]");

//     try {
//       await prisma.$transaction(async (tx) => {
//         const customer = await tx.customers.findUnique({
//           where: { id: Number(session.metadata.customerId) },
//         });

//         if (!customer) {
//           throw new Error("Customer not found for shipping");
//         }
//         // 1. Create order record
//         const order = await tx.order.create({
//           data: {
//             customerId: Number(session.metadata.customerId),
//             status: "PAID",
//             totalAmount: session.amount_total / 100,
//             items: {
//               create: items.map((item) => ({
//                 productId: item.id,
//                 quantity: item.qty,
//                 priceAtOrder: item.price,
//               })),
//             },
//           },
//           include: { items: true },
//         });

//         // 2. Decrease stock
//         for (const item of items) {
//           const product = await tx.product.findUnique({
//             where: { id: item.id },
//           });

//           if (!product) {
//             throw new Error(`Product ID ${item.id} not found`);
//           }
//           if (product.stock < item.qty) {
//             throw new Error(`Insufficient stock for ${product.name}`);
//           }

//           await tx.product.update({
//             where: { id: item.id },
//             data: { stock: { decrement: item.qty } },
//           });
//         }

//         // 3. Shippo – create shipment and buy label

//         const products = await tx.product.findMany({
//           where: { id: { in: items.map((i) => i.id) } },
//         });

//         if (products.length !== items.length) {
//           throw new Error(
//             "One or more products missing for shipping calculation",
//           );
//         }

//         // 📦 CALCULATE PARCEL
//         let totalWeight = 0;
//         let maxLength = 0;
//         let maxWidth = 0;
//         let totalHeight = 0;

//         for (const item of items) {
//           const product = products.find((p) => p.id === item.id);

//           totalWeight += Number(product.weightLb) * item.qty;
//           maxLength = Math.max(maxLength, Number(product.lengthIn));
//           maxWidth = Math.max(maxWidth, Number(product.widthIn));
//           totalHeight += Number(product.heightIn) * item.qty;
//         }

//         const parcel = {
//           length: maxLength,
//           width: maxWidth,
//           height: totalHeight,
//           weight: totalWeight,
//           distance_unit: "cm",
//           mass_unit: "kg",
//         };

//         // 🛑 Safety check
//         if (
//           !parcel.weight ||
//           !parcel.length ||
//           !parcel.width ||
//           !parcel.height
//         ) {
//           console.warn(`Invalid parcel data for order ${order.id}`);
//           return;
//         }

//         if (parcel.length && parcel.width && parcel.height && parcel.weight) {
//           const addressFrom = {
//             name: "Your Store Name", // ← IMPORTANT: CHANGE THIS
//             company: "Your Company",
//             street1: "Your Store Street",
//             city: "Karachi",
//             state: "Sindh",
//             zip: "74000", // ← CHANGE THIS
//             country: "PK",
//             phone: "+92xxxxxxxxxx", // ← CHANGE THIS
//             email: "support@yourdomain.com",
//           };

//           const addressTo = {
//             name: customer.fullName,
//             street1: customer.billingStreet,
//             city: customer.billingCity,
//             state: customer.billingState,
//             zip: customer.billingZip,
//             country: customer.billingCountry,
//             phone: "", // add if you store phone later
//             email: customer.email,
//           };

//           // Create shipment → gets rates
//           const shipment = await shippo.shipment.create({
//             address_from: addressFrom,
//             address_to: addressTo,
//             parcels: [parcel],
//             async: false,
//           });

//           if (shipment.rates && shipment.rates.length > 0) {
//             // Choose cheapest rate
//             const selectedRate = shipment.rates.reduce((prev, curr) =>
//               parseFloat(prev.amount) < parseFloat(curr.amount) ? prev : curr,
//             );

//             // Purchase shipping label
//             const transaction = await shippo.transaction.create({
//               rate: selectedRate.object_id,
//               label_file_type: "PDF",
//               async: false,
//             });

//             if (transaction.status === "SUCCESS") {
//               await tx.order.update({
//                 where: { id: order.id },
//                 data: {
//                   trackingNumber: transaction.tracking_number,
//                   labelUrl: transaction.label_url,
//                   carrier: transaction.carrier,
//                   serviceLevel:
//                     transaction.servicelevel?.token ||
//                     selectedRate.servicelevel?.token,
//                   status: "SHIPPED", // or "PROCESSING" – your choice
//                 },
//               });

//               console.log(
//                 `Order ${order.id} → Label created | Tracking: ${transaction.tracking_number}`,
//               );
//             } else {
//               console.error("Shippo transaction failed:", transaction.messages);
//             }
//           } else {
//             console.warn(`No shipping rates for order ${order.id}`);
//           }
//         } else {
//           console.warn(`Incomplete parcel data for order ${order.id}`);
//         }
//       });
//     } catch (err) {
//       console.error("Critical error in webhook processing:", err);
//       // Optional: notify admin here (email / Slack)
//     }
//   }

//   res.json({ received: true });
// };

// exports.stripeSession = async (req, res) => {
//   try {
//     if (!req.body || !req.body.items) {
//       return res
//         .status(400)
//         .json({ message: "Missing or invalid items in request body" });
//     }

//     const { items } = req.body;

//     const customerId = req.user.id;

//     const line_items = items.map((item) => ({
//       price_data: {
//         currency: "usd",
//         product_data: { name: item.name },
//         unit_amount: Math.round(item.price * 100),
//       },
//       quantity: item.qty,
//     }));

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items,
//       metadata: {
//         customerId: String(customerId),
//         items: JSON.stringify(
//           items.map((item) => ({
//             id: item.id,
//             qty: item.qty,
//             price: item.price,
//           })),
//         ),
//       },
//       success_url: `https://clubpromfg.com/greengrass/`,
//       cancel_url: `https://clubpromfg.com/greengrass/`,
//     });

//     res.json({ url: session.url });
//   } catch (err) {
//     console.error("Stripe session creation failed:", err);
//     res
//       .status(500)
//       .json({ message: "Failed to create Stripe checkout session" });
//   }
// };

// exports.getOrders = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const search = req.query.search;
//     const status = req.query.status;
//     const sort = req.query.sort || "createdAt";
//     const order = req.query.order || "desc";

//     const where = {
//       ...(search && {
//         OR: [
//           { id: { equals: parseInt(search) || undefined } },
//           { customer: { email: { contains: search } } },
//           { customer: { fullName: { contains: search } } },
//         ],
//       }),
//       ...(status && { status }),
//     };

//     const [data, total] = await Promise.all([
//       prisma.order.findMany({
//         where,
//         include: {
//           customer: {
//             select: {
//               id: true,
//               fullName: true,
//               email: true,
//               billingStreet: true,
//               billingCity: true,
//               billingState: true,
//               billingZip: true,
//               billingCountry: true,
//               commercialStreet: true,
//               commercialCity: true,
//               commercialState: true,
//               commercialZip: true,
//               commercialCountry: true,
//               isActive: true,
//               createdAt: true,
//             },
//           },
//         },
//         orderBy: { [sort]: order },
//         skip: (page - 1) * limit,
//         take: limit,
//       }),
//       prisma.order.count({ where }),
//     ]);

//     res.json({
//       data,
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(total / limit),
//         totalItems: total,
//         limit,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.getOrderById = async (req, res) => {
//   try {
//     const order = await prisma.order.findUnique({
//       where: { id: parseInt(req.params.id) },
//       include: {
//         customer: true,
//         items: {
//           include: {
//             product: {
//               include: {
//                 brand: true,
//                 model: true,
//                 productType: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!order) return res.status(404).json({ message: "Order not found" });
//     res.json(order);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.updateStatus = async (req, res) => {
//   const { status } = req.body;
//   if (
//     !["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"].includes(status)
//   ) {
//     return res.status(400).json({ message: "Invalid status" });
//   }

//   try {
//     const order = await prisma.order.update({
//       where: { id: parseInt(req.params.id) },
//       data: { status },
//     });
//     res.json(order);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to update status" });
//   }
// };

// exports.bulkCancel = async (req, res) => {
//   const { ids } = req.body;
//   if (!Array.isArray(ids) || ids.length === 0) {
//     return res.status(400).json({ message: "Invalid ids" });
//   }

//   try {
//     await prisma.order.updateMany({
//       where: { id: { in: ids } },
//       data: { status: "CANCELLED" },
//     });
//     res.json({ message: "Orders cancelled" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to cancel orders" });
//   }
// };


const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const sendEmail = require("../utils/sendEmail");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ────────────────────────────────────────────────
// Shippo – use environment variable in production
// ────────────────────────────────────────────────
const { Shippo } = require("shippo");

const shippo = new Shippo({
  apiKeyHeader: process.env.SHIPPO_API_KEY,
});

const prisma = new PrismaClient();

// Configure email transporter (unchanged)
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

exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
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

        // 1. Create order record
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

        // 2. Decrease stock
        for (const item of items) {
          const product = await tx.product.findUnique({
            where: { id: item.id },
          });

          if (!product) {
            throw new Error(`Product ID ${item.id} not found`);
          }
          if (product.stock < item.qty) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }

          await tx.product.update({
            where: { id: item.id },
            data: { stock: { decrement: item.qty } },
          });
        }

        // 3. Create Shippo Order (no shipment or label)

        const products = await tx.product.findMany({
          where: { id: { in: items.map((i) => i.id) } },
        });

        if (products.length !== items.length) {
          throw new Error("One or more products missing");
        }

        // Addresses
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
          is_residential: false
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
          is_residential: true
        };

        // Calculate subtotal
        const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);

        // Shippo line items
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

        // safety minimum
        orderWeightLb = Math.max(orderWeightLb, 0.5);

        // Create Shippo Order
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

        // Optionally update Prisma order with Shippo order ID if you add a field for it
      }, { timeout: 15000 });
    } catch (err) {
      console.error("Critical error in webhook processing:", err);
    }
  }

  res.json({ received: true });
};

exports.stripeSession = async (req, res) => {
  try {
    if (!req.body || !req.body.items) {
      return res
        .status(400)
        .json({ message: "Missing or invalid items in request body" });
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

    // Calculate parcel for rates
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

    // Addresses
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

    // Get shipping rates from Shippo (creates temp shipment for rating)
    const shipment = await shippo.shipments.create({
      addressFrom: addressFrom,
      addressTo: addressTo,
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

    // Product line items
    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    // Add shipping line item separately
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
            country:
              customer.commercialCountry ||
              customer.billingCountry ||
              "US",
          },
        },
      });


    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer: stripeCustomer.id,
      customer_update: {
        name: "auto",
        address: "auto",
        shipping: "auto",
      },
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      line_items,
      metadata: {
        customerId: String(customerId),
        items: JSON.stringify(
          items.map((item) => ({
            id: item.id,
            qty: item.qty,
            price: item.price,
          })),
        ),
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
    res
      .status(500)
      .json({ message: "Failed to create Stripe checkout session" });
  }
};

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
  if (
    !["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"].includes(status)
  ) {
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