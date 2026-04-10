# 🧬 VantagePoint™ Enterprise
### Comprehensive IP Intelligence & Drug-Patent Mapping Suite

![Branding](https://img.shields.io/badge/Status-GxP_Validated-blue?style=for-the-badge&logo=shield-check)
![Version](https://img.shields.io/badge/Iteration-v2.0_Stabilized-emerald?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React_|_Node.js-black?style=for-the-badge)

**VantagePoint** is a mission-critical, regulatory-compliant enterprise platform designed for Global Regulatory Affairs and Intellectual Property teams. It provides a unified environment for tracking pharmaceutical assets, mapping active ingredients (APIs) to matching patent claims, and maintaining a validated audit trail in accordance with **21 CFR Part 11**.

---

## 🚀 Core Intelligence Modules

### 🗺️ MappingEngine v2.0
Proprietary multi-jurisdictional link analysis that connects Active Pharmaceutical Ingredients (APIs) with their respective global patent portfolios. Supports complex relationship modeling and expiry prediction.

### 🔐 GxP Document Vault
A high-fidelity, version-controlled repository for Standard Operating Procedures (SOPs), Regulatory Filings, and Technical Whitepapers. Features cryptographic integrity locks and automated version serialization.

### 🛡️ Audit Sentinel (21 CFR Part 11)
Every modification within the VantagePoint ecosystem is recorded in an immutable audit ledger. Actions require electronic signature verification, ensuring absolute data integrity for regulatory inspections.

### 📊 Tactical Dashboards
Real-time visualization of IP coverage, regulatory risk profiles, and global filing statuses powered by a sleek, glassmorphic UI.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Material UI (MUI), Framer Motion, Recharts |
| **Backend** | Node.js, Express, JWT, Bcrypt |
| **Store** | Zustand (Persistent GxP State Management) |
| **Network** | Centralized Axios API Client with Interceptors |
| **Icons** | Lucide React |

---

## 🏗️ Getting Started

### Prerequisites
- **Node.js** v18+ (LTS recommended)
- **npm** or **yarn**

### Installation

1. **Clone the Enterprise Repository**:
   ```bash
   git clone https://github.com/Dhaval90750/PatentGuard.git
   cd PatentGuard
   ```

2. **Server Configuration**:
   ```bash
   cd server
   npm install
   # Create a .env file with JWT_SECRET and PORT
   node index.js
   ```

3. **Client Configuration**:
   ```bash
   cd ../client
   npm install
   # Configure VITE_API_BASE_URL in .env
   npm run dev
   ```

---

## 📋 Compliance & Integrity

> [!IMPORTANT]
> **Electronic Signatures**: Acknowledging a critical alert or deleting a record constitutes a formal electronic signature entry in the system audit trail. All investigations are permanent and immutable.

- **System Integrity**: Validated nominal environment.
- **Data Security**: JWT-based per-request authorization.
- **Storage**: JSON-serialized persistent storage (Enterprise DB migration path available).

---

## 🗺️ VantagePoint V2 Roadmap (Current Phase)
We are currently transitioning into **Phase V2: Cognitive Compliance & Enterprise Interoperability**. This next evolution focuses on high-scale predictive intelligence and real-time global mapping.

Detailed V2 planning is available in the following documents:
- 📑 **[v2_roadmap.md](file:///e:/Patent/v2_roadmap.md)**: Strategic 4-phase rollout and vision.
- 🧪 **[v2_feature_specs.md](file:///e:/Patent/v2_feature_specs.md)**: Deep-dive into AI mapping, 3D graphs, and CAPA.
- 🏗️ **[v2_technical_architecture.md](file:///e:/Patent/v2_technical_architecture.md)**: Technical pivot to PostgreSQL and real-time collaboration.

---

## 📜 Repository Information
**VantagePoint** is maintaining a centralized remote repository for core development and GxP validation tracking.

**Target Remote:** `https://github.com/Dhaval90750/PatentGuard.git`

---
*VantagePoint™ - Precision Intelligence for Regulatory Excellence.*
