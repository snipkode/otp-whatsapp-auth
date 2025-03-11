import OTPService from "otp-whatsapp-auth";

const phone  = "+6282125497764";
const email  = "alamhafidz61@gmail.com";

const otpService = new OTPService({
  typeAuth: ["whatsapp", "email"],
  emailConfig: {
    service: "gmail",
    auth: { user: "your-email@gmail.com", pass: "your-password" },
  }
});

otpService.on("ready", async () => {
  const otp = otpService.generateOTP(phone);
  await otpService.sendEmail(email, otp);
  await otpService.sendWhatsapp(phone, otp);
});
