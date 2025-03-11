import * as OTPAuth from "otpauth";
import whatsapp from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import nodemailer from "nodemailer";

class OTPService {
  constructor(config = {}) {
    this.otpSecrets = new Map();
    this.config = {
      digits: config.digits || 6,
      period: config.period || 60,
      window: config.window || 1,
      emailConfig: config.emailConfig || null,
    };

    // Setup WhatsApp Client
    this.whatsappClient = new whatsapp.Client({
      authStrategy: new whatsapp.LocalAuth(),
    });

    this.whatsappClient.on("qr", (qr) => {
      console.log("Scan QR untuk login WhatsApp:");
      qrcode.generate(qr, { small: true });
    });

    this.whatsappClient.on("ready", () => {
      console.log("WhatsApp Bot siap digunakan.");
    });

    this.whatsappClient.initialize();
  }

  get secretKeys() {
    return [...this.otpSecrets]; // Mengembalikan semua key dalam Map
  }

  /**
   * Generate OTP dengan konfigurasi yang dapat disesuaikan
   * @param {string} identifier - ID unik (misalnya nomor HP atau email)
   * @returns {string} - OTP yang dihasilkan
   */
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

  /**
   * Verifikasi OTP berdasarkan ID unik
   * @param {string} identifier - ID unik yang digunakan saat generate OTP
   * @param {string} otp - OTP yang dimasukkan pengguna
   * @returns {boolean} - Status validasi OTP (true/false)
   */
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
      this.otpSecrets.delete(identifier); // Hapus OTP setelah berhasil diverifikasi
    }

    return isValid;
  }

  /**
   * Kirim OTP ke WhatsApp menggunakan whatsapp-web.js
   * @param {string} phone - Nomor WhatsApp penerima (format internasional)
   * @param {string} otp - OTP yang akan dikirim
   */
  async sendWhatsapp(phone, otp) {
    try {
      const message = `🔐 Kode OTP Anda: *${otp}*\nJangan bagikan kode ini kepada siapa pun.`;
      await this.whatsappClient.sendMessage(phone + "@c.us", message);
      console.log(`✅ OTP terkirim ke WhatsApp ${phone}`);
    } catch (error) {
      console.error("❌ Gagal mengirim OTP ke WhatsApp:", error);
    }
  }

  /**
   * Kirim OTP ke Email menggunakan nodemailer
   * @param {string} email - Email penerima
   * @param {string} otp - OTP yang akan dikirim
   */
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
