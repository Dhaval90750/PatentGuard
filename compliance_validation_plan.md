# ⚖️ PharmaGuard: Compliance Validation Plan (V1.0)

This document defines the formal validation strategy for PharmaGuard, ensuring the system meets global pharmaceutical regulatory standards (GxP).

---

## 🏗️ 1. Validation Lifecycle (V-Model)
PharmaGuard follows the GAMP 5 V-Model approach to ensure software quality and data integrity.

```text
User Requirements (URS)   →   User Acceptance Test (PQ)
Functional Specs (FS)     →   Operational Qual (OQ)
Design Specs (DS)         →   Installation Qual (IQ)
        Implementation & Build
```

---

## ⚙️ 2. Installation Qualification (IQ)
**Objective**: Verify the software and infrastructure are installed and configured according to the Design Specifications.

| Checkpoint | Requirement | Verification Method |
| :--- | :--- | :--- |
| **OS Version** | Windows/Linux compatible with JDK 17+ | Terminal: `java -version` |
| **DB Connectivity**| Postgres 15+ and MongoDB 6.0+ accessible | `ping` and `telnet` to DB ports |
| **Security Cache** | Redis (optional) configured for session caching | `redis-cli ping` |
| **TLS/SSL** | HTTPS enabled with valid certificates | Browser: SSL Padlock verification |

---

## 📑 3. Operational Qualification (OQ)
**Objective**: Verify the system functions correctly in the target environment according to the Functional Specifications.

### A. 21 CFR Part 11 OQ Tests
- **Immutable Log Test**: Attempt to manually `UPDATE` a row in `audit_logs` via direct SQL. *Expected: Permission Denied or Trigger Block.*
- **E-Signature Intercept**: Trigger a Patent Deletion. *Expected: Modal prompt for Re-authentication (E-sig).*
- **RBAC Isolation**: Log in as "R&D" user and attempt to approve an SOP. *Expected: 403 Forbidden.*

### B. ISO 9001:2015 OQ Tests
- **SOP Versioning**: Upload `SOP_v1.0`. Upload update. *Expected: Auto-increment to v1.1 and 'Draft' status for v1.1.*
- **CAPA Workflow**: Create CAPA. Assign as 'Open'. *Expected: QA Dashboard reflects 1 Open CAPA.*

---

## 🎯 4. Performance Qualification (PQ)
**Objective**: Verify the system performs reliably under actual production load and conditions.

- **Load Testing**: 100 concurrent patent searches within < 500ms.
- **Failover Verification**: Force MongoDB secondary transition. *Expected: Zero downtime for Rule Engine lookups.*
- **UAT (User Acceptance)**: End-to-end walkthrough by Legal and QA departments.

---

## 🛡️ 5. Validation Summary Report (VSR)
Upon completion of IQ/OQ/PQ, a **Validation Summary Report** is generated. This report is the legal document certifying that PharmaGuard is ready for "GxP Use" (Production).

> [!CAUTION]
> **Regulatory Risk**: Any change to the core Audit Logic or E-Signature service *de-validates* the system. Re-validation (Regression OQ) is required for these upgrades.
