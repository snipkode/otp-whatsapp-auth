 
## **📌 Cara Menggunakan Library**
#### **1️⃣ Setup & Generate OTP**
```javascript
import OTPService from "otp-whatsapp-auth";

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

console.log("OTP:", otp);
```

#### **2️⃣ Kirim OTP via WhatsApp**
```javascript
await otpService.sendWhatsapp(phone, otp);
```

#### **3️⃣ Kirim OTP via Email**
```javascript
await otpService.sendEmail(email, otp);
```

#### **4️⃣ Verifikasi OTP**
```javascript
const isValid = otpService.verifyOTP(phone, otp);
console.log("OTP Valid?", isValid);
```

---

## **📌 Kelebihan Library Ini**
✅ **Support OTP via WhatsApp & Email**  
✅ **Fleksibel dengan konfigurasi (`digits`, `period`, `window`)** 
