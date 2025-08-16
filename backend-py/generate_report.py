#!/usr/bin/env python3
"""
StartupXYZ Client Report Generator
Generates a professional PDF report with horizontal timeline visualization
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.platypus.flowables import HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.graphics.shapes import Drawing, Circle, Line, String, Rect
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics import renderPDF
from reportlab.platypus.flowables import Flowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
import datetime

class HorizontalTimeline(Flowable):
    """Custom flowable for horizontal timeline visualization"""
    
    def __init__(self, events, width=500, height=120):
        Flowable.__init__(self)
        self.events = events
        self.width = width
        self.height = height
    
    def draw(self):
        # Timeline parameters
        timeline_y = self.height // 2
        start_x = 50
        end_x = self.width - 50
        timeline_length = end_x - start_x
        
        # Draw main timeline line
        self.canv.setStrokeColor(colors.HexColor('#3498db'))
        self.canv.setLineWidth(3)
        self.canv.line(start_x, timeline_y, end_x, timeline_y)
        
        # Calculate positions for events
        num_events = len(self.events)
        if num_events > 1:
            step = timeline_length / (num_events - 1)
        else:
            step = 0
        
        for i, (date, event, status) in enumerate(self.events):
            x_pos = start_x + (i * step)
            
            # Draw event circle
            circle_color = colors.HexColor('#27ae60') if status == 'completed' else colors.HexColor('#f39c12')
            self.canv.setFillColor(circle_color)
            self.canv.setStrokeColor(colors.white)
            self.canv.setLineWidth(2)
            self.canv.circle(x_pos, timeline_y, 8, fill=1, stroke=1)
            
            # Draw date label (above timeline)
            self.canv.setFillColor(colors.HexColor('#2c3e50'))
            self.canv.setFont("Helvetica-Bold", 9)
            date_width = self.canv.stringWidth(date, "Helvetica-Bold", 9)
            self.canv.drawString(x_pos - date_width/2, timeline_y + 20, date)
            
            # Draw event label (below timeline)
            self.canv.setFont("Helvetica", 8)
            # Split long event names into multiple lines
            words = event.split(' ')
            if len(' '.join(words)) > 15:
                line1 = ' '.join(words[:2])
                line2 = ' '.join(words[2:])
                line1_width = self.canv.stringWidth(line1, "Helvetica", 8)
                line2_width = self.canv.stringWidth(line2, "Helvetica", 8)
                self.canv.drawString(x_pos - line1_width/2, timeline_y - 25, line1)
                self.canv.drawString(x_pos - line2_width/2, timeline_y - 35, line2)
            else:
                event_width = self.canv.stringWidth(event, "Helvetica", 8)
                self.canv.drawString(x_pos - event_width/2, timeline_y - 25, event)

class ProgressChart(Flowable):
    """Custom flowable for progress visualization"""
    
    def __init__(self, completed, total, width=200, height=200):
        Flowable.__init__(self)
        self.completed = completed
        self.total = total
        self.width = width
        self.height = height
    
    def draw(self):
        # Create pie chart
        d = Drawing(self.width, self.height)
        
        pie = Pie()
        pie.x = 50
        pie.y = 50
        pie.width = 100
        pie.height = 100
        
        percentage_complete = (self.completed / self.total) * 100
        pie.data = [percentage_complete, 100 - percentage_complete]
        pie.labels = ['Completed', 'Pending']
        pie.slices.strokeWidth = 0.5
        pie.slices[0].fillColor = colors.HexColor('#27ae60')
        pie.slices[1].fillColor = colors.HexColor('#f39c12')
        
        d.add(pie)
        
        # Add center text
        d.add(String(100, 100, f'{int(percentage_complete)}%', 
                    fontSize=16, fillColor=colors.HexColor('#2c3e50'), 
                    textAnchor='middle'))
        
        renderPDF.draw(d, self.canv, 0, 0)

def create_client_report():
    """Generate the complete client report PDF"""
    
    # Create document
    doc = SimpleDocTemplate(
        "/Users/ayushrane/reports/StartupXYZ_Client_Report.pdf",
        pagesize=A4,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )
    
    # Get styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=26,
        spaceAfter=20,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#2c3e50')
    )
    
    subtitle_style = ParagraphStyle(
        'SubTitle',
        parent=styles['Heading2'],
        fontSize=14,
        spaceAfter=30,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#7f8c8d')
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=18,
        spaceAfter=15,
        spaceBefore=25,
        textColor=colors.HexColor('#2c3e50'),
        borderWidth=2,
        borderColor=colors.HexColor('#3498db'),
        borderPadding=8,
        backColor=colors.HexColor('#f8f9fa')
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=8,
        textColor=colors.HexColor('#333333')
    )
    
    bullet_style = ParagraphStyle(
        'BulletStyle',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=6,
        leftIndent=20,
        bulletIndent=10,
        textColor=colors.HexColor('#333333')
    )
    
    # Build document content
    story = []
    
    # Title page
    story.append(Paragraph("Client Report", title_style))
    story.append(Paragraph("StartupXYZ - SaaS Subscription Implementation", subtitle_style))
    
    # Add generation date
    current_date = datetime.datetime.now().strftime("%B %d, %Y")
    story.append(Paragraph(f"<i>{current_date}</i>", styles['Normal']))
    story.append(Spacer(1, 40))
    
    # Project Overview Section
    story.append(Paragraph("SaaS Implementation Overview", heading_style))
    
    overview_text = """
    Implementation progress for StartupXYZ SaaS subscription:<br/><br/>
    
    <b>• Company:</b> StartupXYZ<br/>
    <b>• Solution:</b> Cloud-based SaaS Platform for Workflow Automation<br/>
    <b>• Investment:</b> $25,000 SaaS Subscription<br/>
    <b>• Project Start:</b> January 9, 2024<br/>
    <b>• Client Representative:</b> Emily Rodriguez<br/>
    <b>• Current Status:</b> Implementation Phase - 60% Complete<br/>
    """
    
    story.append(Paragraph(overview_text, body_style))
    story.append(Spacer(1, 40))
    
    # Timeline Section - Featured prominently
    story.append(Paragraph("🚀 Implementation Timeline", heading_style))
    story.append(Spacer(1, 20))
    
    # Timeline events data
    timeline_events = [
        ("Jan 9", "Partnership Launched", "completed"),
        ("Jan 10", "Platform Activated", "completed"),
        ("Jan 11", "Team Training", "completed"),
        ("Jan 12", "First Reports", "pending"),
        ("Jan 15", "Success Review", "pending")
    ]
    
    # Add horizontal timeline
    timeline = HorizontalTimeline(timeline_events, width=450, height=120)
    story.append(timeline)
    story.append(Spacer(1, 35))
    story.append(PageBreak())
    
    # Status Section
    story.append(Paragraph("Implementation Progress", heading_style))
    
    progress_intro = """
    Current implementation status and milestone completion:
    """
    story.append(Paragraph(progress_intro, body_style))
    story.append(Spacer(1, 15))
    
    # Status table with colored circles
    status_data = [
        ['Milestone', 'Status'],
        ['Partnership Agreement Finalized', '● Complete'],
        ['Platform Setup & Configuration', '● Complete'],
        ['Team Training & Onboarding', '● Complete'],
        ['First Reports & Analytics', '● In Progress'],
        ['Success Review & Optimization', '● Scheduled Jan 15']
    ]
    
    status_table = Table(status_data, colWidths=[3.2*inch, 1.8*inch])
    status_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3498db')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#ddd')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8f9fa')]),
        # Green circles for completed items (rows 1-3)
        ('TEXTCOLOR', (1, 1), (1, 3), colors.HexColor('#27ae60')),
        # Grey circles for pending items (rows 4-5)
        ('TEXTCOLOR', (1, 4), (1, 5), colors.HexColor('#95a5a6'))
    ]))
    
    story.append(status_table)
    story.append(Spacer(1, 35))
    
    # Meeting Notes Section
    story.append(Paragraph("Recent Collaboration Highlights", heading_style))
    
    meeting_text = """
    <b>Implementation Kickoff Meeting - January 9, 2024</b><br/>
    <b>Client Representative:</b> Emily Rodriguez<br/><br/>
    
    <b>Meeting Outcomes:</b><br/>
    • ✅ Finalized SaaS solution configuration<br/>
    • ✅ Completed platform activation<br/>
    • ✅ Scheduled team training sessions<br/>
    • 🚀 Discussed expansion plans for Q2 2024<br/>
    • 📅 Scheduled follow-up review for January 15<br/><br/>
    
    <b>Client Feedback:</b> Strong interest expressed in expanding the solution to additional teams, 
    indicating positive early adoption and value recognition.
    """
    
    story.append(Paragraph(meeting_text, body_style))
    story.append(Spacer(1, 30))
    
    # Action Items Section
    story.append(Paragraph("Next Steps", heading_style))
    
    action_items = """
    <b>Immediate Priorities:</b><br/><br/>
    
    <b>🎯 This Week:</b><br/>
    → Complete first custom reports and analytics dashboard<br/>
    → Finalize initial usage review and optimization<br/><br/>
    
    <b>📅 January 15 Follow-up Review:</b><br/>
    → Review platform adoption and early results<br/>
    → Address any questions or additional training needs<br/>
    → Discuss Q2 expansion plans<br/>
    → Identify optimization opportunities<br/><br/>
    
    <b>🚀 Future Planning:</b><br/>
    → Plan for additional team onboarding in Q2<br/>
    → Explore advanced features for enhanced productivity<br/>
    """
    
    story.append(Paragraph(action_items, body_style))
    story.append(Spacer(1, 30))
    
    # End of report - no contact section
    
    # Build PDF
    doc.build(story)
    print("✅ PDF report generated successfully: StartupXYZ_Client_Report.pdf")

if __name__ == "__main__":
    create_client_report()
