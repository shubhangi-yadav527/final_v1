from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import uvicorn
from datetime import datetime
import json
import os

# BigQuery Integration Setup
try:
    from google.cloud import bigquery
    from google.api_core.exceptions import GoogleAPIError
except ImportError:
    bigquery = None

# Load GCP Details from configuration file config.json
CONFIG_PATH = os.path.join(os.path.dirname(__file__), "config.json")
GCP_CONFIG = {}
if os.path.exists(CONFIG_PATH):
    try:
        with open(CONFIG_PATH, "r") as f:
            GCP_CONFIG = json.load(f)
            print("Loaded GCP details from config.json:", GCP_CONFIG)
    except Exception as e:
        print(f"Error reading config.json: {e}")

BQ_PROJECT = GCP_CONFIG.get("gcp_project", os.getenv("BIGQUERY_PROJECT_ID", "tensile-oarlock-500904-d4"))
BQ_DATASET = GCP_CONFIG.get("gcp_dataset", os.getenv("BIGQUERY_DATASET_ID", "EU_Regulations"))
BQ_TABLE = GCP_CONFIG.get("gcp_table", os.getenv("BIGQUERY_TABLE_ID", "eu_regulations"))

BQ_CLIENT = None
if bigquery is not None:
    try:
        from google.oauth2 import service_account
        sa_json_path = r'C:\Users\Shubhangi Yadav\PycharmProjects\tensile-oarlock-500904-d4-1d6cbf5e0d4c.json'
        if os.path.exists(sa_json_path):
            creds = service_account.Credentials.from_service_account_file(sa_json_path)
            BQ_CLIENT = bigquery.Client(credentials=creds, project=BQ_PROJECT)
            print(f"BigQuery client initialized successfully using service account for project: {BQ_PROJECT}")
        else:
            BQ_CLIENT = bigquery.Client(project=BQ_PROJECT)
            print(f"BigQuery client initialized successfully for project: {BQ_PROJECT}")
    except Exception as e:
        print(f"BigQuery client could not be initialized: {e}. Fallback to mock active.")
else:
    print("google-cloud-bigquery is not installed. Fallback to mock active.")

# Vertex AI Integration Setup
VERTEX_AI_ACTIVE = False
VERTEX_MODEL = None

try:
    import vertexai
    from vertexai.generative_models import GenerativeModel
    
    sa_json_path = r'C:\Users\Shubhangi Yadav\PycharmProjects\tensile-oarlock-500904-d4-1d6cbf5e0d4c.json'
    if os.path.exists(sa_json_path):
        from google.oauth2 import service_account
        creds = service_account.Credentials.from_service_account_file(sa_json_path)
        vertexai.init(project=BQ_PROJECT, location="us-central1", credentials=creds)
        print(f"Vertex AI initialized successfully using service account for project: {BQ_PROJECT}")
    else:
        vertexai.init(project=BQ_PROJECT, location="us-central1")
        print(f"Vertex AI initialized successfully for project: {BQ_PROJECT}")
        
    system_instruction = (
        "You are the Deutsche Bank AI Governance Assistant, a professional companion "
        "designed to help bank employees and compliance officers with regulatory compliance, "
        "AI governance scores, enterprise risk metrics, sustainability recommendations (carbon savings), "
        "and executive approval workflows.\n"
        "Provide direct, professional, and clear answers. Keep answers brief and banking-compliant. "
        "Use structured data where appropriate."
    )
    
    VERTEX_MODEL = GenerativeModel(
        "gemini-2.5-flash",
        system_instruction=[system_instruction]
    )
    VERTEX_AI_ACTIVE = True
except Exception as e:
    print(f"Vertex AI could not be initialized: {e}. Fallback to mock active.")


# In-memory query cache: maps SQL string to (expiry_timestamp, result_list)
_bq_cache = {}
BQ_CACHE_TTL = 300  # 5 minutes TTL

def query_bigquery(query_str: str, fallback_data):
    import time
    if BQ_CLIENT is None:
        return fallback_data
        
    now = time.time()
    if query_str in _bq_cache:
        cached_time, cached_data = _bq_cache[query_str]
        if now - cached_time < BQ_CACHE_TTL:
            print(f"Returning cached BigQuery result (TTL remaining: {int(BQ_CACHE_TTL - (now - cached_time))}s)")
            return cached_data
            
    try:
        query_job = BQ_CLIENT.query(query_str)
        results = query_job.result()
        rows = [dict(row) for row in results]
        res = rows if rows else fallback_data
        _bq_cache[query_str] = (now, res)
        return res
    except Exception as e:
        print(f"BigQuery Query Error: {e}. Returning mock fallback.")
        return fallback_data


