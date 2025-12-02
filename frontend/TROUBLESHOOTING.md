# Troubleshooting - Login Failed

## Checklist untuk Debug Login Failed

### 1. Pastikan Backend Server Jalan

```bash
cd D:\Aplikasi\backend
npm run dev
```

Backend harus jalan di `http://localhost:4000`

Test dengan buka browser: `http://localhost:4000/health`
Harus return: `{"status":"ok","environment":"development"}`

### 2. Pastikan Frontend Server Jalan

```bash
cd D:\Aplikasi\frontend
npm run dev
```

Frontend harus jalan di `http://localhost:3000`

### 3. Cek Browser Console

Buka browser DevTools (F12) → Console tab, lihat apakah ada error:
- Network error → Backend tidak jalan atau CORS issue
- 401 Unauthorized → Email/password salah
- 404 Not Found → API endpoint salah
- CORS error → Backend CORS tidak dikonfigurasi dengan benar

### 4. Cek Network Tab

Buka browser DevTools → Network tab:
- Cari request ke `/api/auth/login`
- Lihat status code:
  - 200 = Success (tapi mungkin ada masalah di response parsing)
  - 401 = Unauthorized (email/password salah)
  - 404 = Endpoint tidak ditemukan
  - 500 = Server error
- Lihat Response untuk melihat pesan error dari backend

### 5. Test dengan Credentials yang Benar

Pastikan menggunakan credentials yang benar:
- **Super Admin**: `superadmin@marketing.com` / `admin123`
- **Admin**: `admin@marketing.com` / `admin123`
- **Client**: `client@marketing.com` / `client123`

### 6. Cek MongoDB Connection

Pastikan MongoDB Atlas:
- Cluster sudah running
- IP address sudah di-whitelist
- Database user memiliki akses read/write

### 7. Cek Environment Variables

Pastikan file `frontend/.env` ada dan berisi:
```env
VITE_API_URL=http://localhost:4000
```

Atau biarkan kosong untuk menggunakan Vite proxy.

---

## Common Issues

### Issue: "Cannot connect to server"
**Solution**: Pastikan backend server jalan di port 4000

### Issue: "Invalid email or password"
**Solution**: 
- Pastikan email dan password benar
- Pastikan user sudah dibuat dengan `npm run seed`
- Cek di MongoDB apakah user ada

### Issue: CORS Error
**Solution**: Backend sudah menggunakan `cors()` middleware, seharusnya tidak ada CORS issue. Jika masih ada, restart backend server.

### Issue: Network Error
**Solution**: 
- Cek apakah backend server jalan
- Cek firewall/antivirus yang mungkin block connection
- Cek apakah port 4000 sudah digunakan aplikasi lain

---

Jika masih ada masalah, cek console log di browser dan backend terminal untuk error details.

