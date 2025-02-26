const nodemailer = require("nodemailer");

// Send Email
module.exports.sendCustomEmail = async (to, subject, messageBody) => {
  try {
    // Configure Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email Options
    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to,
      subject,
      text: messageBody,
    };

    // Send Email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send email");
  }
};
