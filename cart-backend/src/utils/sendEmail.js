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

module.exports = { sendEmail, sendNormalEmail };