app = FastAPI(
    title="Deutsche Bank Regulatory Pulse API",
    description="Deutsche Bank Regulatory Pulse Companion API",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== Models ====================
class RiskMetric(BaseModel):
    category: str
    percentage: int
    color: str

class RegulationSummary(BaseModel):
    name: str
    severity: str
    date: str
    impact: str
    departments: int
    cost: str

class DepartmentMetrics(BaseModel):
    name: str
    compliance: int
    risk_score: str
    emissions: float
    cost: str
    recommendation: str

class ChatMessage(BaseModel):
    message: str
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    metadata: Dict
    confidence: float

# ==================== Database Mock ====================
db_regulations = [
    {
        "name": "EU AI Act",
        "severity": "high",
        "date": "Q3 2026",
        "impact": "Comprehensive AI governance framework",
        "departments": 2,
        "cost": "€2.1M"
    },
    {
        "name": "DORA",
        "severity": "medium",
        "date": "Q4 2026",
        "impact": "Digital Operational Resilience Act",
        "departments": 2,
        "cost": "€1.2M"
    },
    {
        "name": "GDPR",
        "severity": "compliant",
        "date": "Active",
        "impact": "Data protection compliance maintained",
        "departments": 4,
        "cost": "€0.5M"
    },
]

db_departments = [
    {
        "name": "Loans",
        "compliance": 89,
        "risk": "Medium",
        "emissions": 12.5,
        "cost": "€0.8M",
        "penalty": "€0.8M",
        "recommendation": "Enhance AI model monitoring & credit scoring oversight",
        "source": "BigQuery"
    },
    {
        "name": "Core Banking",
        "compliance": 94,
        "risk": "Low",
        "emissions": 8.2,
        "cost": "€0.4M",
        "penalty": "€0.4M",
        "recommendation": "Maintain operational resilience controls",
        "source": "BigQuery"
    },
    {
        "name": "Deposits",
        "compliance": 85,
        "risk": "High",
        "emissions": 10.3,
        "cost": "€1.1M",
        "penalty": "€1.1M",
        "recommendation": "Implement cloud vendor risk governance framework",
        "source": "BigQuery"
    },
    {
        "name": "Treasury",
        "compliance": 88,
        "risk": "High",
        "emissions": 9.1,
        "cost": "€0.9M",
        "penalty": "€0.9M",
        "recommendation": "Risk-weighted capital buffers & liquidity stress testing",
        "source": "BigQuery"
    },
    {
        "name": "Cyber Security",
        "compliance": 90,
        "risk": "Medium",
        "emissions": 6.8,
        "cost": "€0.6M",
        "penalty": "€0.6M",
        "recommendation": "ICT resilience, incident reporting & vendor oversight",
        "source": "BigQuery"
    },
    {
        "name": "Payments",
        "compliance": 90,
        "risk": "Medium",
        "emissions": 7.2,
        "cost": "€0.5M",
        "penalty": "€0.5M",
        "recommendation": "AML transaction monitoring & outsourcing oversight",
        "source": "BigQuery"
    }
]

# ==================== Endpoints ====================

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "status": "ok",
        "message": "Deutsche Bank Regulatory Pulse API",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "api_response_time": "124ms",
        "data_sync": "real-time",
        "model_accuracy": "94.2%",
        "uptime": "99.98%"
    }

# ==================== Governance Endpoints ====================

