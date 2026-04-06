# 📊 PharmaGuard KPI List & Strategic Metrics

This document defines the Key Performance Indicators (KPIs) for each module, used to drive dashboards, reports, and decision intelligence.

---

## 📊 1. Dashboard (Executive Overview)
- **Total Active Patents**: `count(status = ACTIVE)` - Measures IP strength.
- **Patents Expiring in Next 12 Months**: `expiry_date <= today + 12 months` - Revenue risk indicator.
- **% Patent Coverage of Drugs**: `(drugs with patents / total drugs) * 100` - Measures protection level.
- **Countries Covered**: `count(distinct(country))` - Global reach.
- **Open Compliance Issues**: `count(CAPA where status != CLOSED)` - Audit readiness.

---

## 📜 2. Patent Management Module
- **Total Patents**: Overall portfolio size.
- **Granted vs Pending vs Expired**: Pipeline visibility.
- **Average Time to Grant**: `grant_date - filing_date` - Operational efficiency.
- **Patent Renewal Rate**: `(renewed / eligible patents) * 100`.
- **Patents Near Expiry (6–12 months)**: Critical strategic planning.
- **Jurisdiction Distribution**: Market focus analysis.

---

## 💊 3. Drug Module
- **Total Drugs**: Product portfolio size.
- **Drugs with Patent Protection**: Secure revenue streams.
- **Drugs Without Patent (High Risk)**: Competitive vulnerability.
- **Average APIs per Drug**: Product complexity insight.
- **Top Drugs by Patent Coverage**: Business value ranking.

---

## 🧪 4. API (Ingredient) Module
- **Total APIs**: Registry size.
- **APIs Covered by Patents**: Protection depth.
- **APIs Without Patent Protection**: Generic entry risk.
- **Average Patents per API**: Strength of IP around specific ingredients.
- **Most Critical APIs**: Frequency of use across multiple drug products.

---

## 🔗 5. Mapping (Drug ↔ API ↔ Patent)
- **Mapping Completeness %**: `(mapped entities / total entities) * 100`.
- **Unmapped Drugs/APIs**: Identifies critical data gaps.
- **Multi-Patent Coverage Ratio**: Indicator of robust protection strategy.

---

## ⚖️ 6. Compliance Module
### ✅ A. 21 CFR Part 11
- **Audit Trail Completeness %**: Integrity of operation logs.
- **Electronic Signature Usage Rate**: Adherence to regulatory workflows.
- **Unauthorized Access Attempts**: Security monitoring and threat detection.

### ✅ B. ISO 9001:2015
- **Open CAPAs**: Current quality bottlenecks.
- **CAPA Closure Time (avg)**: Responsiveness to quality issues.
- **SOP Compliance Rate**: Process discipline.
- **Document Version Accuracy**: Version control health.

---

## 📁 7. Document Management Module
- **Total Documents**: Repository health.
- **Documents with Latest Version**: Documentation currency.
- **Documents Pending Approval**: Processing bottlenecks.
- **Average Approval Time**: Workflow efficiency.
- **Document Access Frequency**: Usage insights.

---

## 🔐 8. User & Access Control (RBAC)
- **Active Users**: System utilization.
- **Role Distribution**: User privilege balance.
- **Failed Login Attempts**: Brute-force/security monitoring.
- **Permission Violations**: Unauthorized activity tracking.

---

## 🔔 9. Notification & Alerts Module
- **Total Alerts Generated**: System sensitivity.
- **Unread Notifications**: User responsiveness.
- **Critical Alerts**: Expiry and Compliance mission-critical items.
- **Alert Response Time**: Operational speed.

---

## 📊 10. Reports Module
- **Reports Generated**: Analytical activity.
- **Export Frequency**: External data usage.
- **Most Viewed Reports**: Utility ranking.
- **Scheduled Reports Execution Rate**: Automation health.

---

## ⚠️ 11. Risk Management Module
- **Total Risks Identified**: Proactive tracking.
- **High-Risk Patents**: Impact analysis.
- **Risk Mitigation Rate**: `(resolved risks / total risks) * 100`.
- **Average Risk Resolution Time**: Efficiency in risk handling.

---

## 🤖 12. AI Insights Module (Advanced)
- **Predicted Patent Expiry Impact**: Future revenue forecasting.
- **Suggested New Filings**: Portfolio expansion hints.
- **Risk Prediction Accuracy**: AI performance metrics.
- **Overlap Detection Count**: Intellectual property risk identification.

---

## 📈 Strategic KPIs (Executive Perspective)
- **Revenue at Risk**: Projected loss due to expiring patents in the next 1-3 years.
- **Generic Entry Risk Score**: Aggregated metric of portfolio vulnerability.
- **Patent Portfolio Strength Index**: Proprietary score based on coverage and jurisdiction.
- **Innovation Rate**: Net new filings per year.
