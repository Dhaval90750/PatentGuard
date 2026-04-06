# 🛡️ PharmaGuard: Backup & Disaster Recovery Policy (V1.0)

This document defines the strategy for protecting and recovering PharmaGuard data, specifically to maintain the **21 CFR Part 11** "Electronic Records" integrity.

---

## 🎯 1. Recovery Objectives (RTO/RPO)
PharmaGuard data has a high regulatory impact. Failure to recover the audit logs is an immediate non-compliance.

| Parameter | Definition | Target |
| :--- | :--- | :--- |
| **RPO (Recovery Point Objective)** | Maximum data loss measured in time. | **15 Minutes** (Max loss: 15 mins of data) |
| **RTO (Recovery Time Objective)** | Maximum time to restore after failure. | **4 Hours** (System restored within 4h) |

---

## 💾 2. Backup Strategy

### A. Core Database (PostgreSQL)
- **Hourly Incremental Backups**: Using WAL (Write Ahead Logging) archived to encrypted Object Storage (e.g., S3).
- **Daily Full Snapshots**: Retained for 30 days.
- **Monthly Archival**: Retained for 5 years (Regulatory requirement for Patent and Audit data).

### B. Rule Engine (MongoDB)
- **Continuous Backups**: Using Ops Manager or Atlas Backup.
- **Weekly Integrity Check**: Automated script verifying the consistency between linked Patent IDs in PostgreSQL and Country Rules in MongoDB.

### C. File Storage (DMS)
- **Cross-region Replication**: All documents (SOPs, Patent Filings) are replicated across two geographic zones.
- **Versioning**: Object-level versioning enabled (prevents accidental overwrite).

---

## 🧪 3. Recovery Procedures
- **Standard Restore**: Rebuild from the latest Hourly Snapshot + WAL playback.
- **Drift Detection**: Automated check of Audit Log integrity hashes post-recovery.
- **Failover**: Automated switch to a Secondary warm-standby instance if the Primary fails > 1 minute.

---

## ⚖️ 4. Data Integrity & Retention
- **Retention Period**: Patent and Audit data must be retained for at least **5 years** post-patent expiry.
- **Sanitization**: Before any "Purge," a formal Quality Review must confirm the data is no longer regulatory-relevant.

> [!IMPORTANT]
> **Audit Trail Immortality**: Backups *must* include the `audit_logs` table. A database restore that results in missing audit entries for a period of time is a "Critical Observation" during FDA audits.