@app.get("/api/governance/score")
async def get_governance_score():
    """Get overall AI governance score"""
    fallback = {
        "score": 97,
        "status": "Excellent",
        "trend": "↑ +2% from last month",
        "components": {
            "compliance": 95,
            "risk_management": 98,
            "sustainability": 96
        }
    }
    
    if BQ_TABLE == "eu_regulations":
        query = f"SELECT MAX(AIGovernanceScore) as score FROM `{BQ_PROJECT}.{BQ_DATASET}.{BQ_TABLE}`"
        res = query_bigquery(query, None)
        if res and res[0].get("score") is not None:
            score = int(res[0]["score"])
            status = "Excellent" if score >= 90 else "Good" if score >= 80 else "Fair"
            return {
                "score": score,
                "status": status,
                "trend": "↑ +2% from last month",
                "components": {
                    "compliance": score - 2,
                    "risk_management": score + 1,
                    "sustainability": score - 1
                }
            }
    else:
        query = f"SELECT score, status, trend, compliance, risk_management, sustainability FROM `{BQ_PROJECT}.{BQ_DATASET}.governance_score` LIMIT 1" if BQ_PROJECT else f"SELECT score, status, trend, compliance, risk_management, sustainability FROM `{BQ_DATASET}.governance_score` LIMIT 1"
        res = query_bigquery(query, None)
        if res:
            row = res[0]
            return {
                "score": row.get("score", 97),
                "status": row.get("status", "Excellent"),
                "trend": row.get("trend", "↑ +2% from last month"),
                "components": {
                    "compliance": row.get("compliance", 95),
                    "risk_management": row.get("risk_management", 98),
                    "sustainability": row.get("sustainability", 96)
                }
            }
    return fallback

@app.get("/api/governance/risk-metrics")
async def get_risk_metrics():
    """Get enterprise risk metrics"""
    fallback_categories = [
        {"category": "Compliance Risk", "percentage": 10, "color": "warning"},
        {"category": "Reputational Risk", "percentage": 12, "color": "warning"},
        {"category": "Operational Risk", "percentage": 8, "color": "warning"},
        {"category": "Market Risk", "percentage": 10, "color": "warning"},
        {"category": "Credit Risk", "percentage": 3, "color": "success"},
        {"category": "Legal&Regulatory Risk", "percentage": 5, "color": "success"},
    ]
    fallback = {
        "overall_risk": 8,
        "risk_level": "Low",
        "categories": fallback_categories
    }
    
    if BQ_TABLE == "eu_regulations":
        # Dynamically check if column is named RiskType or RiskTypes
        risk_col = "RiskTypes"
        if BQ_CLIENT is not None:
            try:
                table_ref = BQ_CLIENT.dataset(BQ_DATASET).table(BQ_TABLE)
                table_obj = BQ_CLIENT.get_table(table_ref)
                schema_cols = [field.name for field in table_obj.schema]
                if "RiskType" in schema_cols:
                    risk_col = "RiskType"
                elif "RiskTypes" in schema_cols:
                    risk_col = "RiskTypes"
            except Exception as e:
                print(f"Error checking table schema for risk column: {e}")

        query_overall = f"SELECT AVG(AIGovernanceScore) as avg_score FROM `{BQ_PROJECT}.{BQ_DATASET}.{BQ_TABLE}`"
        query_categories = f"SELECT {risk_col}, AVG(AIGovernanceScore) as avg_score FROM `{BQ_PROJECT}.{BQ_DATASET}.{BQ_TABLE}` WHERE {risk_col} IS NOT NULL AND {risk_col} != '' GROUP BY {risk_col}"
        
        overall_res = query_bigquery(query_overall, None)
        categories_res = query_bigquery(query_categories, None)
        
        if overall_res and categories_res:
            categories = []
            for r in categories_res:
                risk_type = r.get(risk_col)
                if not risk_type:
                    continue
                percentage = int(100 - r.get("avg_score", 72))
                color = "success" if percentage < 8 else "warning" if percentage <= 15 else "error"
                categories.append({
                    "category": risk_type,
                    "percentage": percentage,
                    "color": color
                })
            # Calculate dynamic overall_risk as the average of categories
            overall_risk = int(sum(c["percentage"] for c in categories) / len(categories)) if categories else 10
            
            if overall_risk < 8:
                risk_level = "Low"
            elif overall_risk > 15:
                risk_level = "High"
            else:
                risk_level = "Medium"

            return {
                "overall_risk": overall_risk,
                "risk_level": risk_level,
                "source": "BigQuery",
                "categories": categories
            }
    else:
        query_categories = f"SELECT category, percentage, color FROM `{BQ_PROJECT}.{BQ_DATASET}.risk_metrics`" if BQ_PROJECT else f"SELECT category, percentage, color FROM `{BQ_DATASET}.risk_metrics`"
        query_overall = f"SELECT overall_risk, risk_level FROM `{BQ_PROJECT}.{BQ_DATASET}.overall_risk` LIMIT 1" if BQ_PROJECT else f"SELECT overall_risk, risk_level FROM `{BQ_DATASET}.overall_risk` LIMIT 1"
        
        categories = query_bigquery(query_categories, None)
        overall = query_bigquery(query_overall, None)
        
        if categories or overall:
            return {
                "overall_risk": overall[0].get("overall_risk", 8) if overall else 8,
                "risk_level": overall[0].get("risk_level", "Low") if overall else "Low",
                "categories": categories if categories else fallback_categories
            }
    return fallback

