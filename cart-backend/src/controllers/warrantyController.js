const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sendEmail, sendNormalEmail } = require("../utils/sendEmail");

const registerWarranty = async (req, res) => {
  try {
    const { name, address, email, phone, model, purchase, discount } = req.body;

    if (!name?.trim() || !address?.trim() || !email?.trim() || !model?.trim()) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const purchaseDate = purchase ? new Date(purchase) : new Date();
    if (isNaN(purchaseDate)) {
      return res.status(400).json({ message: "Invalid purchase date" });
    }

    const newRegistration = await prisma.warranty.create({
      data: {
        name,
        address,
        email,
        phone: phone || null,
        model,
        purchase: purchaseDate,
        discount: discount === "yes",
        registeredAt: new Date(),
      },
    });

    const adminEmail = "prehodacpro@gmail.com";
    // Notify admin
    await sendNormalEmail(
      adminEmail,
      "New Warranty Registration",
      `<p>New warranty registered:</p>
   <ul>
     <li>Name: ${name}</li>
     <li>Email: ${email}</li>
     <li>Phone: ${phone || "-"}</li>
     <li>Address: ${address}</li>
     <li>Model: ${model}</li>
     <li>Purchase Date: ${purchaseDate.toDateString()}</li>
     <li>Discount: ${discount === true ? "Yes" : "No"}</li>
   </ul>`
    );

    // Notify user
    await sendEmail({
      to: email,
      subject: "Warranty Registration Confirmation",
      html: `
    <h2>Thank You for Registering Your Warranty</h2>
    <p>Hi ${name},</p>
    <p>Your warranty registration for the model <strong>${model}</strong> has been successfully received.</p>
    <p>Our team will review the details and contact you if needed.</p>
    <p>Regards,<br/>GreenGrass Team</p>
  `,
    });


    res.status(201).json({
      message: "Warranty registered successfully. Confirmation email sent to user and admin.",
      warranty: newRegistration,
    });
  } catch (error) {
    console.error("Warranty registration error:", error);
    res.status(500).json({ message: "Failed to register warranty" });
  }
};

module.exports = { registerWarranty };
