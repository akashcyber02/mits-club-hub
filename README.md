# 🏛️ MITS Club Hub — Centralized Campus Life Platform

> One unified portal for all official clubs of **Madhav Institute of Technology & Science (MITS), Gwalior**. Featuring `@mitsgwl.ac.in` domain-restricted Google Auth, multi-tier Faculty Coordinator approval, dynamic President club management, and real-time student discovery.

---

## 🚀 Live Features

1. **🔐 Domain-Restricted Google Authentication:**
   - Only official college emails ending with `@mitsgwl.ac.in` can access creation and admin features.
   - Non-college emails are blocked automatically at the Auth level.

2. **👑 Role-Based Access Control (RBAC):**
   - **🎓 Students:** Explore approved clubs, search by technology/category, filter by fee/recruitment, join official WhatsApp groups, apply for membership.
   - **👨‍🏫 Faculty In-Charge / Mentors:** Dedicated real-time **Approval Panel** to review pending club applications, read mission statements, attach review notes/remarks, and authorize/reject in one click.
   - **👑 Club Presidents:** Real-time **President Control Access** to update club taglines, descriptions, latest notices/announcements, recruitment status, and contact info.

3. **⚡ Real-Time Cloud Firestore Engine:**
   - Powered by Firebase `onSnapshot` listeners — all status changes, new announcements, and club approvals reflect live on screen without page reloads.

4. **🔍 Multi-Level Search & Filter:**
   - Search by name, tags, or description.
   - Category filtering (Technical, Cultural & Arts, Sports, Social & NSS, Literary & Media, E-Cell & Innovation).
   - Filter by Fee status (Free / Paid) and Recruitment status (Open / Closed).

5. **✨ One-Click Demo Seeder:**
   - Built-in button to populate realistic MITS clubs (GDSC MITS, Club Decimal, Chhavi Cultural Society, Robotics Lab, E-Cell, NSS) for viva presentation & local testing.

---

## 👥 Team & Role Distribution (Team of 4)

| Team Member | Role | Key Contributions |
| :--- | :--- | :--- |
| **Akash Dhakad (Lead)** | **Core Architecture & Security Lead** | Firebase Auth (`@mitsgwl.ac.in`), Role-Based Access Control (RBAC), Firestore Security Rules (`firestore.rules`), Professor Approval Workflow & State Listeners. |
| **Team Member 2** | **Frontend & UI/UX Specialist** | Responsive MITS collegiate design, Hero Section, Category navigation pills, Dark/Navy theme & Toast notifications. |
| **Team Member 3** | **Club Discovery & Exploration** | Real-time Search Engine, Multi-criteria filter, Detailed Club Modal & WhatsApp/Instagram integration. |
| **Team Member 4** | **Student Engagement & Recruitment** | Quick Membership Application Form, Recruitment status toggles, Club Announcement / Notice feed. |

---

## 📁 Project Architecture

```
mits-club-hub/
├── index.html          # Semantic HTML5 layout (Hero, Nav, Approval Panel, Modals)
├── style.css           # Modern CSS3 with CSS Grid, Flexbox, Animations & Toast UI
├── app.js              # Core logic: Auth, Firestore real-time queries, RBAC, Modals
├── firebase-config.js  # Firebase project credentials & allowed domain
├── firestore.rules     # Production-grade Firestore RBAC Security Rules
└── README.md           # Documentation & Viva Reference Guide
```

---

## 🔒 Firestore Security Rules (`firestore.rules`)

```javascript
rules_version = "2";
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isCollegeEmail() {
      return isAuthenticated() && request.auth.token.email.matches(".*@mitsgwl[.]ac[.]in$");
    }

    match /clubs/{clubId} {
      allow read: if resource.data.status == "approved" 
                  || (isAuthenticated() && (
                      request.auth.token.email == resource.data.coordinatorEmail ||
                      request.auth.token.email == resource.data.presidentEmail ||
                      request.auth.token.email == resource.data.createdBy
                  ));

      allow create: if isCollegeEmail() 
                    && request.resource.data.status == "pending"
                    && request.resource.data.createdBy == request.auth.token.email;

      allow update: if isAuthenticated() && (
        request.auth.token.email == resource.data.coordinatorEmail ||
        request.auth.token.email == resource.data.presidentEmail
      );

      allow delete: if isAuthenticated() && request.auth.token.email == resource.data.coordinatorEmail;
    }
  }
}
```

---

## 🎤 Viva & Presentation Talking Points

> **Q: How is security handled for college users?**  
> *"We implemented domain-restricted OAuth via Firebase Authentication where any non-`@mitsgwl.ac.in` domain is rejected. Furthermore, Cloud Firestore rules validate token email claims to enforce that only verified college users can submit clubs."*

> **Q: How does the Professor Approval workflow operate?**  
> *"When a student registers a club, it is created with a `pending` status and linked to the chosen coordinator professor email. When that professor logs in, a real-time Firestore query populates their Approval Queue. Once approved with optional feedback remarks, the club state becomes `approved` and is broadcast instantly across all connected clients via `onSnapshot`."*

---

## 🛠️ How to Run Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/akashcyber02/mits-club-hub.git
   ```
2. Open `index.html` with **Live Server** in VS Code (or double-click to open in browser).
3. Log in with your `@mitsgwl.ac.in` Google account or test using the sample data loader!