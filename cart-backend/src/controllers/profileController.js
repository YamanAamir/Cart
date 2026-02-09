const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");





exports.getProfile = async (req, res) => {
  try {
    const customer = await prisma.customers.findUnique({
      where: { id: req.user.id },
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
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!customer) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

/**
 * GET SINGLE CUSTOMER
 */
exports.updateProfile = async (req, res) => {
  const {
    fullName,
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

  // Optional: Check if there's anything to update
  if (
    !fullName &&
    !billingStreet &&
    !billingCity &&
    !billingState &&
    !billingZip &&
    !billingCountry &&
    !commercialStreet &&
    !commercialCity &&
    !commercialState &&
    !commercialZip && 
    !commercialCountry
  ) {
    return res.status(400).json({ error: 'No data provided to update' });
  }
  const customerId = req.user?.id; // or wherever you get the logged-in customer's id

  if (!customerId) {
    return res.status(400).json({ message: "Customer ID is required" });
  }

  try {
    const updatedCustomer = await prisma.customers.update({
      where: { id: customerId  },
      data: {
        fullName,
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
        updatedAt: new Date(),
      },
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
        updatedAt: true,
      },
    });

    res.json({
      message: 'Profile updated successfully',
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.code === 'P2025') { // Prisma record not found
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

/**
 * UPDATE CUSTOMER
 */
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password are required' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long' });
  }

  try {
    // 1. Fetch user with password
    const customer = await prisma.customers.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        password: true,
      },
    });

    if (!customer) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 2. Verify old password
    const isMatch = await bcrypt.compare(oldPassword, customer.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // 3. Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // 4. Update password
    await prisma.customers.update({
      where: { id: req.user.id },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date(),
      },
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};






