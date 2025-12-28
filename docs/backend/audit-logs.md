# Backend: Audit Logs

## Tujuan
- Mencatat aksi penting (login, CRUD Client, assignment) untuk keperluan audit dan keamanan.
- Mempermudah penelusuran siapa melakukan apa, terhadap data mana, kapan, dan dari IP mana.

## Model
- Sumber: [AuditLog.js](file:///d:/Aplikasi/backend/src/models/AuditLog.js#L3-L41)
- Field:
  - `user`: ObjectId referensi ke User (required, indexed)
  - `action`: string aksi (required, indexed)
  - `targetModel`: nama model yang terdampak (required, indexed)
  - `targetId`: ObjectId data target (required, indexed)
  - `details`: payload bebas (Mixed), dapat berisi sebelum/sesudah
  - `ipAddress`: alamat IP
  - `createdAt`: timestamp otomatis

## Pencatatan (Service)
- Sumber: [createAuditLogService](file:///d:/Aplikasi/backend/src/services/audit/createAuditLogService.js#L3-L36)
- Parameter:
  - `user`: ObjectId atau objek user (wajib)
  - `action`: nama aksi (wajib)
  - `targetModel`: model target (wajib)
  - `targetId`: id target (wajib)
  - `details`: objek detail (opsional)
  - `ipAddress`: string IP (opsional)
- Contoh penggunaan pada login:
  - [loginController](file:///d:/Aplikasi/backend/src/controllers/auth/loginController.js#L96-L103)
- Contoh penggunaan pada CRUD Client:
  - Create: [createClientController](file:///d:/Aplikasi/backend/src/controllers/client/createClientController.js#L25-L32)
  - Update: [updateClientController](file:///d:/Aplikasi/backend/src/controllers/client/updateClientController.js#L20-L27)
  - Delete: [deleteClientController](file:///d:/Aplikasi/backend/src/controllers/client/deleteClientController.js#L12-L19)

## Mengambil Data Audit
- Endpoint: `GET /api/audit-logs`
- Route: [auditLogRoutes](file:///d:/Aplikasi/backend/src/routes/auditLogRoutes.js#L9)
- Controller: [listAuditLogsController](file:///d:/Aplikasi/backend/src/controllers/audit/listAuditLogsController.js)
- Service: [listAuditLogsService](file:///d:/Aplikasi/backend/src/services/audit/listAuditLogsService.js)
- Hak akses:
  - Wajib login (JWT) dan role `SUPER_ADMIN` via [roleMiddleware](file:///d:/Aplikasi/backend/src/middleware/roleMiddleware.js#L10-L15).
- Query params:
  - `page` (default 1), `limit` (default 20)
  - `userId` atau `email` untuk filter user
  - `action` (regex, case-insensitive)
  - `startDate`, `endDate` (ISO format; `endDate` diset ke akhir hari)

## Tampilan Frontend
- Halaman: [AuditLogPage.jsx](file:///d:/Aplikasi/frontend/src/pages/audit-logs/AuditLogPage.jsx)
- Service API: [auditLogService.js](file:///d:/Aplikasi/frontend/src/services/auditLogService.js)

