import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

def analyze_policy(policy):
    try:
        prompt = f"""
        You are a senior audit compliance consultant.

        Analyze the following policy:

        Policy Name: {policy['policy_name']}
        Department: {policy['department']}
        Compliance Score: {policy['compliance_score']}
        Critical Findings: {policy['critical_findings']}

        Provide:

        1. Risk Level
        2. Key Compliance Gaps
        3. Recommended Actions
        4. Executive Summary

        Keep the response concise and professional.
        """

        response = client.responses.create(
            model="gpt-4.1-mini",
            input=prompt
        )

        return response.output_text

    except Exception as e:
        return f"OPENAI ERROR: {str(e)}"
    
def chat_with_policy(policy_name, department, report, question):
    try:
        prompt = f"""
You are an experienced enterprise compliance auditor.

Policy:
{policy_name}

Department:
{department}

Existing AI Compliance Report:
{report}

The user has a follow-up question:

"{question}"

Answer only using the context above.

Be concise, professional, and practical.
"""

        response = client.responses.create(
            model="gpt-4.1-mini",
            input=prompt
        )

        return response.output_text

    except Exception as e:
        return f"OPENAI ERROR: {str(e)}"
    
def generate_roadmap(policy_name, department, report):
    prompt = f"""
You are a senior compliance consultant.

Policy:
{policy_name}

Department:
{department}

Compliance Report:
{report}

Generate a practical remediation roadmap.

Format exactly like this:

## 30-Day Compliance Roadmap

Week 1
- ...

Week 2
- ...

Week 3
- ...

Week 4
- ...

Expected Compliance Score
Current: XX%

Predicted: XX%

Risk Reduction
Current: High

Predicted: Low

Keep it concise and actionable.
"""

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt,
    )

    return response.output_text

def simulate_compliance(
    policy_name,
    department,
    current_score,
    training,
    documentation,
    audit_frequency,
    automation,
):
    # Calculate predicted score locally
    base_score = current_score

    improvement = (
        training * 0.30 +
        documentation * 0.35 +
        audit_frequency * 0.20 +
        automation * 0.25
    ) / 10

    bonus = {
        "Vendor Security Policy": 6,
        "Litigation Response Policy": 2,
        "Records Retention Policy": 3,
        "Payroll Controls": 5,
        "Employee Onboarding Policy": 4,
        "Procurement Policy": 5,
    }.get(policy_name, 3)

    predicted_score = min(
        100,
        round(base_score + improvement + bonus)
    )

    prompt = f"""
You are a Senior Compliance Auditor and AI Risk Consultant.

A company wants to estimate how improvements to a policy will affect its compliance posture.

Policy:
{policy_name}

Department:
{department}

Current Compliance Score:
{current_score}%

The predicted compliance score has ALREADY been calculated.

Predicted Compliance Score:
{predicted_score}%

Planned Improvements:
- Training Coverage: {training}%
- Documentation Quality: {documentation}%
- Audit Frequency: {audit_frequency}%
- Automation Level: {automation}%

DO NOT change the predicted compliance score.

Based on the information above, estimate ONLY:

1. Risk Level (Low, Medium, High, Critical)
2. Expected Number of Critical Findings
3. A short explanation (3–5 sentences).

Return ONLY valid JSON in this format:

{{
  "predicted_score": {predicted_score},
  "risk": "Medium",
  "critical_findings": 1,
  "explanation": "Explain why the score changes based on the planned improvements."
}}
"""

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt,
    )

    import json

    text = response.output_text.strip()
    text = text.replace("```json", "").replace("```", "").strip()

    print("RAW RESPONSE:")
    print(text)

    return json.loads(text)