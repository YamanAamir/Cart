// routes/contact.js
const express = require('express');
const router = express.Router();

const sendEmail = require('../utils/sendEmail'); // your existing nodemailer function

// POST /api/contact
router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address',
    });
  }

  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #1f2937; border-bottom: 3px solid #f9c821; padding-bottom: 12px;">
          New Message from GreenGrass Contact Form
        </h2>
        
        <p style="margin: 16px 0; color: #4b5563;"><strong>Name:</strong> ${name.trim()}</p>
        <p style="margin: 16px 0; color: #4b5563;"><strong>Email:</strong> ${email.trim()}</p>
        <p style="margin: 16px 0; color: #4b5563;"><strong>Subject:</strong> ${subject.trim()}</p>
        
        <div style="margin: 32px 0; padding: 20px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #f9c821;">
          <strong style="display: block; margin-bottom: 12px; color: #1f2937;">Message:</strong>
          <p style="margin: 0; color: #374151; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
        </div>

        <footer style="margin-top: 40px; font-size: 0.9em; color: #9ca3af;">
          Sent via GreenGrass website • ${new Date().toLocaleString('en-US', { timeZone: 'Europe/Amsterdam' })}
        </footer>
      </div>
    `;

    await sendEmail({
      to: 'info@clubpro.com',
      subject: `Contact Form: ${subject.trim()}`,
      html: htmlContent,
    });

    return res.status(200).json({
      success: true,
      message: 'Thank you Muhammad! Your message has been sent successfully.',
    });
  } catch (error) {
    console.error('Contact form email error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
    });
  }
});

module.exports = router;