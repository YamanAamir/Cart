const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const { sendEmail } = require("../utils/sendEmail");

const prisma = new PrismaClient();

// Configure email transporter (for admin notifications)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // true for port 465 (SSL)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Email template for admin notification
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
        <div class="header"><h1>New Dealer Registration</h1></div>
        <div class="content">
          <p>A new dealer has registered on the platform.</p>
          <div class="info-row"><span class="label">Name:</span> ${dealer.firstName || ""} ${dealer.lastName || ""}</div>
          <div class="info-row"><span class="label">Email:</span> ${dealer.email || "N/A"}</div>
          <div class="info-row"><span class="label">Phone:</span> ${dealer.phone || "N/A"}</div>
          <div class="info-row"><span class="label">Company:</span> ${dealer.companyName || "N/A"}</div>
          <div class="info-row"><span class="label">Interested Brands:</span> ${Array.isArray(dealer.interestedBrands) ? dealer.interestedBrands.join(", ") : "None"}</div>
          <div class="info-row"><span class="label">Sell Brands:</span> ${Array.isArray(dealer.sellBrands) ? dealer.sellBrands.join(", ") : "None"}</div>
          <div class="info-row"><span class="label">Authorized Dealer:</span> ${Array.isArray(dealer.authorizedDealer) ? dealer.authorizedDealer.join(", ") : "None"}</div>
          <div class="info-row"><span class="label">Registration Date:</span> ${new Date().toLocaleDateString()}</div>
        </div>
        <div class="footer"><p>This is an automated message. Please do not reply.</p></div>
      </div>
    </body>
    </html>
  `;
};

// Send email via local transporter
const sendNormalEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({ from: process.env.FROM_EMAIL, to, subject, html });
    return { success: true };
  } catch (error) {
    console.error("     led:", error);
    return { success: false, error: error.message };
  }
};

// ==================== CREATE ====================
const createDealerRegistration = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const data = req.body;
    const email = data.email;

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
      resaleCertificate = `/uploads/registrations/${req.file.filename}`;
    }

    // Generate password at registration time
    const plainPassword = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Save dealer registration
    const dealer = await prisma.dealerRegistration.create({
      data: {
        ...data,
        resaleCertificate,
        interestedBrands: data.interestedBrands || [],
        sellBrands: data.sellBrands || [],
        authorizedDealer: data.authorizedDealer || [],
      },
    });

    // Create or update customer account (inactive until approved)
    const existingCustomer = await prisma.customers.findUnique({ where: { email } });
    if (!existingCustomer) {
      await prisma.customers.create({
        data: {
          fullName: `${data.firstName} ${data.lastName}`,
          email: data.email,
          password: hashedPassword,
          isActive: false,
          billingStreet: data.billingStreet || "",
          billingCity: data.billingCity || "",
          billingState: data.billingState || "",
          billingZip: data.billingZip || "",
          billingCountry: data.billingCountry || "",
          commercialStreet: data.commercialStreet || "",
          commercialCity: data.commercialCity || "",
          commercialState: data.commercialState || "",
          commercialZip: data.commercialZip || "",
          commercialCountry: data.commercialCountry || "",
        },
      });
    } else {
      // Customer already exists — update password with new hash
      await prisma.customers.update({
        where: { email },
        data: {
          password: hashedPassword,
          isActive: false,
        },
      });
    }

    // Notify admin
    await sendNormalEmail(
      "prehodacpro@gmail.com",
      "New Dealer Registration",
      getDealerEmailTemplate(dealer)
    );

    // Send credentials to dealer
    await sendEmail({
      to: data.email,
      subject: "Your Dealer Account Application Has Been Received",
      html: `
        <h2>Application Received</h2>
        <p>Dear ${data.firstName},</p>
        <p>Thank you for registering with ClubPro GreenGrass. Your application has been received and is currently under review.</p>
        <p>Our team will review your application and notify you once it has been approved (typically within 2-3 business days).</p>
        <p>Once approved, you will receive a separate confirmation email and will be able to log in using:</p>
        <p><strong>Username (Email):</strong> ${data.email}</p>
        <p><strong>Temporary Password:</strong> ${plainPassword}</p>
        <p><strong>Login Link:</strong> <a href="https://clubpromfg.com/greengrass/login">https://clubpromfg.com/greengrass/login</a></p>
        <p><em>Note: Your account will only be active after approval. Please do not attempt to log in until you receive the approval email.</em></p>
        <p>Best regards,<br>ClubPro GreenGrass Team</p>
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
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ==================== GET ALL (PAGINATED) ====================
const getAllDealerRegistrationsPagination = async (req, res) => {
  const { page = 1, limit = 10, search = "", sort = "createdAt", order = "desc" } = req.query;
  const skip = (page - 1) * limit;

  try {
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
          id: true, companyName: true, title: true, firstName: true, lastName: true,
          email: true, phone: true, mobile: true, fax: true,
          billingStreet: true, billingCity: true, billingState: true, billingZip: true, billingCountry: true,
          commercialStreet: true, commercialCity: true, commercialState: true, commercialZip: true, commercialCountry: true,
          hasShowroom: true, isApproved: true, status: true,
          interestedBrands: true, sellBrands: true, authorizedDealer: true,
          sellBrandsOther: true, authorizedDealersOther: true, resaleCertificate: true, createdAt: true,
        },
      }),
      prisma.dealerRegistration.count({ where }),
    ]);

    const formattedDealers = dealers.map((d) => ({
      ...d,
      interestedBrands: d.interestedBrands || [],
      sellBrands: d.sellBrands || [],
      authorizedDealer: d.authorizedDealer || [],
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
const getDealerRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;

    const dealerRegistration = await prisma.dealerRegistration.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true, companyName: true, title: true, firstName: true, lastName: true,
        email: true, phone: true, mobile: true, fax: true,
        billingStreet: true, billingCity: true, billingState: true, billingZip: true, billingCountry: true,
        commercialStreet: true, commercialCity: true, commercialState: true, commercialZip: true, commercialCountry: true,
        hasShowroom: true, isApproved: true, status: true,
        interestedBrands: true, sellBrands: true, authorizedDealer: true,
        sellBrandsOther: true, authorizedDealersOther: true, resaleCertificate: true, createdAt: true,
      },
    });

    if (!dealerRegistration) {
      return res.status(404).json({ message: "Dealer registration not found" });
    }

    res.status(200).json({
      ...dealerRegistration,
      interestedBrands: dealerRegistration.interestedBrands || [],
      sellBrands: dealerRegistration.sellBrands || [],
      authorizedDealer: dealerRegistration.authorizedDealer || [],
    });
  } catch (error) {
    console.error("Error fetching dealer registration:", error);
    res.status(500).json({ message: "Failed to fetch dealer registration" });
  }
};

