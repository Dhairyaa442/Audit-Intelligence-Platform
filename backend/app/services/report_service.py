from io import BytesIO
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet


def generate_report_pdf(
    policy_name: str,
    department: str,
    analysis: str,
    roadmap: str,
):
    buffer = BytesIO()

    doc = SimpleDocTemplate(buffer)

    styles = getSampleStyleSheet()

    story = []

    story.append(Paragraph("<b>Audit Intelligence Platform</b>", styles["Title"]))
    story.append(Paragraph(f"<b>Policy:</b> {policy_name}", styles["Normal"]))
    story.append(Paragraph(f"<b>Department:</b> {department}", styles["Normal"]))
    story.append(Paragraph("<br/>", styles["Normal"]))

    story.append(Paragraph("<b>AI Compliance Analysis</b>", styles["Heading2"]))
    story.append(Paragraph(analysis.replace("\n", "<br/>"), styles["BodyText"]))

    story.append(Paragraph("<br/>", styles["Normal"]))

    story.append(Paragraph("<b>AI Remediation Roadmap</b>", styles["Heading2"]))
    story.append(Paragraph(roadmap.replace("\n", "<br/>"), styles["BodyText"]))

    doc.build(story)

    buffer.seek(0)

    return buffer