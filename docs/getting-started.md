# Getting Started

## Prasyarat
- Node.js 18+ dan npm
- Akses ke MongoDB Atlas (isi `MONGO_URI`)
- Akun Cloudinary (opsional; diperlukan untuk upload bukti topup)

## Environment
- Backend mengacu ke [env.js](file:///d:/Aplikasi/backend/src/config/env.js) dengan variabel:
  - `PORT`, `MONGO_URI`, `JWT_SECRET`, `NODE_ENV`
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Frontend dapat memakai `VITE_API_URL` (opsional; dev bisa menggunakan proxy bawaan Vite).

## Instalasi
```bash
cd backend && npm install
cd ../frontend && npm install
```

## Menjalankan
- Backend (development): `cd backend && npm run dev`
- Backend (production): `cd backend && npm start`
- Frontend (development): `cd frontend && npm run dev`
- Frontend (preview build): `cd frontend && npm run preview`

## Seeding & Akun Uji
- Panduan seeding: [SEEDING.md](file:///d:/Aplikasi/backend/SEEDING.md)
- Ringkasan akun uji: lihat [README.md](file:///d:/Aplikasi/README.md) bagian “Akun Seed (Testing)”.

## Hak Akses
- Autentikasi JWT diterapkan via middleware:
  - [authMiddleware](file:///d:/Aplikasi/backend/src/middleware/authMiddleware.js)
  - [roleMiddleware](file:///d:/Aplikasi/backend/src/middleware/roleMiddleware.js)
- Peran: Super Admin, Admin, Client — lihat [README.md](file:///d:/Aplikasi/README.md#L29-L34).

