import OTPService from "../src/index.js";

const phone  = "+6282125497764";

const otpService = new OTPService({
  typeAuth: ["whatsapp"],
});

otpService.on("ready", async () => {
  const otp = otpService.generateOTP(phone);
  await otpService.sendWhatsapp(phone, otp);
});