// ==================== TOGGLE APPROVED ====================
const toggleDealerRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const dealerRegistration = await prisma.dealerRegistration.findUnique({
      where: { id: parseInt(id) },
    });

    const newApprovedStatus = !dealerRegistration.isApproved;

    const approveDealer = await prisma.dealerRegistration.update({
      where: { id: parseInt(id) },
      data: { isApproved: newApprovedStatus },
    });

    // If approving, activate customer account
    if (newApprovedStatus === true) {
      const existingCustomer = await prisma.customers.findUnique({
        where: { email: dealerRegistration.email },
      });

      if (existingCustomer) {
        await prisma.customers.update({
          where: { email: dealerRegistration.email },
          data: { isActive: true },
        });
        console.log(`Customer activated: ${dealerRegistration.email}`);
      }
    } else {
      // If un-approving, deactivate customer
      const existingCustomer = await prisma.customers.findUnique({
        where: { email: dealerRegistration.email },
      });
      if (existingCustomer) {
        await prisma.customers.update({
          where: { email: dealerRegistration.email },
          data: { isActive: false },
        });
      }
    }

    res.status(200).json(approveDealer);
  } catch (error) {
    console.error("Error toggling dealer registration:", error);
    res.status(500).json({ message: "Failed to toggle dealer registration" });
  }
};

// ==================== BULK DELETE ====================
const bulkDeleteDealerRegistrations = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "ids must be a non-empty array" });
    }

    const result = await prisma.dealerRegistration.deleteMany({
      where: { id: { in: ids.map(Number) } },
    });

    res.status(200).json({
      message: "Dealer registrations deleted successfully",
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Error deleting dealer registrations:", error);
    res.status(500).json({ message: "Failed to delete dealer registrations" });
  }
};

// ==================== UPDATE (STATUS / APPROVE) ====================
const updateDealerRegistration = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status, title, mobile, fax } = req.body;

    const dealer = await prisma.dealerRegistration.findUnique({ where: { id } });

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

    // Update dealer registration
    const updatedDealer = await prisma.dealerRegistration.update({
      where: { id },
      data: updateData,
    });

    // If status changed to approved, activate customer and send email
    if (status === "approved" && dealer.status !== "approved") {
      console.log(`Dealer ${dealer.email} approved — sending email...`);

      const existingCustomer = await prisma.customers.findUnique({
        where: { email: dealer.email },
      });

      if (existingCustomer) {
        // Activate the customer account
        await prisma.customers.update({
          where: { email: dealer.email },
          data: { isActive: true },
        });

        await sendEmail({
          to: dealer.email,
          subject: "Your Dealer Account Has Been Approved",
          html: `
            <h2>Account Approved 🎉</h2>
            <p>Dear ${dealer.firstName},</p>
            <p>Your dealer account has been approved. You can now log in.</p>
            <p><strong>Username:</strong> ${dealer.email}</p>
            <p><strong>Login Link:</strong> <a href="https://clubpromfg.com/greengrass/login">https://clubpromfg.com/greengrass/login</a></p>
            <p>Use the temporary password that was sent to you during registration. Please change it after logging in.</p>
            <p>Best regards,<br>ClubPro GreenGrass Team</p>
          `,
        });

        console.log(`Approval email sent to ${dealer.email}`);
      } else {
        // Fallback: customer not found, create new one with fresh password
        console.log(`Customer not found for ${dealer.email} — creating new account...`);
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
            <p>Dear ${dealer.firstName},</p>
            <p>Your dealer account has been approved.</p>
            <p><strong>Username:</strong> ${dealer.email}</p>
            <p><strong>Temporary Password:</strong> ${plainPassword}</p>
            <p><strong>Login Link:</strong> <a href="https://clubpromfg.com/greengrass/login">https://clubpromfg.com/greengrass/login</a></p>
            <p>Please log in and change your password immediately.</p>
            <p>Best regards,<br>ClubPro GreenGrass Team</p>
          `,
        });

        console.log(`Approval email with new password sent to ${dealer.email}`);
      }
    }

    res.json({
      message: "Dealer registration updated successfully",
      data: updatedDealer,
    });
  } catch (error) {
    console.error("updateDealerRegistration error:", error);
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
  bulkDeleteDealerRegistrations,
  updateDealerRegistration,
};
