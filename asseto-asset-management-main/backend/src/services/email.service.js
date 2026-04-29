import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendPasswordResetEmail = async (email, resetUrl) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Asseto" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="background:#4F46E5;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none;">Reset Password</a>
      <p>This link expires in 1 hour.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  });
};

export const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Asseto" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Asseto',
    html: `
      <h2>Welcome, ${name}!</h2>
      <p>Your account has been created on Asseto Asset Management System.</p>
      <p>You can now log in and start managing your assets.</p>
    `,
  });
};

export const sendNotificationEmail = async (email, title, body) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Asseto" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: title,
    html: `
      <h2>${title}</h2>
      <p>${body}</p>
    `,
  });
};
