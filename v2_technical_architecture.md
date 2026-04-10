# VantagePoint V2: Technical Architecture
## Engineering Shift: "From Web App to Enterprise Ecosystem"

V2 transitions from a monolithic structure to a robust, high-scale architecture capable of supporting global pharmaceutical portfolios and AI-driven insights.

---

## 1. Data Layer: The "Single Source of Truth"
### Current (V1)
*   **Storage**: `database.json` file.
*   **Integrity**: Manual file writes (Risk of collision).

### Evolution (V2)
*   **Database Engine**: **PostgreSQL** (Selected for ACID compliance and complex relational mapping).
*   **Vector Extension**: **pgvector** for storing and querying formulation embeddings to support **Semantic Discovery**.
*   **ORM Layer**: **Prisma** (Ensuring type-safety and automated migrations).
*   **Normalization Layer**: A middle-tier service that standardizes data from heterogeneous inputs (API, CSV, Manual) before persistence.
*   **History Table**: Native row-level auditing to back the GxP **Audit Sentinel**.

## 2. Intelligence Layer: The "Cognitive Core"
### Core Engineering: NLP & Prediction
*   **LLM Integration**: **Google Gemini 1.5 Pro** or equivalent for document reasoning and mapping suggestions.
*   **Strategy Simulation Engine**: A dedicated service for calculating complex patent expiry timelines (SPCs, PTEs, and Pediatric Extensions).
*   **Background Jobs**: **BullMQ / Redis** for processing large patent PDF extractions and molecular similarity scoring without blocking the main event loop.

## 3. Communication Layer: The "Real-time Pulse"
### Core Engineering: Collaborative Infrastructure
*   **Real-time Layer**: **Socket.io** integration for multi-user collaboration and instant GxP alert broadcasts.
*   **State Sync**: Moving beyond local storage to a centralized cache (Redis) for real-time compliance heartbeat.

## 4. Security & Governance Layer
### Core Engineering: Enterprise Fortress
*   **IAM / SSO**: Support for SAML 2.0, Azure AD, and Okta via **Passport.js**.
*   **Cryptographic Ledger**: SHA-256 hashing for audit trail integrity, verified against an internal PKI (Private Key Infrastructure).
*   **RBAC 2.0**: Permission-based access control with "Jurisdictional Restrictions" (e.g., US legal team cannot access EU patent drafts until ready).

## 5. UI/UX Evolution
### Core Engineering: Immersive Analytics
*   **Visualization Engine**: **D3.js** for the "What-If" timeline and **Three.js** for the 3D interactive mapping.
*   **Reporting Engine**: **Puppeteer** or **jsreport** for generating GxP-validated, high-fidelity PDF/PPTX portfolio summaries.
*   **Theming Layer**: Advanced Dark/Light mode synchronization with native OS preferences using CSS Variables.

## 6. Ingestion Logic & Multi-Output Pipeline
### Core Engineering: Event-Driven Orchestration
*   **Omni-Channel Ingestion**: Standardized ingestion handlers for WIPO/EPO live-feeds, document OCR extraction, and manual entry forms.
*   **Multi-Output Hub**: A pub/sub or observer-pattern architecture where a single "Input Event" (e.g., a patent update) automatically triggers:
    *   **Audit Hook**: Write to the 21 CFR Part 11 compliant Sentinel.
    *   **Strategy Hook**: Recalculate expiry timelines in the Strategy Simulator.
    *   **Geographic Hook**: Update mapping coordinates in the Global Heatmap.
    *   **Alert Hook**: Dispatch notifications to relevant stakeholders.

---

## 🚀 Technical Performance Goals
*   **Latency**: <200ms for global mapping queries.
*   **Availability**: 99.9% uptime for the GxP Document Vault.
*   **Compliance**: 100% data integrity with non-repudiable logs via **Audit Sentinel**.

*VantagePoint™ - Precision Intelligence for Regulatory Excellence.*