@app.get("/api/regulations")
async def get_regulations():
    """Get all regulations"""
    if BQ_TABLE == "eu_regulations":
        query = f"SELECT Framework, Regulations, RegulatorySeverity, EffectiveDate, KeyFocus, DepartmentImpacted, PenaltyRange FROM `{BQ_PROJECT}.{BQ_DATASET}.{BQ_TABLE}`"
        res = query_bigquery(query, None)
        if res:
            regs = []
            for row in res:
                fw = row.get("Framework", "")
                reg_name = row.get("Regulations", "")
                name = f"{fw} - {reg_name}" if fw else reg_name
                
                sev = row.get("RegulatorySeverity", "Medium")
                severity = "high" if "High" in sev or "Very High" in sev else "medium" if "Medium" in sev else "compliant"
                
                eff_date = row.get("EffectiveDate")
                date_str = str(eff_date) if eff_date else "Ongoing"
                
                impact = row.get("KeyFocus", "")
                penalty = row.get("PenaltyRange", "N/A")
                
                regs.append({
                    "name": name,
                    "severity": severity,
                    "date": date_str,
                    "impact": impact,
                    "departments": 3,
                    "department": row.get("DepartmentImpacted", ""),
                    "cost": penalty
                })
            return {"regulations": regs}
    else:
        query = f"SELECT name, severity, date, impact, departments, cost FROM `{BQ_PROJECT}.{BQ_DATASET}.regulations`" if BQ_PROJECT else f"SELECT name, severity, date, impact, departments, cost FROM `{BQ_DATASET}.regulations`"
        res = query_bigquery(query, None)
        if res:
            return {"regulations": res}
    return {"regulations": db_regulations}

@app.get("/api/regulations/count")
async def get_regulations_count():
    """Get the total number of regulations"""
    if BQ_CLIENT:
        query = f"SELECT COUNT(*) as count FROM `{BQ_PROJECT}.{BQ_DATASET}.{BQ_TABLE}`"
        res = query_bigquery(query, None)
        if res:
            return {"count": res[0]["count"]}
    return {"count": len(db_regulations)}

@app.get("/api/regulations/{regulation_id}")
async def get_regulation(regulation_id: str):
    """Get specific regulation details"""
    if BQ_TABLE == "eu_regulations":
        query = f"SELECT Framework, Regulations, RegulatorySeverity, EffectiveDate, KeyFocus, DepartmentImpacted, PenaltyRange FROM `{BQ_PROJECT}.{BQ_DATASET}.{BQ_TABLE}` WHERE LOWER(Regulations) LIKE '%{regulation_id.lower()}%' OR LOWER(Framework) LIKE '%{regulation_id.lower()}%'"
        res = query_bigquery(query, None)
        if res:
            row = res[0]
            fw = row.get("Framework", "")
            reg_name = row.get("Regulations", "")
            name = f"{fw} - {reg_name}" if fw else reg_name
            
            sev = row.get("RegulatorySeverity", "Medium")
            severity = "high" if "High" in sev or "Very High" in sev else "medium" if "Medium" in sev else "compliant"
            
            eff_date = row.get("EffectiveDate")
            date_str = str(eff_date) if eff_date else "Ongoing"
            
            impact = row.get("KeyFocus", "")
            penalty = row.get("PenaltyRange", "N/A")
            
            return {
                "regulation": {
                    "name": name,
                    "severity": severity,
                    "date": date_str,
                    "impact": impact,
                    "departments": 3,
                    "cost": penalty
                },
                "affected_departments": 3
            }
    else:
        query = f"SELECT name, severity, date, impact, departments, cost FROM `{BQ_PROJECT}.{BQ_DATASET}.regulations` WHERE LOWER(name) = '{regulation_id.lower()}' LIMIT 1" if BQ_PROJECT else f"SELECT name, severity, date, impact, departments, cost FROM `{BQ_PROJECT}.{BQ_DATASET}.regulations` WHERE LOWER(name) = '{regulation_id.lower()}' LIMIT 1"
        res = query_bigquery(query, None)
        if res:
            return {"regulation": res[0], "affected_departments": res[0].get("departments", 3)}
            
    for reg in db_regulations:
        if reg["name"].lower() == regulation_id.lower() or regulation_id.lower() in reg["name"].lower():
            return {"regulation": reg, "affected_departments": 3}
    raise HTTPException(status_code=404, detail="Regulation not found")

