const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // REQUIRED for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"GreenGrass" <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
};

const sendNormalEmail = async (to, subject, html) => {
  return sendEmail({ to, subject, html });
};

// utils/sendResetEmail.js
// const { sendNormalEmail } = require("./sendEmail"); // your existing file

const sendResetEmail = async (to, code) => {
  const subject = "Your Password Reset Code";
  const html = `
    <div style="font-family: sans-serif; line-height: 1.5;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>We received a request to reset your password. Use the code below to reset it:</p>
      <p style="font-size: 1.5rem; font-weight: bold; color: #f9c821;">${code}</p>
      <p>This code will expire in 10 minutes.</p>
      <hr />
      <p>If you didn't request a password reset, you can ignore this email.</p>
    </div>
  `;

  return sendNormalEmail(to, subject, html);
};

module.exports = { sendEmail, sendNormalEmail, sendResetEmail };
