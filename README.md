# 🏛️ MITS Club Hub — Centralized Campus Life Platform

> One unified portal for all official clubs of **Madhav Institute of Technology & Science (MITS), Gwalior**. Domain-restricted Google Auth (`@mitsgwl.ac.in`), multi-tier Faculty Coordinator approval workflow, real-time President club management, and live student discovery — all powered by Firebase.

[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%2B%20Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)]()
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)]()
[![Netlify](https://img.shields.io/badge/Deployed-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 🚀 Live Features

### 🔐 1. Domain-Restricted Google Authentication
- Only `@mitsgwl.ac.in` college email accounts can submit or manage clubs
- Non-college Google accounts are automatically blocked at the Auth level
- Validates email domain using Firebase ID token claims in Firestore Security Rules

### 👑 2. Role-Based Access Control (RBAC)

| Role | Capabilities |
|---|---|
| 🎓 **Student** | Browse approved clubs, search by tech/category, filter by fee & recruitment status, join WhatsApp groups, apply for membership |
| 👨‍🏫 **Faculty In-Charge** | Real-time **Approval Panel** — review mission statements, attach remarks, authorize or reject clubs in one click |
| 👑 **Club President** | **President Control Panel** — update taglines, descriptions, announcements, recruitment status, contact info in real time |

### ⚡ 3. Real-Time Cloud Firestore Engine
- Firebase `onSnapshot` listeners for live updates — no page reload ever needed
- Club approvals, announcements, and status changes broadcast instantly to all connected clients
- Production-grade Firestore Security Rules in `firestore.rules`

### 🔍 4. Multi-Level Search & Filter
- Search by club name, tags, or description (live as you type)
- Category filter: Technical, Cultural & Arts, Sports, Social & NSS, Literary & Media, E-Cell & Innovation
- Fee filter: Free / Paid
- Recruitment filter: Open / Closed

### 🌱 5. One-Click Demo Seeder
- Seeds realistic MITS clubs (GDSC MITS, Club Decimal, Chhavi Cultural Society, Robotics Lab, E-Cell, NSS) for demos and local testing

---

## 🔒 Firestore Security Rules

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
      // Only approved clubs visible publicly; coordinators/presidents see their own
      allow read: if resource.data.status == "approved"
                  || (isAuthenticated() && (
                      request.auth.token.email == resource.data.coordinatorEmail ||
                      request.auth.token.email == resource.data.presidentEmail ||
                      request.auth.token.email == resource.data.createdBy
                  ));
      // Only college emails can create clubs; must start in "pending" state
      allow create: if isCollegeEmail()
                    && request.resource.data.status == "pending"
                    && request.resource.data.createdBy == request.auth.token.email;
      // Only coordinators or presidents can update
      allow update: if isAuthenticated() && (
        request.auth.token.email == resource.data.coordinatorEmail ||
        request.auth.token.email == resource.data.presidentEmail
      );
      // Only coordinators can delete
      allow delete: if isAuthenticated() && request.auth.token.email == resource.data.coordinatorEmail;
    }
  }
}
```

---

## 📁 Project Architecture

```
mits-club-hub/
├── index.html              # Semantic HTML5: Hero, Nav, Club Cards, Approval Panel, Modals
├── style.css               # Modern CSS3: Grid, Flexbox, Animations, Toast UI, Dark theme
├── app.js                  # Core: Firebase Auth, Firestore real-time queries, RBAC, Modals
├── firebase-config.js      # Firebase project config (replace with your own project)
├── firestore.rules         # Production Firestore RBAC Security Rules
├── netlify.toml            # Netlify SPA redirect config
├── _redirects              # Netlify routing for client-side navigation
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Auth** | Firebase Authentication (Google OAuth) |
| **Database** | Cloud Firestore (NoSQL, real-time) |
| **Security** | Firestore Security Rules (RBAC) |
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| **Deployment** | Netlify (with `_redirects` for SPA routing) |
| **Real-time** | Firebase `onSnapshot` listeners |

---

## 🏃 How to Run Locally

### Option A — Zero Setup (Fastest)
```bash
git clone https://github.com/akashcyber02/mits-club-hub.git
cd mits-club-hub
# Open index.html with VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

### Option B — Use Your Own Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com) → Create a new project
2. Enable **Authentication** → Sign-in method → **Google**
3. Create **Cloud Firestore** database (start in test mode)
4. Click the `</>` Web icon → copy the config object
5. Replace the config in `firebase-config.js` with your values
6. Deploy `firestore.rules` to your project:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules
   ```

> ⚠️ **Note**: The login flow requires `@mitsgwl.ac.in` Google accounts. Use the **Demo Seeder** button on the page to populate clubs without authentication for local testing.

---

## 👥 Team (Team of 4)

| Member | Role | Contributions |
|---|---|---|
| **Akash Dhakad (Lead)** | Architecture & Security | Firebase Auth, RBAC, Firestore Rules, Professor Approval Workflow |
| Team Member 2 | Frontend & UI/UX | Responsive design, Hero section, category pills, dark theme, toast notifications |
| Team Member 3 | Club Discovery | Real-time search, multi-criteria filter, Club detail modal, WhatsApp/Instagram links |
| Team Member 4 | Student Engagement | Membership application form, recruitment toggles, club announcement feed |

---

## 🎤 Key Design Decisions

**Q: Why domain-restricted Auth instead of a simple login form?**
> Firebase Google OAuth with domain restriction is both more secure and frictionless — no passwords to manage, and the `@mitsgwl.ac.in` restriction is enforced at the token level, not just the UI.

**Q: Why Firestore instead of a traditional SQL database?**
> `onSnapshot` real-time listeners give the app a live collaboration feel with zero polling. When a professor approves a club, every student sees it instantly without refreshing.

**Q: Why Vanilla JS instead of React?**
> For a project-viva demo, keeping zero build steps (just open `index.html`) meant every evaluator could run it instantly.

---

## 👨‍💻 Author

**Akash Dhakad**
- GitHub: [@akashcyber02](https://github.com/akashcyber02)

---

## 📄 License

This project is open source under the [MIT License](LICENSE).