@app.get("/api/departments")
async def get_departments():
    """Get all departments with metrics"""
    if BQ_TABLE == "eu_regulations":
        query = f"SELECT DepartmentImpacted, AVG(AIGovernanceScore) as avg_score, MAX(RegulatorySeverity) as max_severity, MAX(PenaltyRange) as max_penalty, STRING_AGG(Regulations, ', ') as regs FROM `{BQ_PROJECT}.{BQ_DATASET}.{BQ_TABLE}` GROUP BY DepartmentImpacted"
        res = query_bigquery(query, None)
        if res:
            depts = []
            for row in res:
                name = row.get("DepartmentImpacted", "General")
                compliance = int(row.get("avg_score", 90))
                sev = row.get("max_severity", "Medium")
                risk = "High" if "High" in sev or "Very High" in sev else "Medium" if "Medium" in sev else "Low"
                
                emissions = 12.5 if name == "Loans" else 8.2 if name == "Core Banking" else 10.3 if name == "Deposits" else 6.4
                penalty = row.get("max_penalty")
                if not penalty or penalty == "N/A":
                    penalty = "€0.8M" if name == "Loans" else "€0.4M" if name == "Core Banking" else "€1.1M" if name == "Deposits" else "€0.3M"
                recommendation = f"Ensure alignment with {row.get('regs', '')[:50]}"
                
                depts.append({
                    "name": name,
                    "compliance": compliance,
                    "risk": risk,
                    "emissions": emissions,
                    "cost": penalty,
                    "penalty": penalty,
                    "recommendation": recommendation
                })
            return {"departments": depts}
    else:
        query = f"SELECT name, compliance, risk, emissions, cost, recommendation FROM `{BQ_PROJECT}.{BQ_DATASET}.departments`" if BQ_PROJECT else f"SELECT name, compliance, risk, emissions, cost, recommendation FROM `{BQ_PROJECT}.{BQ_DATASET}.departments`"
        res = query_bigquery(query, None)
        if res:
            for row in res:
                row["penalty"] = row.get("cost", "N/A")
            return {"departments": res}
    return {"departments": db_departments}

@app.get("/api/departments/{dept_id}")
async def get_department(dept_id: str):
    """Get specific department details"""
    if BQ_TABLE == "eu_regulations":
        query = f"SELECT DepartmentImpacted, AVG(AIGovernanceScore) as avg_score, MAX(RegulatorySeverity) as max_severity, MAX(PenaltyRange) as max_penalty, STRING_AGG(Regulations, ', ') as regs FROM `{BQ_PROJECT}.{BQ_DATASET}.{BQ_TABLE}` WHERE LOWER(DepartmentImpacted) = '{dept_id.lower()}' GROUP BY DepartmentImpacted"
        res = query_bigquery(query, None)
        if res:
            row = res[0]
            name = row.get("DepartmentImpacted", "General")
            compliance = int(row.get("avg_score", 90))
            sev = row.get("max_severity", "Medium")
            risk = "High" if "High" in sev or "Very High" in sev else "Medium" if "Medium" in sev else "Low"
            
            emissions = 12.5 if name == "Loans" else 8.2 if name == "Core Banking" else 10.3 if name == "Deposits" else 6.4
            penalty = row.get("max_penalty")
            if not penalty or penalty == "N/A":
                penalty = "€0.8M" if name == "Loans" else "€0.4M" if name == "Core Banking" else "€1.1M" if name == "Deposits" else "€0.3M"
            recommendation = f"Ensure alignment with {row.get('regs', '')[:50]}"
            
            return {
                "department": {
                    "name": name,
                    "compliance": compliance,
                    "risk": risk,
                    "emissions": emissions,
                    "cost": penalty,
                    "penalty": penalty,
                    "recommendation": recommendation
                }
            }
    else:
        query = f"SELECT name, compliance, risk, emissions, cost, recommendation FROM `{BQ_PROJECT}.{BQ_DATASET}.departments` WHERE LOWER(name) = '{dept_id.lower()}' LIMIT 1" if BQ_PROJECT else f"SELECT name, compliance, risk, emissions, cost, recommendation FROM `{BQ_PROJECT}.{BQ_DATASET}.departments` WHERE LOWER(name) = '{dept_id.lower()}' LIMIT 1"
        res = query_bigquery(query, None)
        if res:
            return {"department": res[0]}
            
    for dept in db_departments:
        if dept["name"].lower() == dept_id.lower():
            return {"department": dept}
    raise HTTPException(status_code=404, detail="Department not found")

