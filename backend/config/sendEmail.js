import nodemailer from "nodemailer";
import dns from "dns";

// Force Node to use IPv4 first for all network requests
dns.setDefaultResultOrder('ipv4first');

const transpoter = nodemailer.createTransport({
  host: '142.250.141.108', // This is one of smtp.gmail.com's IPv4 addresses
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    servername: 'smtp.gmail.com' // Necessary when using a direct IP
  }
});

transpoter.verify((error, success) => {
  if (error) {
    console.log("Transporter connection error: ", error);
  } else {
    console.log("Server is ready to take our messages");
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
