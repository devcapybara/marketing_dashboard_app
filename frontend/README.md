# Marketing Dashboard - Frontend

Frontend aplikasi Marketing Dashboard berbasis React dengan Vite.

## 🚧 Status

**Status:** 🟢 Frontend Foundation Complete | 🟡 Pages Development Pending

### ✅ Completed (Frontend Foundation)
- [x] Setup React project dengan Vite
- [x] Setup struktur folder (components, pages, services, context, hooks, utils)
- [x] Setup React Router untuk routing
- [x] Setup Context API untuk state management (AuthContext)
- [x] Setup Tailwind CSS dengan dark theme (hitam, modern, minimalis)
- [x] Setup Axios untuk HTTP client dengan interceptors
- [x] Setup environment variables (.env)
- [x] Basic routing structure (Landing, Login, Dashboard per role)
- [x] Protected Route component dengan role-based access
- [x] Authentication flow (login, logout, token management)

### 🚧 In Progress
- [ ] Build dashboard pages dengan data real
- [ ] Implement CRUD operations
- [ ] Add data visualization (charts)

### 📋 Todo
- [ ] Client management pages
- [ ] Ad Account management pages
- [ ] Daily Metrics input & list pages
- [ ] Topup input & list pages
- [ ] Layout components (Sidebar, Header, Navigation)
- [ ] Charts & graphs untuk analytics
- [ ] Responsive design improvements

## 📋 Planned Tech Stack

- **React** - UI Framework
- **React Router** - Routing ✅
- **State Management** - Context API ✅
- **UI Library** - Tailwind CSS ✅ (dark theme)
- **Charts** - Chart.js / Recharts (TBD)
- **HTTP Client** - Axios ✅

## 🎨 Design System

- **Theme**: Dark mode (hitam, modern, minimalis) ✅
- **Color Palette**: Dominan hitam dengan aksen warna untuk highlight
- **Typography**: Modern, clean, readable
- **Components**: Minimalis, functional, user-friendly

## 📁 Project Structure

```
frontend/
  src/
    components/      # Reusable UI components
      common/        # Common components (Button, Input, etc.)
      layout/        # Layout components (Sidebar, Header, etc.) ✅
      charts/        # Chart components
    pages/           # Page components
      auth/          # Login, Landing page ✅
      dashboard/     # Dashboard pages (per role) ✅
      clients/       # Client management pages
      ad-accounts/   # Ad account pages
      metrics/       # Metrics pages
      topups/        # Topup pages
    services/        # API service calls ✅
    context/         # State management (Context API) ✅
    hooks/           # Custom React hooks
    utils/           # Helper functions
    styles/          # Global styles & themes ✅
    App.jsx          # Main App component ✅
    main.jsx         # Entry point ✅
```

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
Buat file `.env` di root folder `frontend`:
```env
VITE_API_URL=http://localhost:4000
```

3. Start development server:
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

4. Build for production:
```bash
npm run build
```

## 🔗 Backend API

Backend API sudah tersedia di `http://localhost:4000`

Lihat dokumentasi lengkap di `../backend/README.md` untuk detail API endpoints.

## 🔐 Authentication Flow

1. User login via `/api/auth/login`
2. Store JWT token (localStorage)
3. Include token in API requests (Authorization header) ✅
4. Implement protected routes based on role ✅
5. Redirect based on role after login ✅

## 📊 Pages Status

### Before Login ✅
- [x] Landing page (hero section, features)
- [x] Login page

### After Login (per role) ✅
- [x] Super Admin Dashboard (skeleton)
- [x] Admin Dashboard (skeleton)
- [x] Client Dashboard (skeleton)

### Common Pages (Todo)
- [ ] Client list & detail
- [ ] Ad account management
- [ ] Daily metrics input & list
- [ ] Topup input & list
- [ ] Reports & analytics

## 🎯 Next Steps

1. ✅ Setup React project structure
2. ✅ Implement authentication flow
3. 🚧 Build dashboard pages (start with SUPER_ADMIN)
4. [ ] Implement CRUD operations
5. [ ] Add data visualization (charts)
6. [ ] Polish UI/UX

## 🛠 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

**Last Updated:** December 2024  
**Status:** Frontend Foundation Complete