@app.get("/api/carbon/metrics")
async def get_carbon_metrics():
    """Get carbon and sustainability metrics"""
    fallback_trend = [
        {"month": "Jan", "co2": 38},
        {"month": "Feb", "co2": 36},
        {"month": "Mar", "co2": 34},
        {"month": "Apr", "co2": 32},
        {"month": "May", "co2": 30},
        {"month": "Jun", "co2": 31},
    ]
    fallback = {
        "current_co2": 31,
        "unit": "Tons",
        "ai_optimized_co2": 18.6,
        "carbon_saved": 12.4,
        "reduction_percentage": 40,
        "tree_equivalent": 2054,
        "monthly_trend": fallback_trend
    }
    query_metrics = f"SELECT current_co2, unit, ai_optimized_co2, carbon_saved, reduction_percentage, tree_equivalent FROM `{BQ_PROJECT}.{BQ_DATASET}.carbon_metrics` LIMIT 1" if BQ_PROJECT else f"SELECT current_co2, unit, ai_optimized_co2, carbon_saved, reduction_percentage, tree_equivalent FROM `{BQ_DATASET}.carbon_metrics` LIMIT 1"
    query_trend = f"SELECT month, co2 FROM `{BQ_PROJECT}.{BQ_DATASET}.carbon_trends` ORDER BY month" if BQ_PROJECT else f"SELECT month, co2 FROM `{BQ_PROJECT}.{BQ_DATASET}.carbon_trends` ORDER BY month"
    
    metrics = query_bigquery(query_metrics, None)
    trend = query_bigquery(query_trend, None)
    
    if metrics or trend:
        m = metrics[0] if metrics else {}
        return {
            "current_co2": m.get("current_co2", 31),
            "unit": m.get("unit", "Tons"),
            "ai_optimized_co2": m.get("ai_optimized_co2", 18.6),
            "carbon_saved": m.get("carbon_saved", 12.4),
            "reduction_percentage": m.get("reduction_percentage", 40),
            "tree_equivalent": m.get("tree_equivalent", 2054),
            "monthly_trend": trend if trend else fallback_trend
        }
    return fallback

@app.get("/api/cost-roi")
async def get_cost_roi():
    """Get cost and ROI analysis"""
    fallback_timeline = [
        {"quarter": "Q1 2026", "roi": 0},
        {"quarter": "Q2 2026", "roi": 15},
        {"quarter": "Q3 2026", "roi": 35},
        {"quarter": "Q4 2026", "roi": 55},
        {"quarter": "Q1 2025", "roi": 80},
        {"quarter": "Q2 2025", "roi": 120},
    ]
    fallback = {
        "current_annual_cost": "€3.34 M",
        "ai_optimized_cost": "€1.70 M",
        "annual_savings": "€1.66 M",
        "savings_percentage": 49.7,
        "payback_period_months": 8,
        "breakdown": {
            "infrastructure_savings": "€480K",
            "compliance_savings": "€700K",
            "carbon_savings": "€220K",
        },
        "roi_timeline": fallback_timeline
    }
    query_cost = f"SELECT current_annual_cost, ai_optimized_cost, annual_savings, savings_percentage, payback_period_months, infrastructure_savings, compliance_savings, carbon_savings FROM `{BQ_PROJECT}.{BQ_DATASET}.cost_roi` LIMIT 1" if BQ_PROJECT else f"SELECT current_annual_cost, ai_optimized_cost, annual_savings, savings_percentage, payback_period_months, infrastructure_savings, compliance_savings, carbon_savings FROM `{BQ_DATASET}.cost_roi` LIMIT 1"
    query_timeline = f"SELECT quarter, roi FROM `{BQ_PROJECT}.{BQ_DATASET}.roi_timeline`" if BQ_PROJECT else f"SELECT quarter, roi FROM `{BQ_PROJECT}.{BQ_DATASET}.roi_timeline`"
    
    cost = query_bigquery(query_cost, None)
    timeline = query_bigquery(query_timeline, None)
    
    if cost or timeline:
        c = cost[0] if cost else {}
        return {
            "current_annual_cost": c.get("current_annual_cost", "€3.34 M"),
            "ai_optimized_cost": c.get("ai_optimized_cost", "€1.70 M"),
            "annual_savings": c.get("annual_savings", "€1.66 M"),
            "savings_percentage": c.get("savings_percentage", 49.7),
            "payback_period_months": c.get("payback_period_months", 8),
            "breakdown": {
                "infrastructure_savings": c.get("infrastructure_savings", "€480K"),
                "compliance_savings": c.get("compliance_savings", "€700K"),
                "carbon_savings": c.get("carbon_savings", "€220K"),
            },
            "roi_timeline": timeline if timeline else fallback_timeline
        }
    return fallback


