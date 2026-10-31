from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from .models import Invoice

def generate_invoice_pdf(invoice: Invoice) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    story = []
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle('DocTitle', parent=styles['Heading1'], fontSize=20, leading=24, textColor=colors.HexColor("#1A365D"))
    heading_style = ParagraphStyle('SectionHeader', parent=styles['Heading2'], fontSize=12, leading=16, textColor=colors.HexColor("#2B6CB0"))
    normal_style = styles['Normal']

    story.append(Paragraph(f"INVOICE: {invoice.invoice_number}", title_style))
    story.append(Spacer(1, 10))

    meta_data = [
        [Paragraph(f"<b>Customer:</b> {invoice.customer}", normal_style), Paragraph(f"<b>Status:</b> {invoice.status.upper()}", normal_style)],
        [Paragraph(f"<b>Issue Date:</b> {invoice.issue_date}", normal_style), Paragraph(f"<b>Due Date:</b> {invoice.due_date}", normal_style)],
        [Paragraph(f"<b>Billing Period:</b> {invoice.period_start} to {invoice.period_end}", normal_style), Paragraph("", normal_style)],
    ]
    meta_table = Table(meta_data, colWidths=[270, 270])
    meta_table.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP')]))
    story.append(meta_table)
    story.append(Spacer(1, 20))

    story.append(Paragraph("Invoice Items", heading_style))
    story.append(Spacer(1, 8))

    item_data = [["Description", "Qty", "Unit Price", "Subtotal"]]
    for line in invoice.lines.all():
        item_data.append([line.description, str(line.quantity), f"${line.unit_price:.2f}", f"${line.subtotal:.2f}"])

    item_table = Table(item_data, colWidths=[270, 50, 110, 110])
    item_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#EDF2F7")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor("#2D3748")),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E0")),
    ]))
    story.append(item_table)
    story.append(Spacer(1, 20))

    summary_data = [
        ["Subtotal:", f"${invoice.subtotal:.2f}"],
        ["Discount:", f"-${invoice.discount_amount:.2f}"],
        [f"Tax ({invoice.tax_rate_snapshot}%):", f"${invoice.tax_amount:.2f}"],
        ["Total Amount:", f"${invoice.total_amount:.2f}"],
        ["Amount Paid:", f"${invoice.amount_paid:.2f}"],
        ["Outstanding Balance:", f"${invoice.outstanding_balance:.2f}"],
    ]
    summary_table = Table(summary_data, colWidths=[400, 140])
    summary_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 3), (-1, 3), 'Helvetica-Bold'),
        ('FONTNAME', (0, 5), (-1, 5), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, 5), (-1, 5), colors.HexColor("#C53030") if invoice.outstanding_balance > 0 else colors.HexColor("#2F855A")),
    ]))
    story.append(summary_table)

    doc.build(story)
    pdf_value = buffer.getvalue()
    buffer.close()
    return pdf_value
