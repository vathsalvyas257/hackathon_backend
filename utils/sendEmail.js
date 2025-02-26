const nodemailer=require("nodemailer");



// Generate OTP
module.exports.generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

// Send OTP via Email
module.exports.sendOTPEmail = async (email, otp) => {
  try {
    // Configure Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // Email Options
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your OTP for Verification',
      text: `Your One-Time Password (OTP) is: ${otp}. This OTP is valid for 10 minutes.`,
    };

    // Send Email
    await transporter.sendMail(mailOptions);
    // console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error.message);
    throw new Error('Failed to send OTP email');
  }
};
