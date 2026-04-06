# 🚨 PharmaGuard: Alert System Requirements (SMTP & Notifications)

This document defines the technical and functional requirements for the real-time Alert & Notification System in PharmaGuard.

---

## 🎯 1. Objective
Design a robust, real-time alert system to notify users about critical patent, compliance, and system events via **In-app Notifications** and **SMTP Email**, ensuring full **21 CFR Part 11 auditability**.

---

## 🧩 2. Alert Types (Core Events)
- **📜 Patent Alerts**: Expiry (12, 6, 3 months), Renewal deadlines, Status changes.
- **💊 Drug/API Alerts**: Missing patent coverage, API linked to expiring patents.
- **📑 Compliance Alerts**: CAPA overdue, SOP pending approval, Audit trail anomalies.
- **🔐 Security Alerts**: Failed login attempts, Unauthorized access.
- **⚙️ System Alerts**: Server errors, Background job failures.

---

## 🔔 3. In-App Notification System
- **Categories**: Info (Blue), Warning (Yellow), Critical (Red).
- **Structure**: UUID, UserID, Title, Message, Type, Read/Unread Status, Timestamp.
- **Functional Requirements**: Navbar bell icon, Mark as Read/Unread, Filter by Criticality, Pagination.
- **Delivery**: WebSockets (Real-time) with Polling fallback.

---

## 📧 4. Email Alert System (SMTP)
- **Configuration**: Standard SMTP (Host, Port, Credentials, TLS).
- **Trigger Rules**: Mandatory for Patent Expiry, CAPA Overdue, and Document Approvals.
- **Template Structure**: Standardized HTML templates with dynamic placeholders (User Name, Patent Number, Expiry Date, Jurisdiction).
- **Functional Requirements**: Event-based & Cron-based triggering, Retry logic for failures, Persistent Email Logs.

---

## 🔄 5. Alert Workflow
1. **Event Detection**: A service layer detects a condition (e.g., Cron job finds expiring patent).
2. **Alert Generation**: Alert Service creates the alert record.
3. **Dispatch**: 
   - Persist in `notifications` table.
   - Send via WebSocket for instant UI update.
   - Dispatch Email via SMTP (Asynchronous).
4. **Audit**: Log the alert generation and dispatch status in the Audit Trail.

---

## 🗄️ 6. Database Design (SQL)

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) CHECK (type IN ('INFO', 'WARNING', 'CRITICAL')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status VARCHAR(20), -- SENT, FAILED, RETRYING
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alert_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(50) UNIQUE,
  notify_in_app BOOLEAN DEFAULT true,
  notify_email BOOLEAN DEFAULT true
);
```

---

## ⚙️ 7. Backend API Design
- `GET /api/v1/notifications`: List user notifications (Paginated).
- `POST /api/v1/notifications/mark-read`: Mark one or all as read.
- `DELETE /api/v1/notifications/{id}`: Soft delete a notification.
- `POST /api/v1/alerts/trigger` (Internal): Manually trigger an alert for testing/system use.

---

## 🔐 8. Compliance & Performance
- **21 CFR Part 11**: Every alert is logged with a timestamp; email logs are tracebale and non-editable.
- **ISO 9001:2015**: Targeted alerts for CAPA tracking and document versioning.
- **Scheduling**: Daily Cron jobs for batch scanning (e.g., `0 0 * * *`).
- **Scalability**: Async mailing via a Task Queue (RabbitMQ/Kafka) to prevent blocking the main thread.
- **Failure Handling**: 3-attempt retry logic for failed SMTP connections.
