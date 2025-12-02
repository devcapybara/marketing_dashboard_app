# Marketing Dashboard Backend

Backend API untuk aplikasi Marketing Dashboard berbasis MERN Stack.

## Tech Stack

- Node.js + Express
- MongoDB (MongoDB Atlas)
- JWT Authentication
- Cloudinary (untuk file storage)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Buat file `.env` di root folder `backend`:
```env
PORT=4000
MONGO_URI=mongodb+srv://user:password@cluster0.xxxx.mongodb.net/marketing_dashboard
JWT_SECRET=your_secret_key_here
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. Seed users untuk testing (opsional):
```bash
npm run seed
```

Ini akan membuat Super Admin, Admin, dan Client user untuk testing.
Lihat `SEEDING.md` untuk detail credentials.

4. Jalankan server:
```bash
npm run dev
```

Server akan berjalan di `http://localhost:4000`

## API Endpoints

### Auth
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users (SUPER_ADMIN only)
- `POST /api/users/admin` - Create admin user
- `POST /api/users/client-user` - Create client user
- `GET /api/users/admins` - List admin users
- `POST /api/users/admin/:adminId/assign-client/:clientId` - Assign client to admin
- `POST /api/users/admin/:adminId/unassign-client/:clientId` - Unassign client from admin

Semua endpoint di bagian Users dilindungi oleh autentikasi dan hanya dapat diakses oleh pengguna dengan role SUPER_ADMIN.

### Clients
- `POST /api/clients` - Create client (SUPER_ADMIN, ADMIN)
- `GET /api/clients` - List clients
- `GET /api/clients/:id` - Get client detail

### Ad Accounts
- `POST /api/ad-accounts` - Create ad account
- `GET /api/ad-accounts` - List ad accounts

### Metrics
- `POST /api/metrics/daily` - Create daily metric
- `GET /api/metrics/daily` - List daily metrics

### Topups
- `POST /api/topups` - Create topup
- `GET /api/topups` - List topups

### Dashboard
- `GET /api/dashboard/super-admin` - Super admin summary
- `GET /api/dashboard/admin` - Admin summary
- `GET /api/dashboard/client` - Client summary

## Role & Access

- **SUPER_ADMIN**: Akses penuh ke semua data
- **ADMIN**: Akses ke client yang di-assign ke mereka
- **CLIENT**: Hanya akses ke data mereka sendiri

## Struktur Project

```
backend/
  src/
    config/        # Konfigurasi (env, db, cloudinary)
    controllers/   # Controllers (1 file = 1 function)
    middleware/    # Middleware (auth, role, error handler)
    models/        # MongoDB models
    routes/        # Route definitions
    services/      # Business logic (1 file = 1 function)
    utils/         # Utility functions
    app.js         # Express app setup
    server.js      # Server entry point
```