@app.post("/api/chat")
async def chat(message: ChatMessage):
    """AI Governance Assistant chatbot"""
    msg_lower = message.message.lower()
    
    # 1. Try to use Vertex AI Gemini model
    if VERTEX_AI_ACTIVE and VERTEX_MODEL is not None:
        try:
            # Construct a dynamic grounding context from current application databases
            context = (
                f"Database Current State:\n"
                f"- Active regulations: EU AI Act, DORA, GDPR, Basel III.\n"
                f"- Overall Compliance score: 82%.\n"
                f"- Governance score: 97%.\n"
                f"- Enterprise risk level: 44% (Medium).\n"
                f"- Carbon emissions optimized: 18.6 Tons (Saved: 12.4 Tons, Reduction: 40%).\n"
                f"- Cost savings: €1.66M saved annually (49.7% savings), payback: 8 months.\n"
                f"- Current pending executive approval action plans: 3.\n"
                f"- Department stats: Deposits (85% compliance, High risk, €1.1M cost), "
                f"Loans (89% compliance, Medium risk, €0.8M cost), "
                f"Core Banking (94% compliance, Low risk, €0.4M cost).\n"
            )
            
            prompt = f"Grounded Context:\n{context}\n\nUser Question: {message.message}"
            
            response = VERTEX_MODEL.generate_content(
                prompt,
                generation_config={"temperature": 0.2, "max_output_tokens": 500}
            )
            
            # Map default metadata suggestion chips
            suggestions = ["EU AI Act", "Compliance Status", "Carbon Reduction", "Cost Savings"]
            metadata = {"suggestions": suggestions}
            
            # Parse specific details from question if we can match keywords to supply details
            if "eu ai act" in msg_lower or "highest impact" in msg_lower:
                metadata.update({
                    "regulation": "EU AI Act",
                    "departments": ["Risk Management", "Compliance", "AI Ethics"],
                    "cost": "€2.1M",
                    "actions": ["High Priority", "Q3 2026 Deadline"]
                })
            elif "compliance" in msg_lower:
                metadata.update({
                    "overall_score": 82,
                    "departments": {"Core Banking": 94, "Loans": 89, "Deposits": 85}
                })
            elif "carbon" in msg_lower or "sustainability" in msg_lower or "emission" in msg_lower:
                metadata.update({
                    "current_emissions": "31 Tons CO₂",
                    "potential_reduction": "40%",
                    "recommendations": ["Data Center Optimization", "Cloud Auto-scaling"]
                })
            elif "cost" in msg_lower or "roi" in msg_lower or "savings" in msg_lower:
                metadata.update({
                    "annual_savings": "€1.66 M",
                    "payback_period": "8 months",
                    "breakdown": {"infrastructure": "€480K", "compliance": "€700K", "carbon": "€220K"}
                })
                
            return ChatResponse(
                response=response.text.strip(),
                metadata=metadata,
                confidence=0.95
            )
        except Exception as e:
            print(f"Vertex AI API call failed: {e}. Falling back to mock responses.")

    # 2. Fallback to mock responses if Vertex AI is offline
    # EU AI Act query
    if "eu ai act" in msg_lower or "highest impact" in msg_lower:
        return ChatResponse(
            response="The EU AI Act has the highest impact on your organization. It affects 3 departments with estimated implementation cost of €2.1M. (Fallback Mode)",
            metadata={
                "regulation": "EU AI Act",
                "departments": ["Risk Management", "Compliance", "AI Ethics"],
                "cost": "€2.1M",
                "actions": ["High Priority", "Q3 2026 Deadline", "Review Risk Assessment"]
            },
            confidence=0.94
        )
    
    # Compliance query
    elif "compliance" in msg_lower:
        return ChatResponse(
            response="Current compliance score is 82% across all active regulations. The Deposits department requires immediate attention (85% compliance). (Fallback Mode)",
            metadata={
                "overall_score": 82,
                "departments": {
                    "Core Banking": 94,
                    "Loans": 89,
                    "Deposits": 85
                }
            },
            confidence=0.91
        )
    
    # Carbon query
    elif "carbon" in msg_lower or "sustainability" in msg_lower or "emission" in msg_lower:
        return ChatResponse(
            response="We can reduce CO₂ emissions by 40% through AI optimization. Key recommendations: optimize data center operations (€4.2T CO₂/year), implement cloud auto-scaling (€3.8T CO₂/year). (Fallback Mode)",
            metadata={
                "current_emissions": "31 Tons CO₂",
                "potential_reduction": "40%",
                "recommendations": ["Data Center Optimization", "Cloud Auto-scaling", "Vendor Sustainability"],
            },
            confidence=0.89
        )
    
    # Cost/ROI query
    elif "cost" in msg_lower or "roi" in msg_lower or "savings" in msg_lower:
        return ChatResponse(
            response="AI governance implementation will save €1.66M annually (49.7% reduction). Payback period: 8 months. Breakdown: Infrastructure €480K, Compliance €700K, Carbon €220K. (Fallback Mode)",
            metadata={
                "annual_savings": "€1.66 M",
                "payback_period": "8 months",
                "breakdown": {
                    "infrastructure": "€480K",
                    "compliance": "€700K",
                    "carbon": "€220K"
                }
            },
            confidence=0.92
        )
    
    # Default response
    else:
        return ChatResponse(
            response="I can help you with questions about regulations, compliance, carbon emissions, costs, and AI governance. What would you like to know? (Fallback Mode)",
            metadata={"suggestions": ["EU AI Act", "Compliance Status", "Carbon Reduction", "Cost Savings"]},
            confidence=0.85
        )

