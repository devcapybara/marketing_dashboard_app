# Marketing Dashboard

## Fitur Utama

- Page Builder dinamis untuk Admin/Super Admin (`/site/builder`), dengan endpoint publik `GET /api/pages/public/:slug` dan route `'/p/:slug'`.
- CRM Leads Management untuk Client/Admin/Super Admin (`/leads`): kolom lengkap, dropdown dapat diatur per client, update status/follow‑up langsung di tabel.
- Dashboard per role (Super Admin, Admin, Client) dengan kartu ringkasan dan chart.
- Custom Fields untuk Daily Metrics, Topup management dengan upload ke Cloudinary.

## Menjalankan Proyek

- Backend: `cd backend` lalu `npm start`
- Frontend: `cd frontend` lalu `npm run dev`

Pastikan environment variabel sudah diisi.

## Environment

- Backend `backend/src/config/env.js` menggunakan variabel:
  - `PORT`, `MONGO_URI`, `JWT_SECRET`, `NODE_ENV`
  - Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Frontend menggunakan `VITE_API_URL` (opsional; dev memakai proxy).

## Akun Seed (Testing)

- Super Admin: email lihat di `SEEDING.md`, password `admin123`
- Client: email lihat di `SEEDING.md`, password `client123`

## Akses & Peran

- Super Admin: akses penuh, termasuk semua Pages dan Leads seluruh client.
- Admin: akses Pages builder, Leads untuk client yang dikelola (`managedClientIds`).
- Client: akses Leads miliknya; dapat mengubah dropdown (Sumber, Status, CS PIC) untuk client terkait.

## Endpoint Penting

- Pages
  - Publik: `GET /api/pages/public/:slug` (hanya `isPublished=true`)
  - Admin/Admin PIC: `GET/POST/PUT/DELETE /api/pages/*` (Admin terbatas pada `createdBy`)
- Leads
  - List/Create: `GET/POST /api/leads?clientId=...` (validasi akses client)
  - Detail/Update/Delete: `GET/PUT/DELETE /api/leads/:id` (cek kepemilikan client lead)
- Pengaturan Leads per Client
  - `PUT /api/clients/:id/lead-settings` untuk memperbarui `leadSourceOptions`, `leadStatusOptions`, `csPicOptions`

## Penggunaan Page Builder

- Buka `'/site/builder'` (Admin/Super Admin), isi `Title` dan `Slug`, tambah Section/Widget.
- Centang `Publish` agar tersedia di publik `'/p/<slug>'`. Slug `home` akan menggantikan landing default.

## Penggunaan CRM Leads

- Buka `'/leads'`.
- Admin memilih client dari dropdown, Client otomatis memakai `clientId` miliknya.
- Tambah lead di form kanan; edit status/CS PIC/sumber dan tanggal follow‑up langsung di tabel.
- Atur dropdown per client di panel “Pengaturan Dropdown”.

## Struktur Proyek

```
Aplikasi/
├── backend/
│   ├── src/
│   │   ├── models/ (Client, Lead, Page, dll)
│   │   ├── routes/ (pages, leads, clients, auth, dll)
│   │   ├── controllers/ (1 file = 1 function)
│   │   ├── services/ (1 file = 1 function)
│   │   └── middleware/
├── frontend/
│   ├── src/
│   │   ├── pages/ (dashboard, leads, site, auth)
│   │   ├── components/ (layout, common, site renderer)
│   │   └── services/
└── README.md
```

## Catatan

- Arsitektur multi‑tenant: akses dibatasi per role dan client.
- Tidak menyimpan file lokal; upload memakai Cloudinary.
- Ikuti pola codebase: 1 file = 1 function untuk controller/service.

