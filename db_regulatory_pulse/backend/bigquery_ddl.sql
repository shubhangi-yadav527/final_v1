-- 🏦 BigQuery Setup DDL & Seed Script
-- Target Database/Dataset: EU_Regulations
-- Project ID: tensile-oarlock-500904-d4

-- =========================================================================
-- 1. Main Regulations Table
-- =========================================================================
CREATE OR REPLACE TABLE `EU_Regulations.eu_regulations` (
  Framework STRING OPTIONS(description="Regulatory framework abbreviation, e.g. DORA"),
  Regulations STRING OPTIONS(description="Full regulatory body name"),
  RegulatorySeverity STRING OPTIONS(description="Severity classification: High, Medium, Low"),
  EffectiveDate DATE OPTIONS(description="The date regulation goes into full effect"),
  KeyFocus STRING OPTIONS(description="Brief summary of compliance requirements"),
  DepartmentImpacted STRING OPTIONS(description="Internal department affected"),
  PenaltyRange STRING OPTIONS(description="Financial impact or penalty"),
  RiskTypes STRING OPTIONS(description="Mapped corporate risk category"),
  AIGovernanceScore INT64 OPTIONS(description="Compliance score (out of 100)")
);

INSERT INTO `EU_Regulations.eu_regulations` 
(Framework, Regulations, RegulatorySeverity, EffectiveDate, KeyFocus, DepartmentImpacted, PenaltyRange, RiskTypes, AIGovernanceScore) 
VALUES
('EU AI Act', 'Comprehensive AI governance framework', 'High', DATE '2026-09-30', 'Comprehensive AI governance framework', 'Loans', '€2.1M', 'Compliance Risk', 95),
('DORA', 'Digital Operational Resilience Act', 'Medium', DATE '2026-12-31', 'Digital Operational Resilience Act', 'Deposits', '€1.2M', 'Operational Risk', 88),
('GDPR', 'General Data Protection Regulation', 'Compliant', DATE '2018-05-25', 'Data protection compliance maintained', 'Core Banking', '€0.5M', 'Cyber Risk', 98);

-- =========================================================================
-- 2. Alerts Table
-- =========================================================================
CREATE OR REPLACE TABLE `EU_Regulations.alerts` (
  title STRING,
  severity STRING,
  description STRING,
  action STRING,
  deadline STRING
);

INSERT INTO `EU_Regulations.alerts` (title, severity, description, action, deadline) VALUES
('Deposits Department - Compliance Gap', 'high', 'Compliance score 85% - below threshold', 'Review and implement governance framework', '2026-Q3'),
('EU AI Act - Implementation Required', 'high', 'Regulation takes effect Q3 2026', 'Begin implementation planning', '2026-Q3'),
('Operational Risk - Medium Level', 'medium', 'Risk level at 45%', 'Monitor and optimize', '2026-Q4'),
('Model Risk - Monitoring Active', 'medium', 'AI model performance tracking', 'Continue monthly reviews', 'Ongoing');

-- =========================================================================
-- 3. Recommendations Table
-- =========================================================================
CREATE OR REPLACE TABLE `EU_Regulations.recommendations` (
  title STRING,
  impact STRING,
  status STRING,
  priority INT64
);

INSERT INTO `EU_Regulations.recommendations` (title, impact, status, priority) VALUES
('Optimize Data Center Operations', '4.2 Tons CO₂/year', 'High Impact', 1),
('Implement Cloud Auto-Scaling', '3.8 Tons CO₂/year', 'Medium Impact', 2),
('Enhance AI Model Monitoring', 'Reduce Risk by 15%', 'Risk Reduction', 1),
('Adopt Sustainable Vendors', '2.3 Tons CO₂/year', 'Strategic', 3);

-- =========================================================================
-- 4. Carbon Metrics Table
-- =========================================================================
CREATE OR REPLACE TABLE `EU_Regulations.carbon_metrics` (
  current_co2 FLOAT64,
  unit STRING,
  ai_optimized_co2 FLOAT64,
  carbon_saved FLOAT64,
  reduction_percentage FLOAT64,
  tree_equivalent INT64
);

INSERT INTO `EU_Regulations.carbon_metrics` (current_co2, unit, ai_optimized_co2, carbon_saved, reduction_percentage, tree_equivalent) VALUES
(31.0, 'Tons', 18.6, 12.4, 40.0, 2054);

-- =========================================================================
-- 5. Carbon Trends Table
-- =========================================================================
CREATE OR REPLACE TABLE `EU_Regulations.carbon_trends` (
  month STRING,
  co2 FLOAT64
);

INSERT INTO `EU_Regulations.carbon_trends` (month, co2) VALUES
('Jan', 38.0),
('Feb', 36.0),
('Mar', 34.0),
('Apr', 32.0),
('May', 30.0),
('Jun', 31.0);

-- =========================================================================
-- 6. Cost & ROI Table
-- =========================================================================
CREATE OR REPLACE TABLE `EU_Regulations.cost_roi` (
  current_annual_cost STRING,
  ai_optimized_cost STRING,
  annual_savings STRING,
  savings_percentage FLOAT64,
  payback_period_months INT64,
  infrastructure_savings STRING,
  compliance_savings STRING,
  carbon_savings STRING
);

INSERT INTO `EU_Regulations.cost_roi` (current_annual_cost, ai_optimized_cost, annual_savings, savings_percentage, payback_period_months, infrastructure_savings, compliance_savings, carbon_savings) VALUES
('€3.34 M', '€1.70 M', '€1.66 M', 49.7, 8, '€480K', '€700K', '€220K');

-- =========================================================================
-- 7. ROI Timeline Table
-- =========================================================================
CREATE OR REPLACE TABLE `EU_Regulations.roi_timeline` (
  quarter STRING,
  roi FLOAT64
);

INSERT INTO `EU_Regulations.roi_timeline` (quarter, roi) VALUES
('Q1 2026', 0.0),
('Q2 2026', 15.0),
('Q3 2026', 35.0),
('Q4 2026', 55.0),
('Q1 2025', 80.0),
('Q2 2025', 120.0);