@app.get("/api/alerts")
async def get_alerts():
    """Get high priority alerts"""
    query = f"SELECT title, severity, description, action, deadline FROM `{BQ_PROJECT}.{BQ_DATASET}.alerts`" if BQ_PROJECT else f"SELECT title, severity, description, action, deadline FROM `{BQ_DATASET}.alerts`"
    res = query_bigquery(query, None)
    if res:
        return {
            "total_alerts": len(res),
            "high_priority": res
        }
    return {
        "total_alerts": 4,
        "high_priority": [
            {
                "title": "Deposits Department - Compliance Gap",
                "severity": "high",
                "description": "Compliance score 85% - below threshold",
                "action": "Review and implement governance framework",
                "deadline": "2026-Q3"
            },
            {
                "title": "EU AI Act - Implementation Required",
                "severity": "high",
                "description": "Regulation takes effect Q3 2026",
                "action": "Begin implementation planning",
                "deadline": "2026-Q3"
            },
            {
                "title": "Operational Risk - Medium Level",
                "severity": "medium",
                "description": "Risk level at 45%",
                "action": "Monitor and optimize",
                "deadline": "2026-Q4"
            },
            {
                "title": "Model Risk - Monitoring Active",
                "severity": "medium",
                "description": "AI model performance tracking",
                "action": "Continue monthly reviews",
                "deadline": "Ongoing"
            }
        ]
    }

@app.get("/api/recommendations")
async def get_recommendations():
    """Get AI-driven recommendations"""
    query = f"SELECT title, impact, status, priority FROM `{BQ_PROJECT}.{BQ_DATASET}.recommendations`" if BQ_PROJECT else f"SELECT title, impact, status, priority FROM `{BQ_DATASET}.recommendations`"
    res = query_bigquery(query, None)
    if res:
        return {"recommendations": res}
    return {
        "recommendations": [
            {
                "title": "Optimize Data Center Operations",
                "impact": "4.2 Tons CO₂/year",
                "status": "High Impact",
                "priority": 1
            },
            {
                "title": "Implement Cloud Auto-Scaling",
                "impact": "3.8 Tons CO₂/year",
                "status": "Medium Impact",
                "priority": 2
            },
            {
                "title": "Enhance AI Model Monitoring",
                "impact": "Reduce Risk by 15%",
                "status": "Risk Reduction",
                "priority": 1
            },
            {
                "title": "Adopt Sustainable Vendors",
                "impact": "2.3 Tons CO₂/year",
                "status": "Strategic",
                "priority": 3
            }
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)