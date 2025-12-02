# Seeding Users - Marketing Dashboard

Script untuk membuat user pertama (Super Admin) dan beberapa user contoh untuk testing.

## Cara Menjalankan

```bash
cd backend
npm run seed
```

## User yang Akan Dibuat

### 1. Super Admin
- **Email**: `superadmin@marketing.com`
- **Password**: `admin123`
- **Role**: SUPER_ADMIN
- **Akses**: Semua data dan fitur

### 2. Admin User
- **Email**: `admin@marketing.com`
- **Password**: `admin123`
- **Role**: ADMIN
- **Akses**: Hanya client yang di-assign

### 3. Client User
- **Email**: `client@marketing.com`
- **Password**: `client123`
- **Role**: CLIENT
- **Akses**: Hanya data mereka sendiri

## Catatan

- Script ini akan **skip** jika Super Admin sudah ada di database
- Sample Client akan dibuat otomatis untuk Admin dan Client User
- Password menggunakan hash bcrypt untuk keamanan

## Testing Login

Setelah menjalankan seed, kamu bisa login dengan credentials di atas untuk testing berbagai role.

