"""
LaTeX & Markdown to PDF compiler service using ReportLab.
Converts optimized resume content into a crisp, publication-grade ATS PDF document.
Strictly strips preamble noise, raw syntax artifacts, and formats with clean typography.
"""
import re
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable


def _clean_text_formatting(text: str) -> str:
    """Removes LaTeX command artifacts and converts inline formatting to HTML for ReportLab."""
    if not text:
        return ""

    # Replace Rupee symbol or LaTeX rupee with Rs. to prevent missing glyph boxes (■)
    text = text.replace('₹', 'Rs. ').replace(r'\rupee', 'Rs. ').replace(r'\inr', 'Rs. ')

    # Replace LaTeX newline/spacing commands
    text = re.sub(r'\\\\\s*\[?\d*pt\]?', ' ', text)
    text = re.sub(r'\\\\', ' ', text)

    # Convert \textbf{text} -> <b>text</b>
    text = re.sub(r'\\textbf\{([^}]+)\}', r'<b>\1</b>', text)
    # Convert \textit{text} -> <i>text</i>
    text = re.sub(r'\\textit\{([^}]+)\}', r'<i>\1</i>', text)
    # Convert \href{url}{label} -> <a href="url"><u>label</u></a>
    text = re.sub(r'\\href\{([^}]+)\}\{([^}]+)\}', r'<a href="\1" color="#2563EB"><u>\2</u></a>', text)

    # Convert markdown **bold** -> <b>bold</b>, *italic* -> <i>italic</i>, [link](url) -> <a href="url"><u>link</u></a>
    text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'\*([^*]+)\*', r'<i>\1</i>', text)
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2" color="#2563EB"><u>\1</u></a>', text)

    # Clean LaTeX separator artifacts like \$|\$, $\|$, \|
    text = re.sub(r'\\?\$?\\?\|\\?\$?', ' | ', text)

    # Escape special symbols
    text = text.replace(r'\_', '_').replace(r'\&', '&').replace(r'\%', '%').replace(r'\$', '$').replace(r'\#', '#')

    # Remove remaining LaTeX commands (\small, \Large, \centering, \noindent, \gobble, etc.)
    text = re.sub(r'\\[a-zA-Z]+(\{[^}]*\})?', ' ', text)

    # Remove leftover braces
    text = text.replace('{', '').replace('}', '')

    # Clean up double spaces
    text = re.sub(r'\s+', ' ', text)

    return text.strip()


def compile_latex_to_pdf(content: str) -> bytes:
    """
    Parses optimized resume string (LaTeX or Markdown) and compiles it into clean PDF bytes.
    Optimized for compact 2-page fit with zero raw markdown/LaTeX syntax leaks.
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        leftMargin=28,
        rightMargin=28,
        topMargin=28,
        bottomMargin=28
    )

    styles = getSampleStyleSheet()

    # Typography styles matching professional ATS template
    name_style = ParagraphStyle(
        'HeaderName',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=21,
        textColor=colors.HexColor('#0F172A'),
        alignment=1 # Center
    )

    contact_style = ParagraphStyle(
        'HeaderContact',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor('#334155'),
        alignment=1 # Center
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=13,
        textColor=colors.HexColor('#1E3A8A'),
        spaceBefore=5,
        spaceAfter=2
    )

    body_style = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#1E293B')
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.8,
        leading=11.8,
        textColor=colors.HexColor('#1E293B'),
        leftIndent=12
    )

    story = []

    lines = content.split('\n')

    # If content contains \begin{document}, ignore lines BEFORE \begin{document}
    if '\\begin{document}' in content:
        doc_start = False
        filtered_lines = []
        for line in lines:
            if '\\begin{document}' in line:
                doc_start = True
                continue
            if '\\end{document}' in line:
                break
            if doc_start:
                filtered_lines.append(line)
        lines = filtered_lines

    first_line_parsed = False

    for line in lines:
        raw_line = line.strip()

        # Skip empty lines, comments, or latex preamble lines
        if not raw_line or raw_line.startswith('%'):
            continue

        # Skip preamble noise keywords if any slipped through
        if re.search(r'^(documentclass|usepackage|geometry|hyperref|enumitem|titlesec|xcolor|colorlinks|linkcolor|urlcolor|noitemsep|topsep|leftmargin|gobble|0pt|center)$', raw_line, re.IGNORECASE):
            continue

        # Handle --- horizontal divider lines (do NOT print text '---')
        if raw_line in ('---', '- - -', '===', '___'):
            story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#CBD5E1'), spaceBefore=2, spaceAfter=4))
            continue

        # 1. Candidate Name (Header)
        if not first_line_parsed:
            clean_name = _clean_text_formatting(raw_line)
            clean_name = re.sub(r'^[#\s]+', '', clean_name)
            if clean_name:
                story.append(Paragraph(f"<b>{clean_name}</b>", name_style))
                story.append(Spacer(1, 3))
                first_line_parsed = True
            continue

        # 2. Contact Info line (Phone, Email, Location, GitHub, LinkedIn)
        if ('@' in raw_line or 'github' in raw_line.lower() or 'linkedin' in raw_line.lower() or '+91' in raw_line or 'chhattisgarh' in raw_line.lower() or 'india' in raw_line.lower()) and len(story) <= 4:
            clean_contact = _clean_text_formatting(raw_line)
            if clean_contact:
                story.append(Paragraph(clean_contact, contact_style))
                story.append(Spacer(1, 4))
            continue

        # 3. Section Headers (## Section, # Section, \section*{Section}, or ALL CAPS line)
        section_match = (
            re.search(r'\\section\*?\{([^}]+)\}', raw_line) or
            re.search(r'^#{1,3}\s+(.*)', raw_line)
        )
        if section_match:
            sec_title = _clean_text_formatting(section_match.group(1)).upper()
            story.append(Spacer(1, 4))
            story.append(Paragraph(sec_title, section_heading))
            story.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor('#94A3B8'), spaceBefore=1, spaceAfter=3))
            continue

        # Check if plain line is an ALL CAPS section title
        if re.match(r'^(PROFESSIONAL SUMMARY|SUMMARY|TECHNICAL SKILLS|SKILLS|EXPERIENCE|PROJECTS|EDUCATION|HACKATHONS & ACHIEVEMENTS|HACKATHONS & PARTICIPATIONS|POSITIONS OF RESPONSIBILITY|CERTIFICATIONS|SOFT SKILLS)$', raw_line, re.IGNORECASE):
            sec_title = raw_line.upper()
            story.append(Spacer(1, 4))
            story.append(Paragraph(sec_title, section_heading))
            story.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor('#94A3B8'), spaceBefore=1, spaceAfter=3))
            continue

        # 4. Bullet Items (\item ..., - ..., * ..., • ...)
        if raw_line.startswith('\\item') or raw_line.startswith('- ') or raw_line.startswith('* ') or raw_line.startswith('• '):
            clean_item = raw_line
            clean_item = re.sub(r'^(\\item|[\-\*•])\s*', '', clean_item)
            clean_item = _clean_text_formatting(clean_item)
            if clean_item:
                story.append(Paragraph(f"• &nbsp; {clean_item}", bullet_style))
                story.append(Spacer(1, 1.5))
            continue

        # 5. Regular body text / Subheadings
        clean_text = _clean_text_formatting(raw_line)
        if clean_text:
            story.append(Paragraph(clean_text, body_style))
            story.append(Spacer(1, 2))

    # Build PDF
    doc.build(story)
    return buffer.getvalue()
