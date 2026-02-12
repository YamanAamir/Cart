const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const { sendEmail } = require("../utils/sendEmail");
const { put } = require("@vercel/blob");

const prisma = new PrismaClient();

// Configure email transporter
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

// Email template for dealer registration
const getDealerEmailTemplate = (dealer) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Dealer Registration</h1>
        </div>
        <div class="content">
          <p>A new dealer has registered on the platform.</p>
          
          <div class="info-row">
            <span class="label">Name:</span> ${dealer.name || "N/A"}
          </div>
          <div class="info-row">
            <span class="label">Email:</span> ${dealer.email || "N/A"}
          </div>
          <div class="info-row">
            <span class="label">Phone:</span> ${dealer.phone || "N/A"}
          </div>
          <div class="info-row">
            <span class="label">Company:</span> ${dealer.companyName || "N/A"}
          </div>
          <div class="info-row">
            <span class="label">Location:</span> ${dealer.location || "N/A"}
          </div>
          <div class="info-row">
  <span class="label">Interested Brands:</span> ${dealer.interestedBrands.join(", ") || "None"
    }
</div>
<div class="info-row">
  <span class="label">Sell Brands:</span> ${dealer.sellBrands.join(", ") || "None"
    }
</div>
<div class="info-row">
  <span class="label">Authorized Dealer:</span> ${dealer.authorizedDealer.join(", ") || "None"
    }
</div>

          <div class="info-row">
            <span class="label">Registration Date:</span> ${new Date().toLocaleDateString()}
          </div>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Confirmation email for the dealer
const getDealerConfirmationTemplate = (dealer) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome! Registration Confirmed</h1>
        </div>
        <div class="content">
          <p>Dear ${dealer.name || "Dealer"},</p>
          <p>Thank you for registering with us! Your dealer application has been received successfully.</p>
          <p>Our team will review your application and get back to you within 2-3 business days.</p>
          <p>If you have any questions, feel free to contact our support team.</p>
          <p>Best regards,<br>The Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send email function
const sendNormalEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error: error.message };
  }
};

const createDealerRegistration = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const data = req.body;
    const email= data.email;

    // Check for existing registration with the same email
    const existingRegistration = await prisma.dealerRegistration.findUnique({
      where: { email },
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        error: "A registration with this email already exists",
      });
    }

    let resaleCertificate = null;

    if (req.file) {
      // Save relative path – this matches what you serve via express.static('/uploads')
      resaleCertificate = `/uploads/registrations/${req.file.filename}`;
    }

    // Create dealer registration
    const dealer = await prisma.dealerRegistration.create({
      data: {
        ...data,
        resaleCertificate,           // ← now storing local path or null
        interestedBrands: data.interestedBrands || [],
        sellBrands: data.sellBrands || [],
        authorizedDealer: data.authorizedDealer || [],
      },
    });

    // Send notification email to admin
    const adminEmail = "prehodacpro@gmail.com";
    if (adminEmail) {
      await sendNormalEmail(
        adminEmail,
        "New Dealer Registration",
        getDealerEmailTemplate(dealer)
      );
    }

    await sendEmail({
      to: data.email,
      subject: "Your Dealer Account Application Has Been Recieved",
      html: `
        <h2>About Your Application</h2>
        <p>Great news! Your ClubPro GreenGrass application has been accepted and is now moving through final approval.</p>
        <p>If approved, you’ll receive an email from Club Pro with a temporary password. Simply log in using that password and your username (email you signed up with) then head to your Profile page to update it.</p>
       
        <p><strong>Log in here to get started: https://clubpromfg.com/greengrass/login </strong> </p>
      `,
    });

    res.status(201).json({
      success: true,
      dealer,
      message: "Registration successful. Confirmation email sent.",
    });
  } catch (error) {
    console.error("Dealer registration error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save dealer registration",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// controllers/dealerRegistrationController.js (or wherever you keep it)

const getAllDealerRegistrationsPagination = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sort = "createdAt",
    order = "desc",
  } = req.query;

  const skip = (page - 1) * limit;

  try {
    // Build search conditions across multiple relevant fields
    const where = search
      ? {
        OR: [
          { companyName: { contains: search } },
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
          { commercialCity: { contains: search } },
          { commercialState: { contains: search } },
        ],
      }
      : {};

    const [dealers, totalItems] = await Promise.all([
      prisma.dealerRegistration.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { [sort]: order.toLowerCase() },
        select: {
          id: true,
          companyName: true,
          title: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          mobile: true,
          fax: true,
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
          hasShowroom: true,
          isApproved: true,
          status: true,
          interestedBrands: true,
          sellBrands: true,
          authorizedDealer: true,
          sellBrandsOther: true,
          authorizedDealersOther: true,
          resaleCertificate: true,
          createdAt: true,
        },
      }),
      prisma.dealerRegistration.count({ where }),
    ]);

    // Optional: Parse JSON string fields if stored as String in DB
    const formattedDealers = dealers.map((dealer) => ({
      ...dealer,
      interestedBrands: dealer.interestedBrands || [],
      sellBrands: dealer.sellBrands || [],
      authorizedDealer: dealer.authorizedDealer || [],
    }));

    res.status(200).json({
      data: formattedDealers,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching dealer registrations:", error);
    res.status(500).json({ message: "Failed to fetch dealer registrations" });
  }
};

