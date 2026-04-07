import nodemailer from "nodemailer";

const transpoter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Must be false for 587
  // This forces the connection to use IPv4
  family: 4, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: "TLSv1.2"
  }
});

export const sendVerificationOtp = (email, subject, message) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: subject,
    text: message,
  };
  return transpoter.sendMail(mailOptions);
};

export const generateOTP = () => {
  let otp = "";

  for (let i = 1; i <= 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }

  return otp;
};
