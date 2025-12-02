# Marketing Dashboard - Application Guide & Development Roadmap

## 📖 Deskripsi Aplikasi

**Marketing Dashboard** adalah aplikasi berbasis web untuk mengelola dan melacak performa iklan digital marketing. Aplikasi ini dirancang khusus untuk digital marketer yang mengelola banyak klien dan perlu mengumpulkan data performa iklan dari berbagai platform (Meta, TikTok, Google, dll) dalam satu dashboard terpusat.

### Masalah yang Diselesaikan

Sebelumnya, digital marketer menggunakan banyak file spreadsheet untuk setiap klien, yang menyebabkan:
- Data tidak terorganisir dengan baik
- Sulit untuk tracking dan analisis
- Banyak file yang sulit dikelola
- Data yang berulang-ulang harus diinput manual berkali-kali

Aplikasi ini menyelesaikan masalah tersebut dengan:
- ✅ Semua data klien dalam satu sistem terpusat
- ✅ Dashboard terpisah untuk setiap klien
- ✅ Input data yang mudah dan terstruktur
- ✅ Tracking performa iklan per platform
- ✅ Laporan dan analisis yang lebih mudah

---

## 🎯 Fitur Utama

### 1. Multi-Role System
- **SUPER_ADMIN**: Akses penuh ke semua data dan klien
- **ADMIN**: Mengelola beberapa klien yang di-assign ke mereka
- **CLIENT**: Hanya melihat dan input data mereka sendiri

### 2. Client Management
- Daftar semua klien
- Informasi detail setiap klien
- Status aktif/non-aktif

### 3. Ad Account Management
- Kelola akun iklan per platform (Meta, TikTok, Google, dll)
- Multiple ad accounts per klien
- Tracking per platform

### 4. Daily Metrics Tracking
- Input data harian performa iklan:
  - **Spend** (biaya iklan)
  - **Revenue** (pendapatan/omzet)
  - **Impressions** (tayangan)
  - **Clicks** (klik)
  - **Leads** (prospek)
  - **Custom Fields** (extensible) - bisa ditambah field baru seiring waktu
    - Contoh: Page View, Form Conversions, WA Conversions, Rute Conversions, dll
- Filter berdasarkan tanggal, platform, ad account
- Visualisasi data dalam chart/graph
- **Custom Fields Management**: Tambah/edit/delete field definitions per client/platform

### 5. Topup Management
- Input data top-up saldo iklan
- Upload bukti pembayaran (receipt)
- Tracking top-up per platform
- History top-up

### 6. Dashboard & Analytics
- Summary dashboard per role
- Total spend, revenue, ROAS
- Perbandingan performa per platform
- Grafik trend performa
- Export laporan

---

## 🏗 Arsitektur Aplikasi

### Backend (Node.js + Express)

**Struktur:**
```
backend/
  src/
    config/        # Konfigurasi (database, cloudinary, env)
    models/        # MongoDB schemas
    routes/        # API route definitions
    controllers/   # Request handlers (1 file = 1 function)
    services/      # Business logic (1 file = 1 function)
    middleware/    # Auth, role, error handling
    utils/         # Helper functions
```

**Prinsip Pengembangan:**
- **1 file = 1 function**: Setiap controller dan service dalam file terpisah untuk memudahkan debugging
- **Separation of Concerns**: Routes hanya handle routing, controllers handle request/response, services handle business logic
- **Multi-tenant**: Setiap data dikaitkan dengan `clientId` untuk isolasi data per klien

### Frontend (React - To Be Developed)

**Rencana Struktur:**
```
frontend/
  src/
    components/    # Reusable UI components
    pages/         # Page components
    services/      # API service calls
    context/       # State management (Context API / Redux)
    utils/         # Helper functions
    styles/        # Global styles & themes
```

**Design System:**
- **Theme**: Dark mode (hitam, modern, minimalis)
- **Color Palette**: Dominan hitam dengan aksen warna untuk highlight
- **Typography**: Modern, clean, readable
- **Components**: Minimalis, functional, user-friendly

---

## 🔐 Role & Access Control

### SUPER_ADMIN
- ✅ Lihat semua klien dan data
- ✅ Buat admin baru
- ✅ Buat client user baru
- ✅ Buat klien baru
- ✅ Akses semua dashboard dan laporan
- ✅ Kelola semua ad accounts

### ADMIN
- ✅ Lihat hanya klien yang di-assign ke mereka
- ✅ Input data untuk klien yang mereka kelola
- ✅ Lihat dashboard summary untuk klien mereka
- ✅ Buat ad account untuk klien mereka
- ❌ Tidak bisa lihat data klien lain

### CLIENT
- ✅ Lihat hanya data mereka sendiri
- ✅ Input metrics dan topup untuk akun mereka
- ✅ Lihat dashboard mereka sendiri
- ❌ Tidak bisa lihat data klien lain
- ❌ Tidak bisa buat ad account (harus melalui admin)

---

## 📊 Data Model

### User
- Informasi user (name, email, password)
- Role (SUPER_ADMIN, ADMIN, CLIENT)
- clientId (untuk CLIENT)
- managedClientIds (untuk ADMIN)

### Client
- Nama klien
- Company name
- Contact email
- Status (ACTIVE, INACTIVE, SUSPENDED)

