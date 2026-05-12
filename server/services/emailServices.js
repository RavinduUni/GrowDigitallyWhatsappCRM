import nodemailer from "nodemailer";

export const sendOtpEmail = async ({ to, name, otp }) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Grow Digitally CRM" <${process.env.SMTP_USER}>`,
        to,
        subject: "Your CRM Admin Access OTP",
        html: `
      <h2>Hello ${name},</h2>
      <p>You have been invited to access the Grow Digitally CRM system.</p>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in 10 minutes.</p>
    `,
    });
};