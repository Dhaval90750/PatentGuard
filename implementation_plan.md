# PharmaGuard V1 Implementation Plan

This plan outlines the specific steps to build the first production-ready version (V1) of the Pharmaceutical Patent & Compliance Management System, strictly adhering to the established Design Rules and KPI standards.

## 🎯 V1 Objectives
- Establish a secure, RBAC-enabled foundation.
- Implement core Patent, Drug, and API registries with full mapping.
- Enable **21 CFR Part 11** baseline compliance (Audit Trails & E-Signatures).
- Deploy the executive Dashboard with real-time KPI data.
- **Alert Awareness**: Implement real-time in-app notifications and SMTP email alerts for critical events.
- **Regulatory Readiness**: Prepare for formal GxP Validation and establish a robust Disaster Recovery policy.

## 🏗️ Technical Foundation
- **Backend**: Spring Boot 3.x, Spring Security, JPA/Hibernate, QueryDSL.
- **Database**: PostgreSQL (Structured), MongoDB (Rule/Log storage - hybrid).
- **Communication**: WebSockets (Real-time), SMTP (Email).
- **Frontend**: React 18 (Vite), MUI v5, Zustand, TanStack Query.
- **Identity**: UUID v4 for all primary keys.

---

## 🛠️ Phase 1: Core Scaffolding & Security
- [ ] Initialize Spring Boot project structure in `/server`.
- [ ] Configure Multi-datasource: PostgreSQL for business data, MongoDB for rules.
- [ ] **Infrastructure**: Initialize schemas for `notifications` and `email_logs`.
- [ ] Implement JWT-based Auth Provider and Security Filter Chain.
- [ ] Define `BaseEntity` with `id (UUID)`, `created_at`, `updated_at`, `created_by`, and `is_deleted`.
- [ ] Initialize Vite/React project in `/client` with Global Layout.

---

## ⚖️ Phase 2: Compliance Core (21 CFR Part 11)
- [ ] Implement Spring AOP `@AuditAction` interceptor for JSON diff logging.
- [ ] Create `AuditLog` entity to capture User, Action, and Change details.
- [ ] Implement `ESignatureService` with password/OTP re-verification modal.

---

## 📜 Phase 3: Business Modules & Mapping
- [ ] **Registries**: CRUD for Patent, Drug, and API metadata.
- [ ] **Mapping**: Logic and UI to link `Drug <-> API` and `API <-> Patent`.
- [ ] **Rule Engine**: Automated `expiry_date` calculation based on filing country and MongoDB rules.

---

## 📊 Phase 4: Dashboard & Alert System
- [ ] **KPI Computing**: Implement Summary Services for Patents, Coverage, and Compliance.
- [ ] **Alert Logic**: Implement **[alert_system_requirements.md](file:///e:/Patent/alert_system_requirements.md)**.
- [ ] **Dispatch**: Setup SMTP for email alerts and WebSockets for in-app notifications.
- [ ] **UI**: Build "Executive Overview" charts and the Notification Bell drawer.

---

## 🛡️ Phase 5: Regulatory Validation & Audit Readiness
- [ ] **Backup Execution**: Setup Hourly/Daily rotation as defined in **[backup_recovery_policy.md](file:///e:/Patent/backup_recovery_policy.md)**.
- [ ] **IQ/OQ/PQ Tests**: Perform formal testing of the Audit Trail and RBAC as defined in **[compliance_validation_plan.md](file:///e:/Patent/compliance_validation_plan.md)**.
- [ ] **Data Integrity Verification**: Check for audit log non-repudiation and drift detection.
- [ ] **Validation Summary (VSR)**: Final review of all test evidence for production release.

---

## 🧪 Verification Plan
### Automated Tests
- **Security**: Verify that 'R&D' users cannot access 'Compliance' logs via API.
- **Alert Dispatch**: Verify that an expiring patent triggers both a notification and an email log entry.
- **Integrity**: Ensure it is impossible to `UPDATE` an entry in the `audit_logs` table.

### Manual Walkthrough
1. **Alert Loop**: Manually trigger a mock expiry -> verify bell notification and email reception.
2. **Dashboard**: Confirm real-time updates of Expiry trends.
3. **Recovery Test**: Simulate a database failure and restore from the 15-minute point.