### AdAccount
- clientId (link ke client)
- Platform (META, TIKTOK, GOOGLE, dll)
- Account name & ID
- Currency

### DailyMetric
- clientId, adAccountId, platform
- Date
- Spend, Revenue, Impressions, Clicks, Leads
- **customFields** (Mixed type) - untuk extensibility, bisa ditambah field baru seiring waktu
  - Contoh: { "pageView": 100, "formConversions": 5, "waConversions": 10, "ruteConversions": 20 }
- Notes

### CustomMetricField (NEW)
- clientId, platform (atau 'ALL' untuk semua platform)
- fieldName, fieldLabel, fieldType (NUMBER, TEXT, PERCENTAGE, CURRENCY)
- isRequired, defaultValue, displayOrder, isActive
- createdBy
- **Purpose**: Manage field definitions untuk custom fields di metrics
- **Extensibility**: Memungkinkan tambah field baru tanpa perlu migrate database

### Topup
- clientId, adAccountId, platform
- Date, Amount
- Payment method
- Receipt URL (Cloudinary)
- Notes

---

## 🚀 Roadmap Pengembangan

### Phase 1: Backend Foundation ✅ (COMPLETED)
- [x] Setup project structure
- [x] Database models
- [x] Authentication & authorization
- [x] Basic CRUD APIs
- [x] Dashboard summary APIs

### Phase 2: Frontend Foundation (IN PROGRESS)
- [ ] Setup React project
- [ ] Setup routing
- [ ] Setup state management
- [ ] Implement dark theme
- [ ] Basic UI components

### Phase 3: Authentication & Core Pages
- [ ] Login page
- [ ] Landing page (before login)
- [ ] Dashboard pages (per role)
- [ ] Protected routes

### Phase 4: Client & Ad Account Management
- [ ] Client list & detail pages
- [ ] Create/edit client forms
- [ ] Ad account management pages
- [ ] Platform selection UI

### Phase 5: Metrics & Topup Management
- [ ] Daily metrics input form
- [ ] Metrics list/table with filters
- [ ] Topup input form
- [ ] Receipt upload (Cloudinary integration)
- [ ] Topup history

### Phase 6: Dashboard & Analytics
- [ ] Summary cards
- [ ] Charts & graphs (spend, revenue, ROAS)
- [ ] Platform comparison
- [ ] Date range filters
- [ ] Export reports

### Phase 7: Advanced Features (Future)
- [ ] API integration dengan platform iklan (TikTok, Google, Meta)
- [ ] Automated data sync
- [ ] Email notifications
- [ ] Advanced analytics & insights
- [ ] Custom reports builder
- [ ] Multi-currency support
- [ ] Mobile app (optional)

---

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (MongoDB Atlas)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Storage**: Cloudinary
- **Logging**: Morgan

### Frontend (Planned)
- **Framework**: React
- **Routing**: React Router
- **State Management**: Context API / Redux (TBD)
- **UI Library**: Material-UI / Tailwind CSS (TBD)
- **Charts**: Chart.js / Recharts (TBD)
- **HTTP Client**: Axios / Fetch API

### Infrastructure
- **Database**: MongoDB Atlas (Cloud)
- **File Storage**: Cloudinary (Cloud)
- **Deployment**: (TBD - Vercel/Netlify untuk frontend, Railway/Heroku untuk backend)

---

## 📝 Development Guidelines

### Code Structure
- **Backend**: 1 file = 1 function (untuk controllers dan services)
- **Naming**: camelCase untuk variables/functions, PascalCase untuk components/classes
- **File Organization**: Group by feature/domain, bukan by type

### API Design
- RESTful API conventions
- Consistent response format:
  ```json
  {
    "success": true/false,
    "message": "Description",
    "data": {}
  }
  ```
- Proper HTTP status codes
- Error handling dengan middleware

### Database
- Use MongoDB indexes untuk performance
- Validate data di model level
- Use Mongoose for schema validation

### Security
- JWT tokens untuk authentication
- Password hashing dengan bcrypt
- Role-based access control
- Input validation & sanitization
- CORS configuration

### UI/UX Principles
- Dark theme (hitam, modern, minimalis)
- Responsive design
- Loading states
- Error handling & user feedback
- Intuitive navigation

---

## 🔄 Workflow Development

1. **Backend First**: Develop API endpoints terlebih dahulu
2. **Test API**: Gunakan Postman/Thunder Client untuk test endpoints
3. **Frontend Integration**: Integrate frontend dengan API
4. **Testing**: Test setiap fitur secara menyeluruh
5. **Deployment**: Deploy backend dan frontend

---

## 📚 Resources & References

- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Cloudinary: https://cloudinary.com/
- Express.js Docs: https://expressjs.com/
- React Docs: https://react.dev/
- JWT: https://jwt.io/

---

## 🤝 Kontribusi

Untuk developer yang ingin berkontribusi:
1. Baca `Prompt aplikasi.txt` untuk memahami konteks project
2. Ikuti struktur code yang sudah ada
3. Gunakan prinsip 1 file = 1 function untuk controllers/services
4. Test semua perubahan sebelum commit
5. Update dokumentasi jika diperlukan

---

**Last Updated**: December 2024  
**Version**: 1.0.0 (Backend Complete)

