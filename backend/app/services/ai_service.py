import os
from urllib import response
from click import prompt
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
def generate_actions(policy_name, department, report):
    import json

    prompt = f"""
You are a Senior Audit Compliance Consultant.

Policy:
{policy_name}

Department:
{department}

Audit Report:
{report}

Generate exactly 5 concise actionable compliance recommendations.
Each description should be no more than two short sentences.

Return ONLY valid JSON.

{{
  "actions": [
    {{
      "priority": "High",
      "title": "Improve Employee Training",
      "description": "Conduct quarterly compliance training for all employees."
    }}
  ]
}}
"""

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt,
    )

    text = response.output_text.strip()
    text = text.replace("```json", "").replace("```", "").strip()

    return json.loads(text)

def generate_executive_summary(policy_name, department, report):
    try:
        prompt = f"""
        ...
        Executive Recommendation
        One concise paragraph explaining what leadership should prioritize next.
        """

        response = client.responses.create(
            model="gpt-4.1-mini",
            input=prompt,
        )

        summary = response.output_text.strip()

        return summary

    except Exception as e:
        print(e)
        return None
    

def compare_policies_ai(
    policy1_name,
    policy1_department,
    policy1_report,
    policy2_name,
    policy2_department,
    policy2_report,
):

    prompt = f"""
You are a Chief Audit Executive comparing two enterprise policies.

Compare the policies from a business risk and compliance perspective.

Policy A
Name: {policy1_name}
Department: {policy1_department}

Audit Report:
{policy1_report}

--------------------------------

Policy B
Name: {policy2_name}
Department: {policy2_department}

Audit Report:
{policy2_report}

--------------------------------

Return ONLY this format.

Overall Assessment

One paragraph comparing both policies.

Higher Risk Policy

State which policy has the higher enterprise risk and why.

Key Differences

• Difference 1
• Difference 2
• Difference 3

Business Recommendation

One paragraph describing which policy leadership should prioritize first and why.

Do not use markdown.
Do not repeat the reports.
Keep under 220 words.
"""

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt,
    )

    return response.output_text.strip()

def generate_regulation_mapping(policy: dict):

    prompt = f"""
You are a Senior Enterprise Compliance Auditor.

Analyze the following enterprise policy.

Policy Name:
{policy.get("policy_name")}

Department:
{policy.get("department")}

Description:
{policy.get("description")}

Critical Findings:
{policy.get("critical_findings")}

Compliance Score:
{policy.get("compliance_score")}

Return ONLY valid GitHub Markdown.

Rules:
- Return ONLY valid GitHub Markdown.
- Do NOT include any introduction or conclusion.
- Do NOT explain your reasoning.
- Do NOT use code fences.
- Use markdown headings only.
- Use ONLY markdown tables.
- Every framework MUST contain exactly 3 controls.
- Notes must be one concise sentence (maximum 20 words).
- Use these status values ONLY:
  - 🟢 Compliant
  - 🟡 Partial
  - 🔴 Non-Compliant
- Separate major sections with a horizontal rule (---).
- Every section must appear exactly once.
- Do not duplicate headings or content.

Use EXACTLY this structure.
## Executive Assessment

Write exactly 2 concise sentences.

Sentence 1:
Summarize the policy's overall compliance posture.

Sentence 2:
Highlight the highest business or regulatory risk.

## SOC2

| Control | Status | Notes |
|----------|--------|-------|
| ... | ... | ... |
| ... | ... | ... |
| ... | ... | ... |

## ISO 27001

| Control | Status | Notes |
|----------|--------|-------|
| ... | ... | ... |
| ... | ... | ... |
| ... | ... | ... |

## GDPR

| Article | Status | Notes |
|----------|--------|-------|
| ... | ... | ... |
| ... | ... | ... |
| ... | ... | ... |

## HIPAA

| Requirement | Status | Notes |
|-------------|--------|-------|
| ... | ... | ... |
| ... | ... | ... |
| ... | ... | ... |

## Overall Compliance Score

### Estimated Score: **55/100**

One sentence explaining the score.
---

## Highest Priority Gaps

List exactly four bullet points ordered from highest to lowest risk.

---
"""

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        temperature=0,
        messages=[
            {
                "role": "system",
                "content": """
    You are an enterprise compliance expert.

    Always return VALID GitHub Markdown only.
    Never return plain text.
    Never use code fences.
    Always use markdown tables.
    """
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content

import json

def find_similar_policies(selected_policy, all_policies):

    prompt = f"""
You are a senior enterprise compliance consultant.

Your task is to compare ONE selected policy with all the other enterprise policies.

Selected Policy

Name:
{selected_policy["policy_name"]}

Department:
{selected_policy["department"]}

Compliance Score:
{selected_policy["compliance_score"]}

Critical Findings:
{selected_policy["critical_findings"]}

---------------------------------------

Other Policies

{json.dumps(all_policies, indent=2)}

---------------------------------------

Return ONLY valid JSON.

Return the FIVE most similar policies.

Similarity is based on:

- Business purpose
- Compliance objectives
- Department overlap
- Risk profile
- Audit findings

Return exactly this JSON.

{{
  "similar_policies":[
    {{
      "policy_name":"Vendor Security Policy",
      "department":"IT",
      "similarity":92,
      "reason":"Both policies govern access management and security controls."
    }}
  ]
}}

Rules:

- Never include the selected policy.
- Similarity must be between 0-100.
- Return exactly five policies.
- Reason must be one sentence.
"""

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt,
    )

    text = response.output_text.strip()

    text = text.replace("```json", "")
    text = text.replace("```", "")

    return json.loads(text)