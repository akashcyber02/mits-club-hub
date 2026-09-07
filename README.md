# MITS Club Hub

One website where all MITS clubs live — with @mitsgwl.ac.in-only login,
professor approval for new clubs, and president-editable club profiles.

## Files
- `index.html` — page structure (navbar, club grid, forms)
- `style.css` — all styling
- `firebase-config.js` — your Firebase keys go here
- `app.js` — all logic (login, create club, approve, edit)

## Setup (one person does this once, then shares the config)

1. Go to https://console.firebase.google.com → **Add project** → name it `mits-club-hub`.
2. Inside the project, click the **Web (`</>`)** icon → register app → copy the
   `firebaseConfig` object it gives you → paste it into `firebase-config.js`.
3. **Authentication** tab → Sign-in method → enable **Google**.
4. **Firestore Database** tab → Create database → start in **test mode**
   (fine for college project; switch to real rules later — see below).
5. Open `index.html` in a browser (or use the VS Code "Live Server" extension)
   to test locally. No `npm install` needed — everything loads from Firebase's CDN.

## Firestore Security Rules (paste into Firestore > Rules before final submission)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /clubs/{clubId} {
      allow read: if true;
      allow create: if request.auth != null
                    && request.auth.token.email.matches('.*@mitsgwl[.]ac[.]in$');
      allow update: if request.auth != null
                    && (request.auth.token.email == resource.data.presidentEmail
                        || request.auth.token.email == resource.data.coordinatorEmail);
    }
  }
}
```

This makes sure: anyone can *view* clubs, only `@mitsgwl.ac.in` users can *create*
a club, and only the club's president or its coordinator professor can *edit/approve* it.

## How data flows (for your viva)

1. Student logs in with Google → app checks the email ends with `@mitsgwl.ac.in`,
   otherwise it signs them straight back out.
2. Student clicks **+ New Club** → fills a form → it's saved in Firestore with
   `status: "pending"`.
3. The **coordinator professor** (email chosen in the form) logs in → sees
   an "Approval Panel" listing only their pending clubs → clicks Approve/Reject.
4. Once `status` becomes `"approved"`, the club shows up for everyone on the
   home page — this happens live, no refresh needed, because of Firestore's
   `onSnapshot()` real-time listener.
5. The club's **president** (matched by email) sees an **Edit** button on their
   own club card and can update details anytime.

## One-line explanation to say in viva

> "We used Firebase Authentication restricted to college emails, and Firestore
> as a real-time database. New clubs start as 'pending' and only go live after
> their coordinator professor approves them — and only the club president's
> email can edit that club afterward."
