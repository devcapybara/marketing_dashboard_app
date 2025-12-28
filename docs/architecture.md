# Architecture

## Overview
- Monorepo dengan dua aplikasi:
  - Backend: Node.js + Express + Mongoose (MongoDB)
  - Frontend: React + Vite
- Komunikasi: REST API di prefix `/api` dengan autentikasi JWT.
- Pola kode: “1 file = 1 function” untuk controller dan service.

## Backend
- Entry: [server.js](file:///d:/Aplikasi/backend/src/server.js) memuat [app.js](file:///d:/Aplikasi/backend/src/app.js).
- Konfigurasi env: [env.js](file:///d:/Aplikasi/backend/src/config/env.js).
- Middleware:
  - [authMiddleware](file:///d:/Aplikasi/backend/src/middleware/authMiddleware.js) memverifikasi token dan memuat user aktif.
  - [roleMiddleware](file:///d:/Aplikasi/backend/src/middleware/roleMiddleware.js) membatasi akses berdasarkan peran.
- Model utama: [models](file:///d:/Aplikasi/backend/src/models) (Client, Lead, Page, User, dsb.)
- Routing: [routes](file:///d:/Aplikasi/backend/src/routes) terpisah per domain (leads, pages, clients, auth, audit).
- Logging:
  - HTTP logging dengan `morgan`.
  - Audit trail per aksi bisnis melalui model [AuditLog](file:///d:/Aplikasi/backend/src/models/AuditLog.js) dan service [createAuditLogService](file:///d:/Aplikasi/backend/src/services/audit/createAuditLogService.js#L3-L36).

## Frontend
- Entry: [main.jsx](file:///d:/Aplikasi/frontend/src/main.jsx) dan [App.jsx](file:///d:/Aplikasi/frontend/src/App.jsx).
- Routing halaman per peran:
  - Dashboard: [pages/dashboard](file:///d:/Aplikasi/frontend/src/pages/dashboard)
  - Leads: [pages/leads](file:///d:/Aplikasi/frontend/src/pages/leads)
  - Site Builder: [pages/site/PageBuilder.jsx](file:///d:/Aplikasi/frontend/src/pages/site/PageBuilder.jsx)
  - Audit: [pages/audit-logs/AuditLogPage.jsx](file:///d:/Aplikasi/frontend/src/pages/audit-logs/AuditLogPage.jsx)
- Komunikasi API: [services/api.js](file:///d:/Aplikasi/frontend/src/services/api.js) dan service domain per fitur.

## Keamanan & Akses
- JWT disusun via [generateJwtService](file:///d:/Aplikasi/backend/src/services/auth/generateJwtService.js).
- Validasi status user (aktif/non-aktif) pada [authMiddleware](file:///d:/Aplikasi/backend/src/middleware/authMiddleware.js#L27-L43).
- Peran SUPER_ADMIN diperlukan untuk endpoint sensitif seperti audit logs.

## Alur Contoh: Audit Log Login
- Controller: [loginController](file:///d:/Aplikasi/backend/src/controllers/auth/loginController.js)
- Bila login gagal/sukses, service audit dipanggil untuk mencatat event:
  - [createAuditLogService](file:///d:/Aplikasi/backend/src/services/audit/createAuditLogService.js#L3-L36)
- Daftar log diambil via endpoint:
  - [auditLogRoutes](file:///d:/Aplikasi/backend/src/routes/auditLogRoutes.js)
  - [listAuditLogsService](file:///d:/Aplikasi/backend/src/services/audit/listAuditLogsService.js)

