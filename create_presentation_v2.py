import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def build_deck(output_path):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Enhanced High-Contrast Modern Tech Palette
    C_BG = RGBColor(7, 11, 25)           # #070B19 Deep Obsidian Navy
    C_CARD = RGBColor(16, 24, 40)        # #101828 High-contrast Card Fill
    C_CARD_BORDER = RGBColor(38, 56, 88) # Subtle card border
    C_CYAN = RGBColor(56, 189, 248)      # #38BDF8 Glowing Cyan
    C_GREEN = RGBColor(16, 185, 129)     # #10B981 Vivid Emerald
    C_AMBER = RGBColor(245, 158, 11)     # #F59E0B Golden Amber
    C_PURPLE = RGBColor(168, 85, 247)    # #A855F7 Vivid Purple
    C_ROSE = RGBColor(244, 63, 94)       # #F43F5E Coral Rose
    C_WHITE = RGBColor(255, 255, 255)
    C_TEXT_LIGHT = RGBColor(226, 232, 240)# #E2E8F0 High readability
    C_TEXT_MUTED = RGBColor(148, 163, 184)# #94A3B8

    asset_dir = "assets/presentation_assets"

    def set_slide_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_BG
        bg.line.fill.background()

    def add_header(slide, slide_num, category, title, subtitle, presenter=""):
        # Top Meta Pill & Presenter
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.35), Inches(11.733), Inches(0.4))
        tf = tag_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        
        run_cat = p.add_run()
        run_cat.text = f"[{category.upper()}]  "
        run_cat.font.name = "Arial"
        run_cat.font.size = Pt(12)
        run_cat.font.bold = True
        run_cat.font.color.rgb = C_CYAN

        if presenter:
            run_pres = p.add_run()
            run_pres.text = f"🎙️ Presenter: {presenter}"
            run_pres.font.name = "Arial"
            run_pres.font.size = Pt(12)
            run_pres.font.bold = True
            run_pres.font.color.rgb = C_PURPLE

        # Slide Number Pill
        num_box = slide.shapes.add_textbox(Inches(10.0), Inches(0.35), Inches(2.5), Inches(0.4))
        tf_num = num_box.text_frame
        tf_num.margin_left = tf_num.margin_top = tf_num.margin_right = tf_num.margin_bottom = 0
        p_n = tf_num.paragraphs[0]
        p_n.alignment = PP_ALIGN.RIGHT
        p_n.text = f"Slide {str(slide_num).zfill(2)} / 20"
        p_n.font.name = "Arial"
        p_n.font.size = Pt(13)
        p_n.font.bold = True
        p_n.font.color.rgb = C_CYAN

        # Large Projector Title (27pt bold)
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.72), Inches(11.733), Inches(0.65))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        tf_title.margin_left = tf_title.margin_top = tf_title.margin_right = tf_title.margin_bottom = 0
        p_t = tf_title.paragraphs[0]
        p_t.text = title
        p_t.font.name = "Arial"
        p_t.font.size = Pt(26)
        p_t.font.bold = True
        p_t.font.color.rgb = C_WHITE

        # Subtitle (14pt)
        if subtitle:
            sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.35), Inches(11.733), Inches(0.35))
            tf_sub = sub_box.text_frame
            tf_sub.word_wrap = True
            tf_sub.margin_left = tf_sub.margin_top = tf_sub.margin_right = tf_sub.margin_bottom = 0
            p_s = tf_sub.paragraphs[0]
            p_s.text = subtitle
            p_s.font.name = "Arial"
            p_s.font.size = Pt(13.5)
            p_s.font.color.rgb = C_TEXT_MUTED

        # Divider line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.75), Inches(11.733), Inches(0.025))
        line.fill.solid()
        line.fill.fore_color.rgb = C_CARD_BORDER
        line.line.fill.background()

    def add_footer(slide):
        foot_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.05), Inches(11.733), Inches(0.3))
        tf = foot_box.text_frame
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = "MITS CLUB HUB • Madhav Institute of Technology & Science, Gwalior (Deemed University) • mitsgwlclubhub.com"
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.color.rgb = RGBColor(100, 116, 139)

    def add_card(slide, left, top, width, height, title, points, icon_text="📌", border_color=C_CARD_BORDER, text_size=12.5):
        # Card Background
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = border_color
        card.line.width = Pt(2.0)

        # Title
        tb = slide.shapes.add_textbox(Inches(left + 0.25), Inches(top + 0.2), Inches(width - 0.5), Inches(0.45))
        tf = tb.text_frame
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = f"{icon_text}  {title}"
        p.font.name = "Arial"
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = C_WHITE

        # Bullets
        bb = slide.shapes.add_textbox(Inches(left + 0.25), Inches(top + 0.75), Inches(width - 0.5), Inches(height - 0.9))
        tf_b = bb.text_frame
        tf_b.word_wrap = True
        tf_b.margin_left = tf_b.margin_top = tf_b.margin_right = tf_b.margin_bottom = 0
        for i, pt in enumerate(points):
            p_pt = tf_b.add_paragraph() if i > 0 else tf_b.paragraphs[0]
            p_pt.space_after = Pt(8)
            
            if ":" in pt:
                prefix, rest = pt.split(":", 1)
                r1 = p_pt.add_run()
                r1.text = "• " + prefix + ":"
                r1.font.bold = True
                r1.font.color.rgb = C_CYAN
                r1.font.size = Pt(text_size)
                
                r2 = p_pt.add_run()
                r2.text = rest
                r2.font.color.rgb = C_TEXT_LIGHT
                r2.font.size = Pt(text_size)
            else:
                r = p_pt.add_run()
                r.text = "• " + pt
                r.font.color.rgb = C_TEXT_LIGHT
                r.font.size = Pt(text_size)

    def add_screenshot_frame(slide, left, top, width, height, title, tip=""):
        # Big outer frame
        box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        box.fill.solid()
        box.fill.fore_color.rgb = RGBColor(12, 18, 34)
        box.line.color.rgb = C_CYAN
        box.line.width = Pt(2.0)
        box.line.dash_style = 2 # dashed

        # Header tag in screenshot box
        hdr = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left + 0.3), Inches(top + 0.25), Inches(width - 0.6), Inches(0.45))
        hdr.fill.solid()
        hdr.fill.fore_color.rgb = RGBColor(22, 34, 60)
        hdr.line.color.rgb = C_CYAN
        hdr.line.width = Pt(1)
        tf_h = hdr.text_frame
        p_h = tf_h.paragraphs[0]
        p_h.alignment = PP_ALIGN.CENTER
        p_h.text = f"🖼️ LIVE SCREENSHOT: {title.upper()}"
        p_h.font.bold = True
        p_h.font.size = Pt(11)
        p_h.font.color.rgb = C_CYAN

        # Center placeholder instructions
        tb = slide.shapes.add_textbox(Inches(left + 0.4), Inches(top + (height / 2.0) - 0.4), Inches(width - 0.8), Inches(1.2))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p1 = tf.paragraphs[0]
        p1.alignment = PP_ALIGN.CENTER
        r1 = p1.add_run()
        r1.text = "📸 [ DRAG & DROP SCREENSHOT HERE ]\n"
        r1.font.bold = True
        r1.font.size = Pt(13)
        r1.font.color.rgb = C_WHITE

        r2 = p1.add_run()
        r2.text = f"{title}\n"
        r2.font.bold = True
        r2.font.size = Pt(11.5)
        r2.font.color.rgb = C_AMBER

        if tip:
            r3 = p1.add_run()
            r3.text = f"💡 Tip: {tip}"
            r3.font.size = Pt(10)
            r3.font.color.rgb = C_TEXT_MUTED

    # ==========================================
    # SLIDE 1: TITLE SLIDE WITH OFFICIAL MITS LOGO
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s1)

    # Embed Real MITS Logo PNG
    logo_path = os.path.join(asset_dir, "mits_crest_logo.png")
    if os.path.exists(logo_path):
        s1.shapes.add_picture(logo_path, Inches(0.8), Inches(0.6), Inches(1.5), Inches(1.5))

    # Hero Title (Projector Friendly 40pt)
    t_box = s1.shapes.add_textbox(Inches(2.5), Inches(0.55), Inches(10.0), Inches(1.6))
    tf_t = t_box.text_frame
    tf_t.word_wrap = True
    p1 = tf_t.paragraphs[0]
    p1.text = "MITS CLUB HUB"
    p1.font.name = "Arial"
    p1.font.size = Pt(40)
    p1.font.bold = True
    p1.font.color.rgb = C_WHITE

    p2 = tf_t.add_paragraph()
    p2.text = "The Centralized Digital Ecosystem for Student Clubs, 2FA Security & Faculty Approvals"
    p2.font.name = "Arial"
    p2.font.size = Pt(15)
    p2.font.bold = True
    p2.font.color.rgb = C_CYAN

    p3 = tf_t.add_paragraph()
    p3.text = "Madhav Institute of Technology & Science (MITS), Gwalior • Academic Session 2026-27"
    p3.font.name = "Arial"
    p3.font.size = Pt(12)
    p3.font.color.rgb = C_AMBER

    # Team Members Card (Large, high-contrast)
    add_card(s1, 0.8, 2.3, 7.3, 4.5, "CORE ENGINEERING TEAM (1st Year AI)", [
        "Akash Dhakad (Lead Architect): Core Architecture, @mitsgwl.ac.in Domain RBAC, Firebase Phone 2FA OTP, SPA Routing, Cloud Firestore.",
        "Alok Mahor (Core Contributor): 10+ Club Research Matrix (Aerospace, Scavengers, Querecia, ISTE), 3D Multi-Filter Discovery Console.",
        "Aman Singh (Core Contributor): Student Recruitment Pipeline, Membership Applications, President Operations Center & Handover.",
        "Akash Gupta (Core Contributor): Faculty Coordinator Approval Workflow, Multi-Channel Mentor Notification Dispatcher, Contact Action Sheet."
    ], icon_text="👥", border_color=C_CYAN, text_size=11.5)

    # Supervision Card (Large Placeholders for Teacher)
    add_card(s1, 8.4, 2.3, 4.133, 4.5, "ACADEMIC SUPERVISION", [
        "Institution: MITS Gwalior (Deemed University)",
        "Department: Department of Artificial Intelligence & Data Science",
        "Faculty Mentor: Prof. [ ________________________ ]",
        "Designation: Assistant / Associate Professor",
        "Head of Dept (HOD): Dr. [ ________________________ ]",
        "Director: Dr. [ ________________________ ]",
        "Live Production URL: mits-gwl-club-hub.netlify.app",
        "GitHub Pages: akashcyber02.github.io/mits-club-hub"
    ], icon_text="🎓", border_color=C_AMBER, text_size=11.5)

    add_footer(s1)

    # ==========================================
    # SLIDE 2: PROBLEM STATEMENT (HIGH CONTRAST)
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s2)
    add_header(s2, 2, "Problem & Motivation", "Campus Life Fragmentation vs Centralized Hub", "Why 5,000+ MITSians needed a single authoritative digital home for student activities.", "Joint Introduction")
    
    add_card(s2, 0.8, 2.0, 5.7, 4.8, "The Traditional Campus Chaos", [
        "Scattered WhatsApp Groups: Vital recruitment deadlines and event posters get buried under thousands of unorganized group messages.",
        "Unverified Registrations: Anyone could circulate unauthorized Google Forms or solicit club fees without college consent.",
        "Zero Faculty Oversight: Faculty coordinators lacked a dedicated dashboard to audit club rosters, finances, or annual calendars.",
        "Loss of Institutional Legacy: When seniors graduate, club social media handles, archives, and past records disappear.",
        "High Freshers Friction: First-year students struggle to identify genuine, active clubs aligned with their career ambitions."
    ], icon_text="❌", border_color=C_ROSE, text_size=12.5)

    add_card(s2, 6.8, 2.0, 5.7, 4.8, "The MITS Club Hub Solution", [
        "Strict College Authentication: Mandatory Google OAuth domain-locked strictly to @mitsgwl.ac.in credentials.",
        "Physical 2FA Phone Verification: Real telecom SMS OTP verification protects student leadership contact channels.",
        "Official Professor Approvals Queue: Every student club must receive explicit faculty authorization before going live.",
        "Structured Recruitment Engine: Replaces Google Forms with standardized applications, portfolio links, and countdown timers.",
        "Permanent Digital Archive: Historical leader rosters, high-res achievement galleries, and centralized leadership handover."
    ], icon_text="✅", border_color=C_GREEN, text_size=12.5)
    add_footer(s2)

    # ==========================================
    # SLIDE 3: CHRONOLOGICAL PROJECT JOURNEY (PEHLE KYA KIYA, PHIR KYA KIYA)
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s3)
    add_header(s3, 3, "Chronological Roadmap", "Project Development Journey: Pehle Kya Kiya, Phir Kya Kiya", "The step-by-step engineering timeline from initial campus research to live production deployment.", "Full Team Workflow")

    # 6 Step Process Cards in a 2x3 Grid with PNG Badges
    steps_data = [
        (1, "Phase 1: Campus Survey & Research", "Researched 30+ societies across Technical, Cultural, Sports, and Literary domains; structured standard taxonomy.", C_CYAN),
        (2, "Phase 2: Domain Privacy Gate", "Built strict @mitsgwl.ac.in Google OAuth gatekeeper, automatic roll number parsing, and 3-role RBAC matrix.", C_AMBER),
        (3, "Phase 3: Real 2FA Telecom SMS", "Engineered physical phone OTP delivery via Firebase Phone Auth + Invisible reCAPTCHA on Indian +91 numbers.", C_GREEN),
        (4, "Phase 4: Realtime Cloud Firestore", "Connected WebSocket onSnapshot listeners for instant multi-device sync (<100ms) with zero-reload SPA hash routing.", C_PURPLE),
        (5, "Phase 5: Faculty Governance Queue", "Developed the Official Professor Approvals Queue, 1-Click Gmail pre-filled dispatcher, and applicant management.", C_ROSE),
        (6, "Phase 6: Production CI/CD & Launch", "Configured Netlify Edge CDN, automated GitHub Pages Actions (100% Green), and custom domain readiness.", C_CYAN),
    ]

    col_w = 3.75
    row_h = 2.25
    positions = [
        (0.8, 2.0), (4.8, 2.0), (8.8, 2.0),
        (0.8, 4.5), (4.8, 4.5), (8.8, 4.5)
    ]

    for idx, (num, title, desc, color) in enumerate(steps_data):
        l, t = positions[idx]
        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(l), Inches(t), Inches(col_w), Inches(row_h))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = color
        card.line.width = Pt(2.0)

        # Step Badge PNG
        b_path = os.path.join(asset_dir, f"badge_step{num}.png")
        if os.path.exists(b_path):
            s3.shapes.add_picture(b_path, Inches(l + 0.15), Inches(t + 0.15), Inches(0.45), Inches(0.45))

        # Title
        tb = s3.shapes.add_textbox(Inches(l + 0.7), Inches(t + 0.15), Inches(col_w - 0.8), Inches(0.5))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = C_WHITE

        # Desc
        tb_d = s3.shapes.add_textbox(Inches(l + 0.2), Inches(t + 0.7), Inches(col_w - 0.4), Inches(row_h - 0.8))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True
        p_d = tf_d.paragraphs[0]
        p_d.text = desc
        p_d.font.size = Pt(11.5)
        p_d.font.color.rgb = C_TEXT_LIGHT

    add_footer(s3)

    # ==========================================
    # SLIDE 4: SYSTEM ARCHITECTURE FLOWCHART
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s4)
    add_header(s4, 4, "System Architecture", "High-Level System Architecture & Data Flowchart", "Three-tier reactive cloud architecture with zero-reload SPA navigation.", "Akash Dhakad (Lead Architect)")

    # 3 Large Flowchart Blocks
    blocks = [
        ("1. CLIENT PRESENTATION LAYER", [
            "Responsive 3D Glassmorphism UI (HTML5, CSS3, ES2022)",
            "Hash-Based SPA Router (#club/id, #developer)",
            "3D Multi-Filter Console & Search Bar (<2s Discovery)",
            "Sub-second First Contentful Paint (<800ms on Mobile)"
        ], C_CYAN, 0.8),
        ("2. SECURITY & LOGIC GATEWAY", [
            "@mitsgwl.ac.in Domain Whitelist Filter",
            "Automatic Student Roll & Department Parser",
            "Physical SIM 2FA Phone Auth (Invisible reCAPTCHA)",
            "Multi-Role RBAC (Student, President, Faculty Mentor)"
        ], C_AMBER, 4.8),
        ("3. CLOUD DATA & EDGE CDN", [
            "Google Cloud Firestore Real-time Collections",
            "WebSocket onSnapshot State Listeners (<100ms)",
            "Netlify Edge CDN + GitHub Pages CI/CD Mirror",
            "Custom Domain: mitsgwlclubhub.com"
        ], C_GREEN, 8.8)
    ]

    for title, points, color, left in blocks:
        add_card(s4, left, 2.1, 3.733, 4.6, title, points, icon_text="⚙️", border_color=color, text_size=12)

    # Arrows between blocks
    arrow_path = os.path.join(asset_dir, "flow_arrow.png")
    if os.path.exists(arrow_path):
        s4.shapes.add_picture(arrow_path, Inches(4.2), Inches(4.0), Inches(0.55), Inches(0.25))
        s4.shapes.add_picture(arrow_path, Inches(8.2), Inches(4.0), Inches(0.55), Inches(0.25))

    add_footer(s4)

    # ==========================================
    # SLIDE 5: AKASH DHAKAD - DOMAIN RBAC + SCREENSHOT
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s5)
    add_header(s5, 5, "Security & Auth", "Phase 1: Domain-Restricted Security Gatekeeper Screen", "Mandatory authentication restricting portal access strictly to verified MITSians.", "Speaker 1: Akash Dhakad")
    add_card(s5, 0.8, 2.0, 5.5, 4.8, "Enterprise Security Principles", [
        "Zero External Intrusion: Regular Google accounts (@gmail.com, @yahoo.com) are rejected instantly with an alert toast.",
        "Roll & Branch Extraction: Student roll numbers (e.g. 26ai1al11) and department codes are parsed automatically upon login.",
        "Dynamic Role Classification: Logged-in users are dynamically classified as Student, Club President, or Faculty Coordinator.",
        "Firestore Security Rules: Backend security rules block any write operation not carrying an authorized college email claim.",
        "Privacy Protection: Unauthenticated users cannot view student phone numbers, leader rosters, or application forms."
    ], icon_text="🛡️", border_color=C_CYAN, text_size=12)
    add_screenshot_frame(s5, 6.6, 2.0, 5.9, 4.8, "Privacy Login Gatekeeper Screen", "Capture the Google Login button with @mitsgwl.ac.in banner")
    add_footer(s5)

    # ==========================================
    # SLIDE 6: AKASH DHAKAD - 2FA PHONE SMS + SCREENSHOT
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s6)
    add_header(s6, 6, "Two-Factor Auth", "Phase 2: Real Telecom SMS 2FA Phone Verification", "Physical SIM authentication protecting student leadership and direct contact channels.", "Speaker 1: Akash Dhakad")
    add_card(s6, 0.8, 2.0, 5.5, 4.8, "Engineering Real SMS Delivery", [
        "E.164 Automated Formatter: Converts 10-digit Indian numbers into international telecom standard (+91XXXXXXXXXX).",
        "Invisible Google reCAPTCHA: Silent background verification algorithm blocks bots without annoying image puzzles.",
        "Carrier Dispatch: Delivers real 6-digit SMS OTPs directly to Airtel, Jio, Vi, and BSNL mobile SIM cards.",
        "Auto-Recovery Mechanism: Automatically clears reCAPTCHA DOM containers, eliminating runtime conflicts.",
        "Verified 2FA Badge: Verified presidents earn an authenticated green badge, boosting parent & student trust."
    ], icon_text="📱", border_color=C_GREEN, text_size=12)
    add_screenshot_frame(s6, 6.6, 2.0, 5.9, 4.8, "2FA Phone Verification Modal", "Capture the 6-digit OTP code input, countdown timer, and verified badge")
    add_footer(s6)

    # ==========================================
    # SLIDE 7: AKASH DHAKAD - REALTIME SYNC & SPA + SCREENSHOT
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s7)
    add_header(s7, 7, "Realtime Engine", "Phase 3: Cloud Firestore Realtime Sync & SPA Routing", "Instant multi-device broadcast with zero-reload single-page navigation.", "Speaker 1: Akash Dhakad")
    add_card(s7, 0.8, 2.0, 5.5, 4.8, "Reactive State Architecture", [
        "WebSocket onSnapshot Subscriptions: Live listeners push database updates to client browsers in <100ms.",
        "Hash-Based SPA Routing: Deep linking support for individual clubs (#club/{id}) and developer profiles (#developer).",
        "Multi-Client Live Reflection: When a President publishes an announcement, all online students see the banner immediately.",
        "Zero-Reload Smoothness: Page transitions maintain browser history, back/forward buttons, and scroll restoration.",
        "Offline Cache Resilience: Firestore local persistence provides instant page rendering even on poor campus connections."
    ], icon_text="⚡", border_color=C_PURPLE, text_size=12)
    add_screenshot_frame(s7, 6.6, 2.0, 5.9, 4.8, "Real-time UI Sync & Live Notifications", "Capture live toast alert or instant announcement banner appearing on cards")
    add_footer(s7)

    # ==========================================
    # SLIDE 8: ALOK MAHOR - CLUB RESEARCH + SCREENSHOT
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s8)
    add_header(s8, 8, "Data Taxonomy", "Phase 4: Campus Clubs Research & Categorization Matrix", "Structuring the official student society database into a standardized college ontology.", "Speaker 2: Alok Mahor")
    add_card(s8, 0.8, 2.0, 5.5, 4.8, "Researched Society Ontology", [
        "Technical & Robotics: Aerospace MITS, Team Scavengers (Motorsports Club), AI Club, ISTE MITS Chapter.",
        "Literary & Debate: mits.querecia (Official Literary Society), Hindi Samiti MITS.",
        "Cultural & Music: Bandish MITS (Official Music Society), Dance & Dramatics Society.",
        "Sports & Athletics: MITS.FC (Football Club), Cricket & Badminton Student Cells.",
        "Health & Wellness: Holistic Health Club MITS (Physical and mental wellbeing initiatives).",
        "Institutional Cells: alumnicell.mech_mits (Departmental Alumni Relations & Mentorship)."
    ], icon_text="🗂️", border_color=C_CYAN, text_size=12)
    add_screenshot_frame(s8, 6.6, 2.0, 5.9, 4.8, "Category Pills & Directory Cards", "Capture the 6 category badges and active club cards in the directory")
    add_footer(s8)

    # ==========================================
    # SLIDE 9: ALOK MAHOR - 3D FILTER CONSOLE + SCREENSHOT
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s9)
    add_header(s9, 9, "Search & Discovery", "Phase 5: Interactive 3D Multi-Filter Discovery Console", "Multi-dimensional search algorithms enabling instant club discovery in <2 seconds.", "Speaker 2: Alok Mahor")
    add_card(s9, 0.8, 2.0, 5.5, 4.8, "Multi-Dimensional Search Features", [
        "Real-Time Keyword Search: Evaluates club names, taglines, keywords, and president names concurrently as you type.",
        "Category Pills Navigation: 1-click filtering across All, Technical, Cultural, Sports, Social, Literary, and Innovation.",
        "Recruitment Status Filter: Instantly isolates clubs currently hiring new members (Recruitment Open vs Closed).",
        "Financial Transparency Filter: Instant sorting between 100% Free Clubs and Paid Membership clubs with clear fee tags.",
        "Reset & Clear Console: Dedicated one-tap reset button restores full directory view immediately."
    ], icon_text="🔍", border_color=C_GREEN, text_size=12)
    add_screenshot_frame(s9, 6.6, 2.0, 5.9, 4.8, "3D Filter Console & Search Bar", "Capture search input, category chips, and dropdown filters in action")
    add_footer(s9)

    # ==========================================
    # SLIDE 10: ALOK MAHOR - CLUB SHOWCASE + SCREENSHOT
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s10)
    add_header(s10, 10, "User Experience", "Phase 6: Dedicated Single Page Club Breakdown Showcase", "'Kya Hai, Kyu Hai, Kaise Join Karein' structured narrative for every student society.", "Speaker 2: Alok Mahor")
    add_card(s10, 0.8, 2.0, 5.5, 4.8, "Deep Club Narrative Architecture", [
        "'Kya Hai' (About the Club): Society mission statement, founding vision, and regular weekly/monthly activities.",
        "'Kyu Hai' (Why Join): Practical benefits, skill development, peer networking, event exposure, and official certificates.",
        "'Kaise Join Karein' (How to Join): Registration requirements, timeline, fee breakdown, and 1-click apply trigger.",
        "Interactive 3D Lightbox Gallery: High-resolution photo gallery showcasing past orientations, fests, and competitions.",
        "Complete Leadership Roster: Profiles for President, Vice President, Tech Lead, Media Lead, and PR Coordinator."
    ], icon_text="📖", border_color=C_PURPLE, text_size=12)
    add_screenshot_frame(s10, 6.6, 2.0, 5.9, 4.8, "Dedicated Club Breakdown View", "Capture the hero cover banner, 'Kya Hai / Kyu Hai' sections, and gallery")
    add_footer(s10)

    # ==========================================
    # SLIDE 11: AMAN SINGH - RECRUITMENT PIPELINE + SCREENSHOT
    # ==========================================
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s11)
    add_header(s11, 11, "Recruitment Engine", "Phase 7: Student Membership & Recruitment Engine", "Structured recruitment pipelines replacing unorganized Google Forms across campus.", "Speaker 3: Aman Singh")
    add_card(s11, 0.8, 2.0, 5.5, 4.8, "Structured Application Pipeline", [
        "Standardized Application Modal: Gathers student roll number, year, branch, role preference, and statement of interest.",
        "Portfolio & Profile Links: Dedicated fields for GitHub repositories, LinkedIn profiles, and design portfolios.",
        "Deadline Countdown Badges: Real-time visual pills highlighting '3 Days Left' or 'Deadline Today' to drive applicant action.",
        "Duplicate Prevention: Security rules prevent students from spamming multiple applications to the same club.",
        "'My Applications' Dashboard: Students track application state (Pending, Shortlisted, Approved) live on their personal page."
    ], icon_text="📝", border_color=C_CYAN, text_size=12)
    add_screenshot_frame(s11, 6.6, 2.0, 5.9, 4.8, "Club Application Modal & Countdown Badges", "Capture the application form modal with countdown badge and portfolio inputs")
    add_footer(s11)

    # ==========================================
    # SLIDE 12: AMAN SINGH - PRESIDENT OPERATIONS + SCREENSHOT
    # ==========================================
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s12)
    add_header(s12, 12, "Leadership Portal", "Phase 8: President Operations & Review Command Center", "A comprehensive administrative workstation for club presidents and core committees.", "Speaker 3: Aman Singh")
    add_card(s12, 0.8, 2.0, 5.5, 4.8, "Presidential Administrative Controls", [
        "Live Applicant Roster: Real-time candidate table displaying student names, branches, portfolios, and application dates.",
        "1-Click State Actions: Presidents can mark applicants as Shortlist, Approve, or Reject with customized interview remarks.",
        "Live Announcement Broadcaster: Publish emergency alerts (e.g. 'Orientation today in Audi-1') appearing on the public card.",
        "Recruitment Status Switch: Toggle recruitment from Open to Closed in one tap when society quotas are fulfilled.",
        "Direct Contact Integration: 1-click WhatsApp or Phone calling to schedule shortlisted candidate interviews."
    ], icon_text="👑", border_color=C_AMBER, text_size=12)
    add_screenshot_frame(s12, 6.6, 2.0, 5.9, 4.8, "Applicants Management Dashboard", "Capture candidate review cards with Shortlist, Approve, and Reject buttons")
    add_footer(s12)

    # ==========================================
    # SLIDE 13: AMAN SINGH - LEADERSHIP HANDOVER + SCREENSHOT
    # ==========================================
    s13 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s13)
    add_header(s13, 13, "Governance", "Phase 9: Safe Leadership Handover & Delegation Engine", "Solving the annual senior graduation succession problem with verified handovers.", "Speaker 3: Aman Singh")
    add_card(s13, 0.8, 2.0, 5.5, 4.8, "Secure Succession Protocol", [
        "Senior Succession Protocol: Outgoing president nominates junior successor by verified college email and phone.",
        "Protected Pending Handover: Club enters a safe pending handover state; outgoing president maintains control until acceptance.",
        "Successor Confirmation Prompt: When the junior logs in, an interactive banner prompts them to Accept or Decline.",
        "Cryptographic Ownership Transfer: Once confirmed, database pointers update instantly and revoke old administrative claims.",
        "Co-Lead Collaboration: Presidents can invite co-leads as collaborators with edit permissions for major campus fests."
    ], icon_text="🤝", border_color=C_PURPLE, text_size=12)
    add_screenshot_frame(s13, 6.6, 2.0, 5.9, 4.8, "Leadership Handover & Succession Modal", "Capture President Transfer nomination card and junior acceptance prompt")
    add_footer(s13)

    # ==========================================
    # SLIDE 14: AKASH GUPTA - FACULTY APPROVALS + SCREENSHOT
    # ==========================================
    s14 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s14)
    add_header(s14, 14, "Faculty Governance", "Phase 10: Faculty Coordinator Authorization Queue", "Mandatory professor approval workflow upholding institutional academic standards.", "Speaker 4: Akash Gupta")
    add_card(s14, 0.8, 2.0, 5.5, 4.8, "Faculty Approval Security Model", [
        "Mandatory Pre-Live State: Newly registered clubs are flagged with status: 'pending', completely hidden from students.",
        "Automated Coordinator Routing: Matches coordinatorEmail directly to the logged-in professor's verified college account.",
        "Dedicated Faculty Queue: When the professor logs in, the Official Professor Approvals Queue appears at the top.",
        "Audit Remarks & Notes: Coordinators provide official review notes (e.g. 'Approved for 2026 Academic Calendar').",
        "1-Click Publish: Tapping 'Authorize & Publish' broadcasts the club live across all student screens in real-time."
    ], icon_text="🏛️", border_color=C_CYAN, text_size=12)
    add_screenshot_frame(s14, 6.6, 2.0, 5.9, 4.8, "Official Professor Approvals Queue", "Capture Professor Authorization Card with Authorize & Publish buttons")
    add_footer(s14)

    # ==========================================
    # SLIDE 15: AKASH GUPTA - MENTOR NOTIFICATIONS + SCREENSHOT
    # ==========================================
    s15 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s15)
    add_header(s15, 15, "Notification Systems", "Phase 11: Multi-Channel Mentor Notification Dispatcher", "Bridging students and professors through instantaneous notification protocols.", "Speaker 4: Akash Gupta")
    add_card(s15, 0.8, 2.0, 5.5, 4.8, "Multi-Channel Dispatcher Channels", [
        "1-Click Gmail Formal Letter: Pre-composes an official letter addressed to the professor with club details and portal link.",
        "WhatsApp Direct Forwarding: Formats a clean WhatsApp markdown message with deep links for rapid faculty review.",
        "Formatted Clipboard Copy: Copies formal authorization request text to paste into official departmental mail threads.",
        "Instant Student Feedback: Gives students immediate confirmation that their proposal has reached their faculty coordinator.",
        "Zero Communication Delay: Eliminates weeks of physical paperwork chasing faculty signatures across departments."
    ], icon_text="📬", border_color=C_GREEN, text_size=12)
    add_screenshot_frame(s15, 6.6, 2.0, 5.9, 4.8, "Faculty Mentor Notification Modal", "Capture 1-Click Gmail, WhatsApp, and Copy Request buttons")
    add_footer(s15)

    # ==========================================
    # SLIDE 16: AKASH GUPTA - CONTACT ACTION SHEET + SCREENSHOT
    # ==========================================
    s16 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s16)
    add_header(s16, 16, "Direct Communication", "Phase 12: Interactive Leader Contact Action Sheet", "Frictionless peer-to-leader connectivity across all preferred communication channels.", "Speaker 4: Akash Gupta")
    add_card(s16, 0.8, 2.0, 5.5, 4.8, "Direct Connectivity Channels", [
        "WhatsApp API Integration: Opens WhatsApp with pre-filled greeting: 'Namaste Leader, connecting via MITS Club Hub'.",
        "Direct Cellular Phone Dialer: Triggers device dialer directly with the leader's 2FA-verified contact number.",
        "College Webmail Dispatcher: Generates formatted inquiry draft in student's default mail client.",
        "Social Media Bridge: Direct links to verified club Instagram handles and orientation highlight reels.",
        "Identity Verification: Displays leader avatar, official society designation, and green 2FA verification badge."
    ], icon_text="💬", border_color=C_PURPLE, text_size=12)
    add_screenshot_frame(s16, 6.6, 2.0, 5.9, 4.8, "Interactive Contact Action Sheet", "Capture WhatsApp, Phone, Email, and Instagram direct trigger buttons")
    add_footer(s16)

    # ==========================================
    # SLIDE 17: USER MANUAL - STUDENT JOURNEY (LARGE SCREENSHOT + STEPS)
    # ==========================================
    s17 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s17)
    add_header(s17, 17, "User Manual", "Operational Manual Part 1: The Student Journey", "Step-by-step student workflow from login to club recruitment submission.", "Operational Walkthrough")
    add_card(s17, 0.8, 2.0, 5.5, 4.8, "Student Walkthrough Steps", [
        "Step 1 - Google OAuth Login: Open portal and tap 'Sign in with Google' using official @mitsgwl.ac.in credentials.",
        "Step 2 - 3D Discovery & Search: Use the 3D Filter Console to filter clubs by category, 100% Free vs Paid, and recruitment status.",
        "Step 3 - Inspect Society Details: Open club to view 'Kya Hai, Kyu Hai, Kaise Join Karein' and photo galleries.",
        "Step 4 - Submit Application: Fill the structured application with portfolio links and role preference before the deadline.",
        "Step 5 - Track Selection Status: Real-time status tracker on 'My Applications' (Pending, Shortlisted, Approved)."
    ], icon_text="🎓", border_color=C_CYAN, text_size=12)
    add_screenshot_frame(s17, 6.6, 2.0, 5.9, 4.8, "Student Portal & Application View", "Drop student directory browsing and application view screenshot here")
    add_footer(s17)

    # ==========================================
    # SLIDE 18: USER MANUAL - PRESIDENT & FACULTY JOURNEY
    # ==========================================
    s18 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s18)
    add_header(s18, 18, "User Manual", "Operational Manual Part 2: President & Faculty Workflow", "Complete administrative guide for Club Presidents and Faculty Coordinators.", "Operational Walkthrough")
    add_card(s18, 0.8, 2.0, 5.5, 4.8, "Leadership & Mentorship Steps", [
        "President - Register Club: Tap '+ Register Club', enter description, photos, and coordinator professor's official email.",
        "President - Mentor Dispatch: Use 1-Click Gmail pre-filled dispatcher to send formal review letter to the mentor.",
        "Faculty - Review & Approve: Professor logs in, opens 'Official Approvals Queue', adds audit remarks, and clicks Authorize.",
        "President - Manage Applicants: Review student candidates, view GitHub/portfolios, and click Shortlist, Approve, or Reject.",
        "President - Live Broadcasts: Post urgent announcements (e.g. room shifts) directly on the live homepage card."
    ], icon_text="👑", border_color=C_AMBER, text_size=12)
    add_screenshot_frame(s18, 6.6, 2.0, 5.9, 4.8, "President & Faculty Dashboards", "Drop President applicants management or Professor approval queue screenshot here")
    add_footer(s18)

    # ==========================================
    # SLIDE 19: PRODUCTION DEPLOYMENT & DEVOPS
    # ==========================================
    s19 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s19)
    add_header(s19, 19, "DevOps & Hosting", "Live Production Infrastructure & Deployment", "Globally distributed, highly available, and verified on modern cloud edge networks.", "Akash Dhakad (Lead Architect)")
    add_card(s19, 0.8, 2.0, 5.5, 4.8, "Production Verification Matrix", [
        "Primary Production Host: mits-gwl-club-hub.netlify.app (Deployed on Netlify Edge CDN).",
        "Automated CI/CD Mirror: akashcyber02.github.io/mits-club-hub (GitHub Actions passing with 100% green status).",
        "Custom Institutional Domain: Configured for mitsgwlclubhub.com with automatic HTTPS SSL encryption.",
        "Performance Benchmarks: 98+ Google Lighthouse score; First Contentful Paint <800ms on mobile.",
        "Zero Build Failures: Lightweight vanilla client architecture runs without Node runtime bloat or server memory crashes.",
        "Localhost Ready: Local test server operational on http://localhost:5500 and port 8080."
    ], icon_text="🚀", border_color=C_GREEN, text_size=12)
    add_screenshot_frame(s19, 6.6, 2.0, 5.9, 4.8, "Live Netlify & GitHub Deployments", "Drop browser screenshot of live website with URL bar or GitHub Actions Green badge")
    add_footer(s19)

    # ==========================================
    # SLIDE 20: CREDITS, ACADEMIC SUPERVISION & Q&A
    # ==========================================
    s20 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s20)
    add_header(s20, 20, "Defense Closing", "Acknowledgments, Project Credits & Live Demo", "Thank you for your guidance, mentorship, and support.", "Full Team (Closing & Q&A)")
    
    add_card(s20, 0.8, 2.0, 5.7, 4.8, "Core Engineering Team", [
        "Akash Dhakad: Lead Architect, Domain RBAC, 2FA Phone SMS, SPA Routing & Cloud Firestore Engine.",
        "Alok Mahor: Club Field Research (10+ Clubs), 3D Filter Console, Showcase Narrative Architecture.",
        "Aman Singh: Recruitment Pipeline, Membership Engine, President Command Center & Handover Protocol.",
        "Akash Gupta: Faculty Approval Queue, Multi-Channel Mentor Notification Dispatcher, Contact Sheet."
    ], icon_text="👨‍💻", border_color=C_CYAN, text_size=12.5)

    add_card(s20, 6.8, 2.0, 5.7, 4.8, "Academic Mentorship & Live Links", [
        "Faculty Guide: Prof. [ ________________________ ]",
        "Head of Department (HOD): Dr. [ ________________________ ]",
        "Department: Department of Artificial Intelligence & Data Science",
        "Institution: Madhav Institute of Technology & Science (MITS), Gwalior",
        "Live Production Portal: https://mits-gwl-club-hub.netlify.app",
        "GitHub Repository: https://github.com/akashcyber02/mits-club-hub",
        "Ready for Questions & Live Interactive Demonstration!"
    ], icon_text="🙏", border_color=C_AMBER, text_size=12.5)
    add_footer(s20)

    prs.save(output_path)
    print(f"Successfully generated 20-slide V2 presentation at: {output_path}")

if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "MITS_Club_Hub_Presentation_V2.pptx"
    build_deck(out)
