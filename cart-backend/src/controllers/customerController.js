const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");



exports.createCustomer = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      billingStreet = "",
      billingCity = "",
      billingState = "",
      billingZip = "",
      billingCountry = "",
      commercialStreet = "",
      commercialCity = "",
      commercialState = "",
      commercialZip = "",
      commercialCountry = "",
    } = req.body;

    // Required fields validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Full name, email, and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check for existing email
    const existingCustomer = await prisma.customers.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingCustomer) {
      return res.status(409).json({
        message: "A customer with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new customer
    const customer = await prisma.customers.create({
      data: {
        fullName: fullName.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        billingStreet: billingStreet.trim(),
        billingCity: billingCity.trim(),
        billingState: billingState.trim(),
        billingZip: billingZip.trim(),
        billingCountry: billingCountry.trim(),
        commercialStreet: commercialStreet.trim(),
        commercialCity: commercialCity.trim(),
        commercialState: commercialState.trim(),
        commercialZip: commercialZip.trim(),
        commercialCountry: commercialCountry.trim(),
      },
    });

    res.status(201).json({
      message: "Customer created successfully",
      data: customer,
    });
  } catch (error) {
    console.error("Create customer error:", error);

    // Specifically handle Prisma unique constraint violation (duplicate email)
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return res.status(409).json({
        message: "A customer with this email already exists",
      });
    }

    // Other database or server errors
    res.status(500).json({
      message: "Failed to create customer. Please try again later.",
    });
  }
};

/**
 * GET ALL CUSTOMERS
 */
exports.getCustomersPagination  = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sort = "createdAt",
    order = "desc",
  } = req.query;
  const skip = (page - 1) * limit;
  try {
    const where = search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};
    const customers = await prisma.customers.findMany({
      where,
      skip: Number(skip),
      take: Number(limit),
      orderBy: { [sort]: order.toLowerCase() },
      select: {
        id: true,
        fullName: true,
        email: true,
        isActive: true,
        createdAt: true,
      },
    });
    const totalItems=await prisma.customers.count({ where })

   res.status(200).json({
      data: customers,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCustomers= async (req, res) => {
  try {
    const customers = await prisma.customers.findMany({
      where: { isActive: true },
      select: {
        id: true,
        fullName: true,
        email: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET SINGLE CUSTOMER
 */
exports.getCustomerById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const customer = await prisma.customers.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE CUSTOMER
 */
exports.updateCustomer = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }

    const {
      fullName,
      email,
      password,
      isActive,
      billingStreet,
      billingCity,
      billingState,
      billingZip,
      billingCountry,
      commercialStreet,
      commercialCity,
      commercialState,
      commercialZip,
      commercialCountry,
    } = req.body;

    const updateData = {};

    // Only include provided fields
    if (fullName !== undefined) updateData.fullName = fullName.trim();
    if (email !== undefined) updateData.email = email.toLowerCase().trim();
    if (isActive !== undefined) updateData.isActive = isActive;

    // Address fields
    if (billingStreet !== undefined) updateData.billingStreet = billingStreet.trim();
    if (billingCity !== undefined) updateData.billingCity = billingCity.trim();
    if (billingState !== undefined) updateData.billingState = billingState.trim();
    if (billingZip !== undefined) updateData.billingZip = billingZip.trim();
    if (billingCountry !== undefined) updateData.billingCountry = billingCountry.trim();

    if (commercialStreet !== undefined) updateData.commercialStreet = commercialStreet.trim();
    if (commercialCity !== undefined) updateData.commercialCity = commercialCity.trim();
    if (commercialState !== undefined) updateData.commercialState = commercialState.trim();
    if (commercialZip !== undefined) updateData.commercialZip = commercialZip.trim();
    if (commercialCountry !== undefined) updateData.commercialCountry = commercialCountry.trim();

    // Handle password change
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No changes provided" });
    }

    const customer = await prisma.customers.update({
      where: { id },
      data: updateData,
    });

    res.json({
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (error) {
    console.error("Update customer error:", error);

    // Handle duplicate email during update
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return res.status(409).json({
        message: "This email is already in use by another customer",
      });
    }

    // Handle customer not found
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Any other error
    res.status(500).json({
      message: "Failed to update customer. Please try again later.",
    });
  }
};

exports.patchCustomer = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { isActive } = req.body;

    const updateData = {};

    if (isActive !== undefined) updateData.isActive = isActive;

    

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No changes provided" });
    }

    const customer = await prisma.customers.update({
      where: { id },
      data: updateData,
    });

    res.json({
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE CUSTOMER (SOFT DELETE)
 */
exports.bulkDeleteCustomers = async (req, res) => {
  try {
    const { ids } = req.body;

    // Validation
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "ids must be a non-empty array",
      });
    }

    // delete order items of all orders for these customers
await prisma.orderItem.deleteMany({
  where: {
    order: {
      customerId: { in: ids }
    }
  }
});

// delete orders of these customers
await prisma.order.deleteMany({
  where: {
    customerId: { in: ids }
  }
});

// now delete customers




    const result = await prisma.customers.deleteMany({
      where: {
        id: {
          in: ids.map(Number),
        },
      },
    });

    res.json({
      message: "Customers deactivated successfully",
      affectedCount: result.count,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};




exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const customer = await prisma.customers.findUnique({
      where: { email },
    });

    if (!customer || !customer.isActive) {
      return res.status(401).json({
        message: "Invalid credentials or account inactive",
      });
    }

    const isMatch = await bcrypt.compare(password, customer.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: customer.id, email: customer.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: customer.id,
        fullName: customer.fullName,
        email: customer.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
