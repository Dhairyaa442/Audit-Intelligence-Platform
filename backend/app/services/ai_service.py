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