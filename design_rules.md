# 📐 PharmaGuard: Production-Level Design Rules & Standards

This document defines the rigorous design principles for both Frontend and Backend, ensuring a secure, scalable, and regulatory-compliant (21 CFR Part 11 & ISO 9001) enterprise system.

---

# 🎨 PART 1: FRONTEND DESIGN RULES (Detailed)

## 🧭 1. Layout & Structure
- **Global UI**: Fixed Sidebar (Navigation) + Top Navbar (Search, Profile, Notifications).
- **Page Hierarchy**: Title → Breadcrumbs → KPI Cards → Filters/Search → Main Content (Table) → Actions.
- **Grid System**: 12-column responsive grid (Material UI). Spacing: 16px/24px padding; consistent margins.

## 🎯 2. UX & Interaction Rules
- **Minimize Effort**: Dropdowns for Countries/Status; Auto-fill where possible.
- **System Status**: Persistent loading indicators and "Toast" notifications for success/error.
- **Error Prevention**: Inline validation; disable 'Submit' if required fields are missing or invalid.
- **Consistency**: Blue for Primary/Save; Red for Danger/Delete. Standardized icons (✏️ Edit, 🗑️ Delete).

## 🧩 3. Component Standards
- **Tables (CRITICAL)**: Must support Pagination, Sorting, Multi-column Filtering, and Global Search.
- **Forms**: Logically grouped categories (Basic Info, Dates, Attachments). Use Date Pickers and native MUI inputs.
- **Modals**: Restricted to Delete Confirmations and Electronic Signature prompts.

## 🔐 4. Compliance & Quality UI
- **21 CFR Part 11**: Show "Last Modified By" + Timestamp on every detail view. Modal interceptor for E-Signature.
- **ISO 9001:2015**: Explicit version labels (v1, v2). Clear status badges (Draft, Approved, Obsolete).

## 📊 5. Dashboard & Visuals
- **KPI Cards**: Title, Value, Trend (↑ ↓), and Color status indicator.
- **Charts**: Recharts/Chart.js for Trends (Line), Distribution (Pie), and Comparisons (Bar).
- **Aesthetics**: Neutral white/light grey theme with professional blue/green accents.

---

# ⚙️ PART 2: BACKEND DESIGN RULES (Detailed)

## 🧱 1. Architecture & Security
- **Layered Design**: `Controller → Service → Repository → Database`.
- **Microservice Ready**: Decoupled modules (Patent, Drug/API, Compliance).
- **Authentication**: JWT tokens; Bcrypt hashing for passwords; HTTPS only.
- **RBAC**: Admin, QA, Legal, R&D roles with permission checks in the Middleware/Service layer.

## 🆔 2. Identity & Data Integrity
- **UUID v4**: Mandatory for all primary keys. Never expose internal sequential IDs.
- **Mandatory Fields**: Every table must have `id`, `created_at`, `updated_at`, `created_by`, and `is_deleted` (soft delete).
- **Database**: Enforced Foreign Keys and normalized schema. Use Transactions for critical operations.

## 📑 3. Audit & Compliance (21 CFR Part 11)
- **Immutable Logs**: Log `user_id`, `entity_id`, `action` (CREATE/UPDATE/DELETE), `old_value`, `new_value`, and `timestamp`.
- **E-Signature**: Verify password/OTP and store signature metadata before critical commits.

## 🔄 4. API Design Standards
- **RESTful Methods**: GET (fetch), POST (create), PUT (update), DELETE (soft delete).
- **Naming**: `/api/v1/patents`, `/api/v1/drugs`, etc.
- **Standard Response**:
  ```json
  {
    "success": true,
    "data": {},
    "message": "Operation successful"
  }
  ```
- **Error Format**:
  ```json
  {
    "success": false,
    "error": "Error details",
    "code": 400
  }
  ```

## 📈 5. Performance & Scalability
- **Indexing**: Frequent search fields like `patent_number` and `expiry_date`.
- **Pagination**: Mandatory for all list endpoints.
- **Statelessness**: Ensure APIs are scalable horizontally. Use Docker for containerization.
- **Document Storage**: Save files in Cloud (S3); store only metadata/URIs in the Database.
