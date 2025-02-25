const OTP = require("../models/otpModel");

module.exports.otpVerify = async (email, otp) => {
    // Find the OTP record by email
    const storedOtp = await OTP.findOne({ email });

    if (!storedOtp) {
        return false; // No OTP found
    }

    const { otp: storedOtpValue, expiresAt } = storedOtp;

    // 🔹 Check if OTP is expired
    if (Date.now() > expiresAt) {
        await OTP.deleteOne({ email }); // Remove expired OTP
        return false;
    }

    // 🔹 Compare the provided OTP with the stored OTP
    if (storedOtpValue !== otp) {
        return false;
    }

    // 🔹 OTP is valid, remove it from DB after verification
    await OTP.deleteOne({ email });

    return true; // OTP verified successfully
};