// ==================== GET BY ID ====================
// controllers/dealerRegistrationController.js

const getDealerRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;

    const dealerRegistration = await prisma.dealerRegistration.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        companyName: true,
        title: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        mobile: true,
        fax: true,
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
        hasShowroom: true,
        isApproved: true,
        status: true,
        interestedBrands: true,
        sellBrands: true,
        authorizedDealer: true,
        sellBrandsOther: true,
        authorizedDealersOther: true,
        resaleCertificate: true,
        createdAt: true,
      },
    });

    if (!dealerRegistration) {
      return res.status(404).json({ message: "Dealer registration not found" });
    }

    // Parse JSON string fields if they are stored as String in the database
    const formattedDealer = {
      ...dealerRegistration,
      interestedBrands: dealer.interestedBrands || [],
      sellBrands: dealer.sellBrands || [],
      authorizedDealer: dealer.authorizedDealer || [],
    };

    res.status(200).json(formattedDealer);
  } catch (error) {
    console.error("Error fetching dealer registration:", error);
    res.status(500).json({ message: "Failed to fetch dealer registration" });
  }
};

const toggleDealerRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const dealerRegistration = await prisma.dealerRegistration.findUnique({
      where: { id: parseInt(id) },
      select: {
        isApproved: true,
      },
    });

    const approveDealer = await prisma.dealerRegistration.update({
      where: { id: parseInt(id) },
      data: {
        isApproved: !dealerRegistration.isApproved,
      },
    });

    res.status(200).json(approveDealer);
  } catch (error) {
    console.error("Error fetching dealer registration:", error);
    res.status(500).json({ message: "Failed to fetch dealer registration" });
  }
};

const bulkDeleteDealerRegistrations = async (req, res) => {
  try {
    const { ids } = req.body;

    // Validation
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "ids must be a non-empty array",
      });
    }

    const result = await prisma.dealerRegistration.deleteMany({
      where: {
        id: {
          in: ids.map(Number),
        },
      },
    });

    res.status(200).json({
      message: "Dealer registrations deleted successfully",
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Error deleting dealer registrations:", error);
    res.status(500).json({
      message: "Failed to delete dealer registrations",
    });
  }
};

const updateDealerRegistration = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status, title, mobile, fax } = req.body;

    const dealer = await prisma.dealerRegistration.findUnique({
      where: { id },
    });

    if (!dealer) {
      return res.status(404).json({ message: "Dealer registration not found" });
    }

    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (title !== undefined) updateData.title = title;
    if (mobile !== undefined) updateData.mobile = mobile;
    if (fax !== undefined) updateData.fax = fax;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No changes provided" });
    }

    let shouldCreateCustomer = false;

    // ✅ TRANSACTION: DB ONLY
    const updatedDealer = await prisma.$transaction(async (tx) => {
      const updated = await tx.dealerRegistration.update({
        where: { id },
        data: updateData,
      });

      if (status === "approved" && dealer.status !== "approved") {
        const existingCustomer = await tx.customers.findUnique({
          where: { email: dealer.email },
        });

        if (!existingCustomer) {
          shouldCreateCustomer = true;
        }
      }

      return updated;
    });

    // ✅ OUTSIDE TRANSACTION (SAFE)
    if (shouldCreateCustomer) {
      const plainPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      await prisma.customers.create({
        data: {
          fullName: `${dealer.firstName} ${dealer.lastName}`,
          email: dealer.email,
          password: hashedPassword,
          isActive: true,

          billingStreet: dealer.billingStreet,
          billingCity: dealer.billingCity,
          billingState: dealer.billingState,
          billingZip: dealer.billingZip,
          billingCountry: dealer.billingCountry,

          commercialStreet: dealer.commercialStreet,
          commercialCity: dealer.commercialCity,
          commercialState: dealer.commercialState,
          commercialZip: dealer.commercialZip,
          commercialCountry: dealer.commercialCountry,
        },
      });

      await sendEmail({
        to: dealer.email,
        subject: "Your Dealer Account Has Been Approved",
        html: `
          <h2>Account Approved 🎉</h2>
          <p>Your dealer account has been approved.</p>
          <p><strong>Username:</strong> ${dealer.email}</p>
          <p><strong>Password:</strong> ${plainPassword}</p>
          <p><strong>Login Link:</strong> https://clubpromfg.com/greengrass/login</p>
          <p>Please log in and change your password immediately.</p>
        `,
      });
    }

    res.json({
      message: "Dealer registration updated successfully",
      data: updatedDealer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update dealer registration",
      error: error.message,
    });
  }
};


module.exports = {
  createDealerRegistration,
  getAllDealerRegistrationsPagination,
  getDealerRegistrationById,
  toggleDealerRegistration,
  bulkDeleteDealerRegistrations, updateDealerRegistration,
};
