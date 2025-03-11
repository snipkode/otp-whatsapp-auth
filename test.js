import OTPService from "./src/index.js";

const otpService = new OTPService({
  digits: 6,
  period: 60,
  window: 1,
  emailConfig: {
    service: "gmail",
    auth: {
      user: "your-email@gmail.com",
      pass: "your-email-password",
    },
  },
});

const phone = "+6281234567890";
const email = "user@example.com";
const otp = otpService.generateOTP(phone);
const secret = otpService.secretKeys;

console.log("OTP:", otp);
console.log("MAP Secrets", secret);
