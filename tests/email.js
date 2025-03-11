import OTPService from "../src/index.js";

const email  = "alamhafidz61@gmail.com";

const otpService = new OTPService({
  typeAuth: ["email"],
  emailConfig: {
    service: "gmail",
    auth: { user: "your-email@gmail.com", pass: "your-password" },
  }
});

const otp = otpService.generateOTP(phone);

 (async () => {
    await otpService.sendEmail(email, otp);
 })()
