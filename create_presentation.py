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

    # Colors
    C_BG = RGBColor(10, 15, 29)         # #0A0F1D Deep Navy
    C_CARD = RGBColor(20, 30, 48)       # #141E30 Card fill
    C_CARD_BORDER = RGBColor(45, 62, 90)# Card border
    C_CYAN = RGBColor(56, 189, 248)     # #38BDF8 Primary
    C_GREEN = RGBColor(16, 185, 129)    # #10B981 Success
    C_AMBER = RGBColor(245, 158, 11)    # #F59E0B Warning
    C_PURPLE = RGBColor(168, 85, 247)   # #A855F7 Purple
    C_ROSE = RGBColor(244, 63, 94)      # #F43F5E Rose
    C_WHITE = RGBColor(255, 255, 255)
    C_TEXT_MUTED = RGBColor(148, 163, 184) # #94A3B8
    C_TEXT_LIGHT = RGBColor(203, 213, 225) # #CBD5E1

    def set_slide_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_BG
        bg.line.fill.background() # no line

    def add_header(slide, slide_num, category, title, subtitle, presenter=""):
        # Category Tag & Presenter Tag
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.733), Inches(0.4))
        tf = tag_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        
        run_cat = p.add_run()
        run_cat.text = f"[{category.upper()}]  "
        run_cat.font.name = "Arial"
        run_cat.font.size = Pt(10)
        run_cat.font.bold = True
        run_cat.font.color.rgb = C_CYAN

        if presenter:
            run_pres = p.add_run()
            run_pres.text = f"🎙️ Presenter: {presenter}"
            run_pres.font.name = "Arial"
            run_pres.font.size = Pt(10)
            run_pres.font.bold = True
            run_pres.font.color.rgb = C_PURPLE

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.733), Inches(0.6))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        tf_title.margin_left = tf_title.margin_top = tf_title.margin_right = tf_title.margin_bottom = 0
        p_t = tf_title.paragraphs[0]
        p_t.text = title
        p_t.font.name = "Arial"
        p_t.font.size = Pt(22)
        p_t.font.bold = True
        p_t.font.color.rgb = C_WHITE

        # Subtitle
        if subtitle:
            sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.35), Inches(11.733), Inches(0.35))
            tf_sub = sub_box.text_frame
            tf_sub.word_wrap = True
            tf_sub.margin_left = tf_sub.margin_top = tf_sub.margin_right = tf_sub.margin_bottom = 0
            p_s = tf_sub.paragraphs[0]
            p_s.text = subtitle
            p_s.font.name = "Arial"
            p_s.font.size = Pt(11)
            p_s.font.color.rgb = C_TEXT_MUTED

        # Slide Number (Top Right)
        num_box = slide.shapes.add_textbox(Inches(10.5), Inches(0.4), Inches(2.0), Inches(0.4))
        tf_num = num_box.text_frame
        tf_num.margin_left = tf_num.margin_top = tf_num.margin_right = tf_num.margin_bottom = 0
        p_n = tf_num.paragraphs[0]
        p_n.alignment = PP_ALIGN.RIGHT
        p_n.text = f"Slide {str(slide_num).zfill(2)} / 20"
        p_n.font.name = "Arial"
        p_n.font.size = Pt(10.5)
        p_n.font.bold = True
        p_n.font.color.rgb = C_TEXT_MUTED

        # Divider line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.75), Inches(11.733), Inches(0.02))
        line.fill.solid()
        line.fill.fore_color.rgb = C_CARD_BORDER
        line.line.fill.background()

    def add_footer(slide):
        foot_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.0), Inches(11.733), Inches(0.3))
        tf = foot_box.text_frame
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = "MITS CLUB HUB • Madhav Institute of Technology & Science, Gwalior (Deemed University) • mitsgwlclubhub.com"
        p.font.name = "Arial"
        p.font.size = Pt(8.5)
        p.font.color.rgb = RGBColor(100, 116, 139)

    def add_card(slide, left, top, width, height, title, points, icon_text="📌", border_color=C_CARD_BORDER, text_size=10.5):
        # Card Background
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = border_color
        card.line.width = Pt(1.5)

        # Title Box
        tb = slide.shapes.add_textbox(Inches(left + 0.25), Inches(top + 0.2), Inches(width - 0.5), Inches(0.45))
        tf = tb.text_frame
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = f"{icon_text}  {title}"
        p.font.name = "Arial"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = C_WHITE

        # Bullets
        bb = slide.shapes.add_textbox(Inches(left + 0.25), Inches(top + 0.7), Inches(width - 0.5), Inches(height - 0.85))
        tf_b = bb.text_frame
        tf_b.word_wrap = True
        tf_b.margin_left = tf_b.margin_top = tf_b.margin_right = tf_b.margin_bottom = 0
        for i, pt in enumerate(points):
            p_pt = tf_b.add_paragraph() if i > 0 else tf_b.paragraphs[0]
            p_pt.space_after = Pt(6)
            
            # Split bold prefix if available (format: "Header: Rest of text")
            if ":" in pt:
                prefix, rest = pt.split(":", 1)
                r1 = p_pt.add_run()
                r1.text = "▹ " + prefix + ":"
                r1.font.bold = True
                r1.font.color.rgb = C_CYAN
                r1.font.size = Pt(text_size)
                
                r2 = p_pt.add_run()
                r2.text = rest
                r2.font.color.rgb = C_TEXT_LIGHT
                r2.font.size = Pt(text_size)
            else:
                r = p_pt.add_run()
                r.text = "▹ " + pt
                r.font.color.rgb = C_TEXT_LIGHT
                r.font.size = Pt(text_size)

    def add_screenshot_box(slide, left, top, width, height, label, tip=""):
        box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        box.fill.solid()
        box.fill.fore_color.rgb = RGBColor(12, 19, 36)
        box.line.color.rgb = C_CYAN
        box.line.width = Pt(1.5)
        box.line.dash_style = 2 # dashed

        tb = slide.shapes.add_textbox(Inches(left + 0.2), Inches(top + (height / 2.0) - 0.45), Inches(width - 0.4), Inches(0.9))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p1 = tf.paragraphs[0]
        p1.alignment = PP_ALIGN.CENTER
        r1 = p1.add_run()
        r1.text = "📸 [ PLACE SCREENSHOT HERE ]\n"
        r1.font.bold = True
        r1.font.size = Pt(11)
        r1.font.color.rgb = C_CYAN

        r2 = p1.add_run()
        r2.text = label + "\n"
        r2.font.bold = True
        r2.font.size = Pt(10)
        r2.font.color.rgb = C_WHITE

        if tip:
            r3 = p1.add_run()
            r3.text = f"({tip})"
            r3.font.size = Pt(8.5)
            r3.font.color.rgb = C_TEXT_MUTED

    # ==========================================
    # SLIDE 1: TITLE SLIDE
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s1)

    # Title Emblem Box
    emblem = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(1.2), Inches(1.2))
    emblem.fill.solid()
    emblem.fill.fore_color.rgb = RGBColor(30, 58, 138)
    emblem.line.color.rgb = C_CYAN
    emblem.line.width = Pt(2)
    tf_emb = emblem.text_frame
    p_emb = tf_emb.paragraphs[0]
    p_emb.text = "MITS"
    p_emb.alignment = PP_ALIGN.CENTER
    p_emb.font.bold = True
    p_emb.font.size = Pt(20)
    p_emb.font.color.rgb = C_WHITE

    # Big Title
    t_box = s1.shapes.add_textbox(Inches(2.2), Inches(0.75), Inches(10.3), Inches(1.3))
    tf_t = t_box.text_frame
    tf_t.word_wrap = True
    p1 = tf_t.paragraphs[0]
    p1.text = "MITS CLUB HUB"
    p1.font.name = "Arial"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = C_WHITE

    p2 = tf_t.add_paragraph()
    p2.text = "The Centralized Digital Ecosystem for Student Clubs, Recruitment Pipelines, 2FA Security & Faculty Approvals"
    p2.font.name = "Arial"
    p2.font.size = Pt(13)
    p2.font.color.rgb = C_CYAN

    # Team Members Card
    add_card(s1, 0.8, 2.3, 7.3, 4.4, "ENGINEERING TEAM (1st Year AI)", [
        "Akash Dhakad (Lead Architect): Core Architecture, @mitsgwl.ac.in Domain RBAC, Firebase Phone 2FA OTP, SPA Routing, Cloud Firestore.",
        "Alok Mahor (Core Contributor): 10+ Club Field Research (Aerospace, Scavengers, Querecia, ISTE), 3D Multi-Filter Console, Showcase UI.",
        "Aman Singh (Core Contributor): Student Recruitment Pipeline, Membership Applications, President Operations Center & Leadership Handover.",
        "Akash Gupta (Core Contributor): Faculty Coordinator Approval Workflow, Multi-Channel Mentor Notification Dispatcher, Contact Sheet."
    ], icon_text="👥", border_color=C_CYAN, text_size=10)

    # Supervision Card
    add_card(s1, 8.4, 2.3, 4.133, 4.4, "ACADEMIC SUPERVISION", [
        "Institution: Madhav Institute of Technology & Science, Gwalior (Deemed University)",
        "Department: Department of Artificial Intelligence & Data Science",
        "Faculty Mentor: Prof. [ ________________________ ]",
        "Designation: Assistant / Associate Professor",
        "Head of Dept (HOD): Dr. [ ________________________ ]",
        "Academic Session: 2026 – 2027",
        "Live Deployment: mits-gwl-club-hub.netlify.app",
        "Custom Domain: mitsgwlclubhub.com"
    ], icon_text="🎓", border_color=C_AMBER, text_size=10)

    add_footer(s1)

    # ==========================================
    # SLIDE 2: PROBLEM STATEMENT
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s2)
    add_header(s2, 2, "Problem & Motivation", "Campus Life Fragmentation vs Centralized Hub", "Why 5,000+ MITSians needed a single authoritative digital home for student activities.", "Joint Introduction")
    add_card(s2, 0.8, 2.0, 5.7, 4.7, "The Traditional Campus Chaos", [
        "Scattered WhatsApp Groups: Vital recruitment deadlines and event posters get buried under thousands of informal group chats.",
        "Unverified Registrations: Any individual could distribute unauthorized Google Forms or solicit club fees without college consent.",
        "Zero Faculty Oversight: Faculty coordinators lacked a dedicated dashboard to audit club rosters, finances, or annual calendars.",
        "Loss of Institutional Legacy: When seniors graduate, club social media handles, archives, and historical records vanish.",
        "High Freshers Friction: First-year students struggle to identify genuine, active clubs aligned with their career ambitions."
    ], icon_text="❌", border_color=C_ROSE, text_size=10.5)

    add_card(s2, 6.8, 2.0, 5.7, 4.7, "The MITS Club Hub Solution", [
        "Strict College Authentication: Mandatory Google OAuth domain-locked strictly to @mitsgwl.ac.in credentials.",
        "Physical 2FA Phone Verification: Real telecom SMS OTP verification protects student leadership contact channels.",
        "Official Professor Approvals Queue: Every student club must receive explicit faculty authorization before going live.",
        "Structured Recruitment Engine: Replaces Google Forms with standardized applications, portfolio links, and countdown timers.",
        "Permanent Digital Archive: Historical leader rosters, high-res achievement galleries, and centralized leadership handover."
    ], icon_text="✅", border_color=C_GREEN, text_size=10.5)
    add_footer(s2)

    # ==========================================
    # SLIDE 3: SYSTEM ARCHITECTURE
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s3)
    add_header(s3, 3, "Architecture & Stack", "Modern Serverless Cloud Architecture", "High performance, zero maintenance, real-time reactive cloud infrastructure.", "Akash Dhakad (Lead Architect)")
    add_card(s3, 0.8, 2.0, 5.7, 4.7, "Full-Stack Technical Foundation", [
        "Frontend Engine: HTML5 Semantic SPA, CSS3 Glassmorphism variables, Vanilla ES2022 JavaScript (Zero heavy framework bloat).",
        "Authentication Layer: Firebase v10 Google OAuth domain-restricted to @mitsgwl.ac.in college accounts.",
        "Real-Time Database: Google Cloud Firestore with real-time WebSocket onSnapshot state synchronizers (<100ms latency).",
        "SMS Telecom Gateway: Firebase Phone Authentication with Invisible Google reCAPTCHA and E.164 routing.",
        "Hosting & Edge CDN: Netlify Global Edge CDN mirrored with automated GitHub Actions CI/CD pipeline.",
        "Security Engine: Cloud Firestore Security Rules validating token claims and preventing unauthorized mutations."
    ], icon_text="⚙️", border_color=C_CYAN, text_size=10)

    add_card(s3, 6.8, 2.0, 5.7, 4.7, "Three-Tier Architectural Flow", [
        "Tier 1 - Presentation Layer: Responsive 3D Glassmorphism UI, Dark/Light theme toggle, SPA hash-router (#club/id, #developer).",
        "Tier 2 - Security & Logic Layer: Domain verification gatekeeper, physical 2FA SMS engine, multi-role RBAC authorization matrix.",
        "Tier 3 - Cloud Data Layer: Cloud Firestore reactive documents, real-time collections (clubs, users, applications).",
        "Edge Infrastructure: Zero cold-start latency; cached assets serve in <800ms across campus mobile devices.",
        "Scalability: Serverless model effortlessly accommodates 5,000+ simultaneous students during college fest registrations."
    ], icon_text="🏛️", border_color=C_PURPLE, text_size=10)
    add_footer(s3)

    # ==========================================
    # SLIDE 4: AKASH DHAKAD - DOMAIN RBAC
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s4)
    add_header(s4, 4, "Security & Auth", "Domain-Restricted Privacy Gatekeeper Screen", "Mandatory authentication restricting portal access strictly to verified MITSians.", "Speaker 1: Akash Dhakad")
    add_card(s4, 0.8, 2.0, 5.7, 4.7, "Enterprise Security Principles", [
        "Zero External Intrusion: Non-college accounts (@gmail.com, @yahoo.com) are automatically terminated with an alert toast.",
        "Institutional Roll Extraction: Student roll numbers (e.g. 26ai1al11) and department codes are parsed automatically upon login.",
        "Dynamic Role-Based Access Control: System automatically categorizes logged-in users into: Student, Club President, or Faculty Coordinator.",
        "Firestore Security Rules: Backend security rules enforce that only authenticated @mitsgwl.ac.in claims can write to database.",
        "Privacy Gatekeeper: Unauthenticated users are completely blocked from viewing student phone numbers or club leader rosters."
    ], icon_text="🛡️", border_color=C_CYAN, text_size=10.5)
    add_screenshot_box(s4, 6.8, 2.0, 5.7, 4.7, "Privacy Login Gatekeeper Screen", "Show Google Login button with @mitsgwl.ac.in restriction badge")
    add_footer(s4)

    # ==========================================
    # SLIDE 5: AKASH DHAKAD - 2FA PHONE SMS
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s5)
    add_header(s5, 5, "Two-Factor Auth", "Real Telecom SMS 2FA Phone Verification", "Physical SIM authentication protecting student leadership and direct contact channels.", "Speaker 1: Akash Dhakad")
    add_card(s5, 0.8, 2.0, 5.7, 4.7, "Engineering Real SMS Delivery", [
        "E.164 Automated Formatter: Converts 10-digit Indian mobile numbers into international telecom standard (+91XXXXXXXXXX).",
        "Invisible Google reCAPTCHA: Silent background verification algorithm blocks bots without annoying captcha puzzles.",
        "Telecom Carrier Dispatch: Leverages Google Cloud routing to deliver real 6-digit SMS OTPs directly to Airtel, Jio, Vi, and BSNL SIMs.",
        "Auto-Recovery Mechanism: Automatically clears reCAPTCHA DOM containers, eliminating 'already rendered' runtime conflicts.",
        "Verified 2FA Leadership Badge: Verified presidents earn an authenticated green badge, boosting parent & student trust."
    ], icon_text="📱", border_color=C_GREEN, text_size=10.5)
    add_screenshot_box(s5, 6.8, 2.0, 5.7, 4.7, "2FA Phone Verification Modal", "Show 6-digit OTP code input, countdown timer, and verified badge")
    add_footer(s5)

    # ==========================================
    # SLIDE 6: AKASH DHAKAD - REALTIME SYNC & SPA
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s6)
    add_header(s6, 6, "Realtime Engine", "Cloud Firestore Realtime Sync & SPA Routing", "Instant multi-device broadcast with zero-reload single-page navigation.", "Speaker 1: Akash Dhakad")
    add_card(s6, 0.8, 2.0, 5.7, 4.7, "Reactive State Architecture", [
        "WebSocket onSnapshot Subscriptions: Live listeners push database updates to client browsers in <100ms.",
        "Hash-Based SPA Routing: Deep linking support for individual clubs (#club/{id}) and developer profiles (#developer).",
        "Multi-Client Live Reflection: When a President publishes an announcement, all online students see the banner immediately.",
        "Zero-Reload Smoothness: Page transitions maintain browser history, back/forward buttons, and smooth scroll restoration.",
        "Offline Cache Resilience: Firestore local persistence provides instant page rendering even on poor campus connections."
    ], icon_text="⚡", border_color=C_PURPLE, text_size=10.5)
    add_screenshot_box(s6, 6.8, 2.0, 5.7, 4.7, "Live Realtime Toast & Dynamic State Sync", "Show instant toast alert and seamless SPA transitions")
    add_footer(s6)

    # ==========================================
    # SLIDE 7: ALOK MAHOR - CLUB RESEARCH
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s7)
    add_header(s7, 7, "Data Taxonomy", "Campus Clubs Research & Categorization Matrix", "Structuring the official student society database into a standardized college ontology.", "Speaker 2: Alok Mahor")
    add_card(s7, 0.8, 2.0, 5.7, 4.7, "Researched Society Ontology", [
        "Technical & Robotics: Aerospace MITS, Team Scavengers (Motorsports Club), AI Club, ISTE MITS Chapter.",
        "Literary & Debate: mits.querecia (Official Literary Society), Hindi Samiti MITS.",
        "Cultural & Music: Bandish MITS (Official Music Society), Dance & Dramatics Society.",
        "Sports & Athletics: MITS.FC (Football Club), Cricket & Badminton Student Cells.",
        "Health & Wellness: Holistic Health Club MITS (Physical and mental wellbeing initiatives).",
        "Institutional Cells: alumnicell.mech_mits (Departmental Alumni Relations & Mentorship)."
    ], icon_text="🗂️", border_color=C_CYAN, text_size=10.5)
    add_screenshot_box(s7, 6.8, 2.0, 5.7, 4.7, "Category Pills & Directory Cards", "Show the 6 category pills and official club cards in directory")
    add_footer(s7)

    # ==========================================
    # SLIDE 8: ALOK MAHOR - 3D FILTER CONSOLE
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s8)
    add_header(s8, 8, "Search & Discovery", "Interactive 3D Multi-Filter Discovery Console", "Multi-dimensional search algorithms enabling instant club discovery in <2 seconds.", "Speaker 2: Alok Mahor")
    add_card(s8, 0.8, 2.0, 5.7, 4.7, "Multi-Dimensional Search Features", [
        "Real-Time Keyword Search: Evaluates club names, taglines, keywords, and president names concurrently as you type.",
        "Category Pills Navigation: 1-click filtering across All, Technical, Cultural, Sports, Social, Literary, and Innovation.",
        "Recruitment Status Filter: Instantly isolates clubs currently hiring new members (Recruitment Open vs Closed).",
        "Financial Transparency Filter: Instant sorting between 100% Free Clubs and Paid Membership clubs with clear fee tags.",
        "Reset & Clear Console: Dedicated one-tap reset button restores full directory view immediately."
    ], icon_text="🔍", border_color=C_GREEN, text_size=10.5)
    add_screenshot_box(s8, 6.8, 2.0, 5.7, 4.7, "3D Filter Console & Search Bar", "Show search input, category chips, and dropdown filters in action")
    add_footer(s8)

    # ==========================================
    # SLIDE 9: ALOK MAHOR - CLUB SHOWCASE
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s9)
    add_header(s9, 9, "User Experience", "Dedicated Single Page Club Breakdown Showcase", "'Kya Hai, Kyu Hai, Kaise Join Karein' structured narrative for every student society.", "Speaker 2: Alok Mahor")
    add_card(s9, 0.8, 2.0, 5.7, 4.7, "Deep Club Narrative Architecture", [
        "'Kya Hai' (About the Club): Society mission statement, founding vision, and regular weekly/monthly activities.",
        "'Kyu Hai' (Why Join): Practical benefits, skill development, peer networking, event exposure, and official certificates.",
        "'Kaise Join Karein' (How to Join): Registration requirements, timeline, fee breakdown, and 1-click apply trigger.",
        "Interactive 3D Lightbox Gallery: High-resolution photo gallery showcasing past orientations, fests, and competitions.",
        "Complete Leadership Roster: Profiles for President, Vice President, Tech Lead, Media Lead, and PR Coordinator."
    ], icon_text="📖", border_color=C_PURPLE, text_size=10.5)
    add_screenshot_box(s9, 6.8, 2.0, 5.7, 4.7, "Dedicated Club Breakdown View", "Show the hero cover banner, 'Kya Hai / Kyu Hai' sections, and gallery")
    add_footer(s9)

    # ==========================================
    # SLIDE 10: AMAN SINGH - RECRUITMENT PIPELINE
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s10)
    add_header(s10, 10, "Recruitment Engine", "Student Membership & Recruitment Engine", "Structured recruitment pipelines replacing unorganized Google Forms across campus.", "Speaker 3: Aman Singh")
    add_card(s10, 0.8, 2.0, 5.7, 4.7, "Structured Application Pipeline", [
        "Standardized Application Modal: Gathers student roll number, year, branch, role preference, and statement of interest.",
        "Portfolio & Profile Links: Dedicated fields for GitHub repositories, LinkedIn profiles, and design portfolios.",
        "Deadline Countdown Badges: Real-time visual pills highlighting '3 Days Left' or 'Deadline Today' to drive applicant action.",
        "Duplicate Prevention: Security rules prevent students from spamming multiple applications to the same club.",
        "'My Applications' Dashboard: Students track application state (Pending, Shortlisted, Approved) live on their personal page."
    ], icon_text="📝", border_color=C_CYAN, text_size=10.5)
    add_screenshot_box(s10, 6.8, 2.0, 5.7, 4.7, "Club Application Form & Countdown", "Show application form modal with countdown badge and portfolio inputs")
    add_footer(s10)

    # ==========================================
    # SLIDE 11: AMAN SINGH - PRESIDENT OPERATIONS
    # ==========================================
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s11)
    add_header(s11, 11, "Leadership Portal", "President Operations & Review Command Center", "A comprehensive administrative workstation for club presidents and core committees.", "Speaker 3: Aman Singh")
    add_card(s11, 0.8, 2.0, 5.7, 4.7, "Presidential Administrative Controls", [
        "Live Applicant Roster: Real-time candidate table displaying student names, branches, portfolios, and application dates.",
        "1-Click State Actions: Presidents can mark applicants as Shortlist, Approve, or Reject with customized interview remarks.",
        "Live Announcement Broadcaster: Publish emergency alerts (e.g. 'Orientation today in Audi-1') appearing on the public card.",
        "Recruitment Status Switch: Toggle recruitment from Open to Closed in one tap when society quotas are fulfilled.",
        "Direct Contact Integration: 1-click WhatsApp or Phone calling to schedule shortlisted candidate interviews."
    ], icon_text="👑", border_color=C_AMBER, text_size=10.5)
    add_screenshot_box(s11, 6.8, 2.0, 5.7, 4.7, "Applicants Management Dashboard", "Show candidate cards with Shortlist, Approve, and Reject action buttons")
    add_footer(s11)

    # ==========================================
    # SLIDE 12: AMAN SINGH - LEADERSHIP HANDOVER
    # ==========================================
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s12)
    add_header(s12, 12, "Governance", "Safe Leadership Handover & Delegation Engine", "Solving the annual senior graduation succession problem with verified handovers.", "Speaker 3: Aman Singh")
    add_card(s12, 0.8, 2.0, 5.7, 4.7, "Secure Succession Protocol", [
        "Senior Succession Protocol: Outgoing president nominates junior successor by verified college email and phone.",
        "Protected Pending Handover: Club enters a safe pending handover state; outgoing president maintains control until acceptance.",
        "Successor Confirmation Prompt: When the junior logs in, an interactive banner prompts them to Accept or Decline.",
        "Cryptographic Ownership Transfer: Once confirmed, database pointers update instantly and revoke old administrative claims.",
        "Co-Lead Collaboration: Presidents can invite co-leads as collaborators with edit permissions for major campus fests."
    ], icon_text="🤝", border_color=C_PURPLE, text_size=10.5)
    add_screenshot_box(s12, 6.8, 2.0, 5.7, 4.7, "Leadership Handover & Succession Modal", "Show President Transfer nomination form and junior acceptance prompt")
    add_footer(s12)

    # ==========================================
    # SLIDE 13: AKASH GUPTA - FACULTY APPROVALS
    # ==========================================
    s13 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s13)
    add_header(s13, 13, "Faculty Governance", "Faculty Coordinator Authorization Queue", "Mandatory professor approval workflow upholding institutional academic standards.", "Speaker 4: Akash Gupta")
    add_card(s13, 0.8, 2.0, 5.7, 4.7, "Faculty Approval Security Model", [
        "Mandatory Pre-Live State: Newly registered clubs are flagged with status: 'pending', completely hidden from students.",
        "Automated Coordinator Routing: Matches coordinatorEmail directly to the logged-in professor's verified college account.",
        "Dedicated Faculty Queue: When the professor logs in, the Official Professor Approvals Queue appears at the top.",
        "Audit Remarks & Notes: Coordinators provide official review notes (e.g. 'Approved for 2026 Academic Calendar').",
        "1-Click Publish: Tapping 'Authorize & Publish' broadcasts the club live across all student screens in real-time."
    ], icon_text="🏛️", border_color=C_CYAN, text_size=10.5)
    add_screenshot_box(s13, 6.8, 2.0, 5.7, 4.7, "Official Professor Approvals Queue", "Show Professor Authorization Card with Authorize & Publish buttons")
    add_footer(s13)

    # ==========================================
    # SLIDE 14: AKASH GUPTA - MENTOR NOTIFICATIONS
    # ==========================================
    s14 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s14)
    add_header(s14, 14, "Notification Systems", "Multi-Channel Mentor Notification Dispatcher", "Bridging students and professors through instantaneous notification protocols.", "Speaker 4: Akash Gupta")
    add_card(s14, 0.8, 2.0, 5.7, 4.7, "Multi-Channel Dispatcher Channels", [
        "1-Click Gmail Formal Letter: Pre-composes an official letter addressed to the professor with club details and portal link.",
        "WhatsApp Direct Forwarding: Formats a clean WhatsApp markdown message with deep links for rapid faculty review.",
        "Formatted Clipboard Copy: Copies formal authorization request text to paste into official departmental mail threads.",
        "Instant Student Feedback: Gives students immediate confirmation that their proposal has reached their faculty coordinator.",
        "Zero Communication Delay: Eliminates weeks of physical paperwork chasing faculty signatures across departments."
    ], icon_text="📬", border_color=C_GREEN, text_size=10.5)
    add_screenshot_box(s14, 6.8, 2.0, 5.7, 4.7, "Faculty Mentor Notification Modal", "Show 1-Click Gmail, WhatsApp, and Copy Request buttons")
    add_footer(s14)

    # ==========================================
    # SLIDE 15: AKASH GUPTA - CONTACT ACTION SHEET
    # ==========================================
    s15 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s15)
    add_header(s15, 15, "Direct Communication", "Interactive Leader Contact Action Sheet", "Frictionless peer-to-leader connectivity across all preferred communication channels.", "Speaker 4: Akash Gupta")
    add_card(s15, 0.8, 2.0, 5.7, 4.7, "Direct Connectivity Channels", [
        "WhatsApp API Integration: Opens WhatsApp with pre-filled greeting: 'Namaste Leader, connecting via MITS Club Hub'.",
        "Direct Cellular Phone Dialer: Triggers device dialer directly with the leader's 2FA-verified contact number.",
        "College Webmail Dispatcher: Generates formatted inquiry draft in student's default mail client.",
        "Social Media Bridge: Direct links to verified club Instagram handles and orientation highlight reels.",
        "Identity Verification: Displays leader avatar, official society designation, and green 2FA verification badge."
    ], icon_text="💬", border_color=C_PURPLE, text_size=10.5)
    add_screenshot_box(s15, 6.8, 2.0, 5.7, 4.7, "Interactive Contact Action Sheet", "Show WhatsApp, Phone, Email, and Instagram direct trigger buttons")
    add_footer(s15)

    # ==========================================
    # SLIDE 16: END-TO-END WORKFLOW
    # ==========================================
    s16 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s16)
    add_header(s16, 16, "System Data Flow", "Complete End-to-End Club Lifecycle Workflow", "From initial student registration through faculty authorization and member enrollment.", "Joint Technical Walkthrough")
    add_card(s16, 0.8, 2.0, 2.7, 4.7, "Phase 1: Registration", [
        "President logs in via @mitsgwl.ac.in.",
        "Fills society name, category, fee, and photos.",
        "Assigns designated Coordinator Professor email.",
        "Submits proposal to Firestore."
    ], icon_text="1️⃣", border_color=C_CYAN, text_size=9.5)

    add_card(s16, 3.8, 2.0, 2.7, 4.7, "Phase 2: Notification", [
        "Club saved as 'pending'.",
        "Notification Action Sheet opens.",
        "President sends 1-Click Gmail letter to Professor.",
        "Professor notified with direct login link."
    ], icon_text="2️⃣", border_color=C_AMBER, text_size=9.5)

    add_card(s16, 6.8, 2.0, 2.7, 4.7, "Phase 3: Authorization", [
        "Professor signs in with college email.",
        "Reviews proposal on Approvals Queue.",
        "Adds official feedback remarks.",
        "Clicks 'Authorize & Publish' (Club live!)."
    ], icon_text="3️⃣", border_color=C_GREEN, text_size=9.5)

    add_card(s16, 9.8, 2.0, 2.7, 4.7, "Phase 4: Recruitment", [
        "Club published to 5,000+ students.",
        "Students explore & submit applications.",
        "President shortlists candidates on dashboard.",
        "Direct interview scheduling via WhatsApp."
    ], icon_text="4️⃣", border_color=C_PURPLE, text_size=9.5)
    add_footer(s16)

    # ==========================================
    # SLIDE 17: USER MANUAL
    # ==========================================
    s17 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s17)
    add_header(s17, 17, "User Manual", "Three-Tier User Operational Manual", "Clear operational instructions for Students, Club Leaders, and Faculty Mentors.", "Operational Walkthrough")
    add_card(s17, 0.8, 2.0, 3.7, 4.7, "For MITS Students", [
        "Step 1: Sign in with your @mitsgwl.ac.in Google email address.",
        "Step 2: Browse clubs using category pills, search keywords, or fee filters.",
        "Step 3: Open any club to inspect 'Kya Hai, Kyu Hai, Kaise Join Karein'.",
        "Step 4: Tap 'Apply Now' to submit your details and portfolio links.",
        "Step 5: Track your selection status under 'My Applications'."
    ], icon_text="🎓", border_color=C_CYAN, text_size=10)

    add_card(s17, 4.8, 2.0, 3.7, 4.7, "For Club Presidents", [
        "Step 1: Tap '+ Register Official Club' and upload cover & gallery photos.",
        "Step 2: Enter designated Coordinator Professor's official email.",
        "Step 3: Dispatch 1-Click Gmail review letter to your faculty mentor.",
        "Step 4: Once approved, manage applicants under 'Manage Applicants'.",
        "Step 5: Broadcast live campus alerts using the announcement editor."
    ], icon_text="👑", border_color=C_AMBER, text_size=10)

    add_card(s17, 8.8, 2.0, 3.7, 4.7, "For Faculty Mentors", [
        "Step 1: Sign in with your official @mitsgwl.ac.in credentials.",
        "Step 2: The 'Official Professor Approvals Queue' will highlight pending clubs.",
        "Step 3: Audit club description, leadership contact, and proposed fee.",
        "Step 4: Add official review remarks.",
        "Step 5: Click 'Authorize & Publish' to instantly launch the club."
    ], icon_text="🏛️", border_color=C_PURPLE, text_size=10)
    add_footer(s17)

    # ==========================================
    # SLIDE 18: DEPLOYMENT & DEVOPS
    # ==========================================
    s18 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s18)
    add_header(s18, 18, "DevOps & Hosting", "Live Production Infrastructure & Deployment", "Globally distributed, highly available, and verified on modern cloud edge networks.", "Akash Dhakad (Lead Architect)")
    add_card(s18, 0.8, 2.0, 5.7, 4.7, "Production Verification Matrix", [
        "Primary Production Host: mits-gwl-club-hub.netlify.app (Deployed on Netlify Edge CDN).",
        "Automated CI/CD Mirror: akashcyber02.github.io/mits-club-hub (GitHub Actions passing with 100% green status).",
        "Custom Institutional Domain: Configured for mitsgwlclubhub.com with automatic HTTPS SSL encryption.",
        "Performance Benchmarks: 98+ Google Lighthouse score; First Contentful Paint <800ms on mobile.",
        "Zero Build Failures: Lightweight vanilla client architecture runs without Node runtime bloat or server memory crashes.",
        "Localhost Ready: Local test server operational on http://localhost:5500 and port 8080."
    ], icon_text="🚀", border_color=C_GREEN, text_size=10)
    add_screenshot_box(s18, 6.8, 2.0, 5.7, 4.7, "Netlify & GitHub Actions Live Status", "Show the live production URL and GitHub Actions Green build status")
    add_footer(s18)

    # ==========================================
    # SLIDE 19: FUTURE SCOPE
    # ==========================================
    s19 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s19)
    add_header(s19, 19, "Strategic Roadmap", "Future Expansion & Institutional Impact", "Scaling MITS Club Hub to support accreditation, event ticketing, and inter-college summits.", "Strategic Vision")
    add_card(s19, 0.8, 2.0, 3.7, 4.7, "QR Event Attendance", [
        "Phase 2 Feature: Dynamic QR check-in scanner for club orientations and hackathons.",
        "Attendance Logging: Records verified student roll numbers directly into Firestore.",
        "Certificate Issuance: Automated digital participation certificates for verified attendees."
    ], icon_text="📱", border_color=C_CYAN, text_size=10.5)

    add_card(s19, 4.8, 2.0, 3.7, 4.7, "NAAC / NIRF Reporting", [
        "Institutional Utility: 1-click automated PDF export for college administration.",
        "Audit Metrics: Summarizes active student participation, event counts, and faculty mentorship.",
        "Compliance: Aligns with NAAC Criteria 5 (Student Support & Progression)."
    ], icon_text="📊", border_color=C_PURPLE, text_size=10.5)

    add_card(s19, 8.8, 2.0, 3.7, 4.7, "Integrated Event Ticketing", [
        "Campus Commerce: UPI QR payment verification for paid college fest passes and merchandise.",
        "Cryptographic Tickets: Digital QR entry tickets prevent ticket duplication.",
        "Financial Auditing: Real-time collection reports visible to faculty coordinators."
    ], icon_text="🎟️", border_color=C_GREEN, text_size=10.5)
    add_footer(s19)

    # ==========================================
    # SLIDE 20: CREDITS & Q&A
    # ==========================================
    s20 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s20)
    add_header(s20, 20, "Defense Closing", "Acknowledgments, Project Credits & Live Demo", "Thank you for your guidance, mentorship, and support.", "Full Team (Closing & Q&A)")
    
    add_card(s20, 0.8, 2.0, 5.7, 4.7, "Core Engineering Team", [
        "Akash Dhakad: Lead Architect, Domain RBAC, 2FA Phone SMS, SPA Routing & Cloud Firestore Engine.",
        "Alok Mahor: Club Field Research (10+ Clubs), 3D Filter Console, Showcase Narrative Architecture.",
        "Aman Singh: Recruitment Pipeline, Membership Engine, President Command Center & Handover Protocol.",
        "Akash Gupta: Faculty Approval Queue, Multi-Channel Mentor Notification Dispatcher, Contact Sheet."
    ], icon_text="👨‍💻", border_color=C_CYAN, text_size=10.5)

    add_card(s20, 6.8, 2.0, 5.7, 4.7, "Academic Mentorship & Live Links", [
        "Faculty Guide: Prof. [ ________________________ ]",
        "Head of Department (HOD): Dr. [ ________________________ ]",
        "Department: Department of Artificial Intelligence & Data Science",
        "Institution: Madhav Institute of Technology & Science (MITS), Gwalior",
        "Live Production Portal: https://mits-gwl-club-hub.netlify.app",
        "GitHub Repository: https://github.com/akashcyber02/mits-club-hub",
        "Ready for Questions & Live Interactive Demonstration!"
    ], icon_text="🙏", border_color=C_AMBER, text_size=10.5)
    add_footer(s20)

    prs.save(output_path)
    print(f"Successfully generated 20-slide presentation at: {output_path}")

if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "MITS_Club_Hub_Presentation.pptx"
    build_deck(out)
