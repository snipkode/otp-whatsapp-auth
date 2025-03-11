# Dokumentasi OTP Service

## Pendahuluan
OTP Service adalah library Node.js yang memungkinkan pembuatan, verifikasi, dan pengiriman OTP melalui WhatsApp dan Email. Pengguna dapat memilih metode autentikasi yang digunakan saat melakukan instansiasi.

## Instalasi
Pastikan Anda memiliki Node.js terinstal, lalu jalankan perintah berikut:

```sh
npm install otp-whatsapp-auth
```

## Penggunaan
### Import Library
```js
import OTPService from "otp-whatsapp-auth";
```

### Konfigurasi dan Inisialisasi
Anda dapat memilih metode autentikasi yang digunakan dengan menyertakan opsi `typeAuth` dalam bentuk array.

```js
import OTPService from "../src/index.js";

const phone  = "6285121040470";

const otpService = new OTPService({
  typeAuth: ["whatsapp"],
});

otpService.on("ready", async () => {
  const otp = otpService.generateOTP(phone);
  await otpService.sendWhatsapp(phone, otp);
});

```

Jika hanya satu metode yang digunakan, cukup isi satu elemen dalam array `typeAuth`:
```js
const otpService = new OTPService({ typeAuth: ["email"] });
```

### Generate OTP
```js
const otp = otpService.generateOTP("user@example.com");
console.log("OTP yang dihasilkan:", otp);
```

### Verifikasi OTP
```js
const isValid = otpService.verifyOTP("user@example.com", "123456");
console.log("OTP Valid:", isValid);
```

### Mengirim OTP ke WhatsApp
```js
otpService.sendWhatsapp("6281234567890", "123456");
```

### Mengirim OTP ke Email
```js
otpService.sendEmail("user@example.com", "123456");
```

## Konfigurasi Tambahan
| Opsi | Tipe | Default | Deskripsi |
|------|------|---------|-----------|
| `digits` | Number | 6 | Jumlah digit dalam OTP |
| `period` | Number | 60 | Waktu validitas OTP (detik) |
| `window` | Number | 1 | Toleransi waktu validasi OTP |
| `typeAuth` | Array | `["email", "whatsapp"]` | Metode pengiriman OTP |
| `emailConfig` | Object | `null` | Konfigurasi SMTP untuk pengiriman email OTP |

## Event
### WhatsApp Client Ready
Ketika WhatsApp siap digunakan, event `ready` akan dipicu:
```js
otpService.whatsappClient.on("ready", () => {
  console.log("WhatsApp bot siap!");
});
```

## Kesimpulan
OTP Service adalah solusi sederhana dan fleksibel untuk mengelola OTP di aplikasi Node.js dengan dukungan WhatsApp dan Email. Gunakan dengan bijak untuk keamanan aplikasi Anda!

