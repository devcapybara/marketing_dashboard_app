# Troubleshooting - Seeding Users

## Error: querySrv EBADNAME _mongodb._tcp..

Error ini terjadi ketika `MONGO_URI` di file `.env` tidak lengkap atau formatnya salah.

### Solusi:

1. **Pastikan MONGO_URI sudah di-set di file `.env`**

   Buka file `backend/.env` dan pastikan ada baris:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxx.mongodb.net/marketing_dashboard
   ```

2. **Format MONGO_URI yang benar:**

   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   ```

   Contoh:
   ```env
   MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/marketing_dashboard?retryWrites=true&w=majority
   ```

3. **Cara mendapatkan MONGO_URI dari MongoDB Atlas:**

   - Login ke [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Klik "Connect" pada cluster Anda
   - Pilih "Connect your application"
   - Copy connection string
   - Ganti `<password>` dengan password database user Anda
   - Ganti `<database>` dengan nama database (misalnya: `marketing_dashboard`)

4. **Pastikan tidak ada spasi atau karakter khusus yang tidak di-escape:**

   Jika password mengandung karakter khusus seperti `@`, `#`, `%`, dll, perlu di-encode dengan URL encoding:
   - `@` menjadi `%40`
   - `#` menjadi `%23`
   - `%` menjadi `%25`
   - dll

5. **Test koneksi:**

   Setelah memperbaiki MONGO_URI, coba jalankan seed lagi:
   ```bash
   npm run seed
   ```

## Error: Authentication failed

Jika muncul error authentication failed, berarti:
- Username atau password salah
- Database user tidak memiliki akses ke database yang dimaksud

**Solusi:**
- Pastikan username dan password benar di MongoDB Atlas
- Pastikan database user memiliki read/write access

## Warning: Duplicate schema index

Warning ini sudah diperbaiki di code. Jika masih muncul, restart server atau clear MongoDB cache.

---

Jika masih ada masalah, pastikan:
1. MongoDB Atlas cluster sudah running
2. IP address Anda sudah di-whitelist di MongoDB Atlas Network Access
3. Internet connection stabil

