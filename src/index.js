import { EventEmitter } from "events";
import * as OTPAuth from "otpauth";
import whatsapp from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import nodemailer from "nodemailer";

class OTPService extends EventEmitter {
  constructor(config = {}) {
    super();
    this.otpSecrets = new Map();
    this.config = {
      digits: config.digits || 6,
      period: config.period || 60,
      window: config.window || 1,
      typeAuth: config.typeAuth || ["email", "whatsapp"],
      emailConfig: config.emailConfig || null,
    };

    this.whatsappReady = false;

    if (this.config.typeAuth.includes("whatsapp")) {
      this.initWhatsApp();
    }
  }

  initWhatsApp() {
    this.whatsappClient = new whatsapp.Client({
      authStrategy: new whatsapp.LocalAuth(),
    });

    this.whatsappClient.on("qr", (qr) => {
      console.log("📌 Scan QR untuk login WhatsApp:");
      qrcode.generate(qr, { small: true });
    });

    this.whatsappClient.on("ready", () => {
      console.log("✅ WhatsApp Bot siap digunakan.");
      this.whatsappReady = true;
      this.emit("ready");
    });

    this.whatsappClient.initialize();
  }

  generateOTP(identifier) {
    const secret = new OTPAuth.Secret({ size: 20 });
    this.otpSecrets.set(identifier, secret.base32);

    const totp = new OTPAuth.TOTP({
      secret: secret,
      digits: this.config.digits,
      period: this.config.period,
    });

    return totp.generate();
  }

  verifyOTP(identifier, otp) {
    const secretBase32 = this.otpSecrets.get(identifier);
    if (!secretBase32) return false;

    const totp = new OTPAuth.TOTP({
      secret: OTPAuth.Secret.fromBase32(secretBase32),
      digits: this.config.digits,
      period: this.config.period,
    });

    const isValid = totp.validate({ token: otp, window: this.config.window }) !== null;
    if (isValid) {
      this.otpSecrets.delete(identifier);
    }

    return isValid;
  }

  async sendOTP(identifier, otp) {
    if (this.config.typeAuth.includes("whatsapp") && identifier.startsWith("+") && this.whatsappReady) {
      await this.sendWhatsapp(identifier, otp);
    }

    if (this.config.typeAuth.includes("email") && identifier.includes("@")) {
      await this.sendEmail(identifier, otp);
    }
  }

  async sendWhatsapp(phone, otp) {
    if (!this.whatsappReady) {
      console.error("❌ WhatsApp Bot belum siap. Tunggu event 'ready'.");
      return;
    }
    try {
      const message = `🔐 Kode OTP Anda: *${otp}*\nJangan bagikan kode ini kepada siapa pun.`;
      await this.whatsappClient.sendMessage(`${phone}@c.us`, message);
      console.log(`✅ OTP terkirim ke WhatsApp ${phone}`);
    } catch (error) {
      console.error("❌ Gagal mengirim OTP ke WhatsApp:", error);
    }
  }

  async sendEmail(email, otp) {
    if (!this.config.emailConfig) {
      console.error("❌ Konfigurasi email belum disetup.");
      return;
    }
    const transporter = nodemailer.createTransport(this.config.emailConfig);
    const mailOptions = {
      from: this.config.emailConfig.auth.user,
      to: email,
      subject: "Kode OTP Anda",
      text: `Kode OTP Anda: ${otp}\nJangan bagikan kode ini kepada siapa pun.`,
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ OTP terkirim ke email ${email}`);
    } catch (error) {
      console.error("❌ Gagal mengirim OTP ke email:", error);
    }
  }
}

export default OTPService;
