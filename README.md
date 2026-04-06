# 🧬 PharmaGuard: Pharmaceutical Patent & Compliance Management System

A high-security, regulatory-compliant enterprise platform for tracking global patents, drugs, and APIs. Designed for the pharmaceutical industry with integrated **21 CFR Part 11** and **ISO 9001:2015** standards.

## 🚀 Key Features

- **Patent Lifecycle & Tracking**: Manage the transition from filing to expiry with automated renewal monitoring.
- **API & Drug Mapping**: Complex multi-way mapping between pharmaceutical active ingredients, drugs, and patents.
- **Global Law Rule Engine**: Confugurable legal rules per jurisdiction for patent durations and data exclusivity.
- **21 CFR Part 11 Compliance**: Immutable audit trails, electronic signatures, and secure RBAC.
- **ISO 9001:2015 Features**: Document control, CAPA (Corrective and Preventive Actions), and SOP management.
- **Predictive Analytics**: Insights into patent trends and future generic competition risks.

## 🛠️ Stack Components

- **Frontend**: React.js with Material UI (MUI).
- **Backend**: Spring Boot (Java) with Spring Security & JWT.
- **Relational DB**: PostgreSQL (Structured Patent/Drug Data).
- **NoSQL DB**: MongoDB (Flexible Rule Engine).
- **Messaging/Search**: Elasticsearch (Optional).

## 📋 Compliance Standards

### 21 CFR Part 11
Every data change is logged in an immutable audit trail. Critical updates require a re-authentication "electronic signature".

### ISO 9001:2015
The system provides modules for Quality Management, including CAPA tracking, SOP versioning, and document control.

## 🏗️ Getting Started

> [!NOTE]
> This project is currently in the **Planning Phase**.

### Prerequisites
- JDK 17+
- Node.js 18+ (LTS recommended)
- PostgreSQL & MongoDB
- Maven (for backend)

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/dhaval/pharmaguard.git
   cd pharmaguard
   ```

2. **Backend Setup**:
   - Navigate to `/server`.
   - Update `src/main/resources/application.properties` with your DB credentials.
   - Run `mvn install` and then `mvn spring-boot:run`.

3. **Frontend Setup**:
   - Navigate to `/client`.
   - Run `npm install`.
   - Start the development server with `npm run dev`.

## 📜 License
Proprietary Industrial License - Pharmaceutical Enterprise Standards.
