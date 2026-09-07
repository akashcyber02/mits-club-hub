/* =========================================================
   MITS CLUB HUB — app.js
   Handles: Login (college email only), showing clubs,
   creating a new club (goes to "pending"), professor
   approval, and president edit access.
   ========================================================= */

// ---------- DOM shortcuts ----------
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userBox = document.getElementById("userBox");
const userEmailEl = document.getElementById("userEmail");
const addClubBtn = document.getElementById("addClubBtn");

const clubGrid = document.getElementById("clubGrid");
const approvalPanel = document.getElementById("approvalPanel");
const pendingList = document.getElementById("pendingList");

const createClubModal = document.getElementById("createClubModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const createClubForm = document.getElementById("createClubForm");
const feeType = document.getElementById("feeType");
const feeAmount = document.getElementById("feeAmount");

const editClubModal = document.getElementById("editClubModal");
const closeEditModalBtn = document.getElementById("closeEditModalBtn");
const editClubForm = document.getElementById("editClubForm");

let currentUser = null; // Firebase user object once logged in

/* =========================================================
   1. LOGIN / LOGOUT  (restricted to @mitsgwl.ac.in)
   ========================================================= */

loginBtn.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch((err) => {
    alert("Login failed: " + err.message);
  });
});

logoutBtn.addEventListener("click", () => {
  auth.signOut();
});

auth.onAuthStateChanged((user) => {
  if (user && user.email && user.email.endsWith(ALLOWED_DOMAIN)) {
    // Valid MITS email — allow in
    currentUser = user;
    loginBtn.classList.add("hidden");
    userBox.classList.remove("hidden");
    userEmailEl.textContent = user.email;

    loadClubs();
    loadPendingApprovals();
  } else if (user) {
    // Logged in but NOT a mitsgwl.ac.in email — reject
    alert("Only @mitsgwl.ac.in emails are allowed to log in.");
    auth.signOut();
  } else {
    // Logged out
    currentUser = null;
    loginBtn.classList.remove("hidden");
    userBox.classList.add("hidden");
    approvalPanel.classList.add("hidden");
    loadClubs(); // still show approved clubs to logged-out visitors
  }
});

/* =========================================================
   2. LOAD & RENDER APPROVED CLUBS (visible to everyone)
   ========================================================= */

function loadClubs() {
  db.collection("clubs")
    .where("status", "==", "approved")
    .onSnapshot((snapshot) => {
      clubGrid.innerHTML = "";
      snapshot.forEach((doc) => {
        renderClubCard(doc.id, doc.data());
      });
    });
}

function renderClubCard(id, club) {
  const card = document.createElement("div");
  card.className = "club-card";

  const isPresident = currentUser && currentUser.email === club.presidentEmail;

  card.innerHTML = `
    <span class="tag">${club.feeType === "paid" ? "₹" + club.feeAmount : "FREE"}</span>
    ${isPresident ? `<button class="edit-btn" data-id="${id}">Edit</button>` : ""}
    <h3>${club.name}</h3>
    <p>${club.description}</p>
    <p><strong>President:</strong> ${club.presidentName} (${club.presidentPhone})</p>
    ${club.whatsapp ? `<p><a href="${club.whatsapp}" target="_blank">WhatsApp Group</a></p>` : ""}
    ${club.insta ? `<p><a href="${club.insta}" target="_blank">Instagram</a></p>` : ""}
  `;

  clubGrid.appendChild(card);

  if (isPresident) {
    card.querySelector(".edit-btn").addEventListener("click", () => openEditModal(id, club));
  }
}

/* =========================================================
   3. CREATE NEW CLUB  (status starts as "pending")
   ========================================================= */

addClubBtn.addEventListener("click", () => createClubModal.classList.remove("hidden"));
closeModalBtn.addEventListener("click", () => createClubModal.classList.add("hidden"));

feeType.addEventListener("change", () => {
  feeAmount.classList.toggle("hidden", feeType.value !== "paid");
});

createClubForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newClub = {
    name: document.getElementById("clubName").value.trim(),
    description: document.getElementById("clubDescription").value.trim(),
    whatsapp: document.getElementById("clubWhatsapp").value.trim(),
    insta: document.getElementById("clubInsta").value.trim(),
    presidentName: document.getElementById("presidentName").value.trim(),
    presidentPhone: document.getElementById("presidentPhone").value.trim(),
    presidentEmail: document.getElementById("presidentEmail").value.trim(),
    feeType: feeType.value,
    feeAmount: feeType.value === "paid" ? Number(feeAmount.value) : 0,
    coordinatorEmail: document.getElementById("coordinatorEmail").value.trim(),
    status: "pending", // waits for professor approval
    createdBy: currentUser.email,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  db.collection("clubs")
    .add(newClub)
    .then(() => {
      alert("Club submitted! It will appear once your coordinator professor approves it.");
      createClubForm.reset();
      createClubModal.classList.add("hidden");
    })
    .catch((err) => alert("Error: " + err.message));
});

/* =========================================================
   4. PROFESSOR APPROVAL PANEL
   ========================================================= */

function loadPendingApprovals() {
  if (!currentUser) return;

  db.collection("clubs")
    .where("coordinatorEmail", "==", currentUser.email)
    .where("status", "==", "pending")
    .onSnapshot((snapshot) => {
      if (snapshot.empty) {
        approvalPanel.classList.add("hidden");
        return;
      }
      approvalPanel.classList.remove("hidden");
      pendingList.innerHTML = "";

      snapshot.forEach((doc) => {
        const club = doc.data();
        const card = document.createElement("div");
        card.className = "pending-card";
        card.innerHTML = `
          <h4>${club.name}</h4>
          <p>${club.description}</p>
          <p><strong>President:</strong> ${club.presidentName} (${club.presidentEmail})</p>
          <div class="actions">
            <button class="approve-btn" data-id="${doc.id}">Approve</button>
            <button class="reject-btn" data-id="${doc.id}">Reject</button>
          </div>
        `;
        pendingList.appendChild(card);

        card.querySelector(".approve-btn").addEventListener("click", () => {
          db.collection("clubs").doc(doc.id).update({ status: "approved" });
        });
        card.querySelector(".reject-btn").addEventListener("click", () => {
          db.collection("clubs").doc(doc.id).update({ status: "rejected" });
        });
      });
    });
}

/* =========================================================
   5. EDIT CLUB (president only)
   ========================================================= */

function openEditModal(id, club) {
  document.getElementById("editClubId").value = id;
  document.getElementById("editDescription").value = club.description;
  document.getElementById("editWhatsapp").value = club.whatsapp || "";
  document.getElementById("editInsta").value = club.insta || "";
  document.getElementById("editPresidentName").value = club.presidentName;
  document.getElementById("editPresidentPhone").value = club.presidentPhone;
  editClubModal.classList.remove("hidden");
}

closeEditModalBtn.addEventListener("click", () => editClubModal.classList.add("hidden"));

editClubForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("editClubId").value;

  db.collection("clubs")
    .doc(id)
    .update({
      description: document.getElementById("editDescription").value.trim(),
      whatsapp: document.getElementById("editWhatsapp").value.trim(),
      insta: document.getElementById("editInsta").value.trim(),
      presidentName: document.getElementById("editPresidentName").value.trim(),
      presidentPhone: document.getElementById("editPresidentPhone").value.trim(),
    })
    .then(() => {
      editClubModal.classList.add("hidden");
      alert("Club updated!");
    })
    .catch((err) => alert("Error: " + err.message));
});

/* =========================================================
   6. INITIAL LOAD (for logged-out visitors)
   ========================================================= */
loadClubs();
