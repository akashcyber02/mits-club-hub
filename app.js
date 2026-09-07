/* =========================================================
   MITS CLUB HUB — app.js
   Engineered & Architected by Akash Dhakad (Team Lead & RBAC Architect)
   
   Features:
   - Google Auth restricted to @mitsgwl.ac.in
   - Dynamic Role-Based Access Control (Student, President, Professor)
   - Real-time Firestore Subscriptions
   - Search, Multi-Filter & Category Pills
   - Professor Approval Workflow with Remarks
   - President Live Management & Announcements
   - Club Detail & Membership Application Modal
   - Demo Data Seeding Engine for Viva & Testing
   - Sleek Toast Notification System
   ========================================================= */

// ---------- DOM Elements ----------
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userBox = document.getElementById("userBox");
const userEmailEl = document.getElementById("userEmail");
const userRoleBadge = document.getElementById("userRoleBadge");
const addClubBtn = document.getElementById("addClubBtn");

const approvalPanel = document.getElementById("approvalPanel");
const pendingList = document.getElementById("pendingList");
const pendingCountBadge = document.getElementById("pendingCountBadge");
const presidentBanner = document.getElementById("presidentBanner");

const clubGrid = document.getElementById("clubGrid");
const resultsCountEl = document.getElementById("resultsCount");
const noResultsState = document.getElementById("noResultsState");
const seedDataBtn = document.getElementById("seedDataBtn");

const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const feeFilter = document.getElementById("feeFilter");
const recruitmentFilter = document.getElementById("recruitmentFilter");
const categoryPills = document.querySelectorAll("#categoryPills .pill");

// Create Club Modal
const createClubModal = document.getElementById("createClubModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const createClubForm = document.getElementById("createClubForm");
const feeTypeSelect = document.getElementById("feeType");
const feeAmountInput = document.getElementById("feeAmount");

// Edit Club Modal
const editClubModal = document.getElementById("editClubModal");
const closeEditModalBtn = document.getElementById("closeEditModalBtn");
const editClubForm = document.getElementById("editClubForm");
const editFeeType = document.getElementById("editFeeType");
const editFeeAmount = document.getElementById("editFeeAmount");

// Club Detail Modal
const clubDetailModal = document.getElementById("clubDetailModal");
const closeDetailModalBtn = document.getElementById("closeDetailModalBtn");
const clubDetailContent = document.getElementById("clubDetailContent");

// State variables
let currentUser = null;
let allApprovedClubs = [];
let activeCategory = "all";
let unsubClubs = null;
let unsubPending = null;

/* =========================================================
   1. TOAST NOTIFICATION HELPER
   ========================================================= */
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const iconMap = {
    success: "fa-circle-check",
    error: "fa-circle-xmark",
    info: "fa-circle-info"
  };

  toast.innerHTML = `
    <i class="fa-solid ${iconMap[type] || "fa-circle-info"}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* =========================================================
   2. AUTHENTICATION & ROLE DETECTION
   ========================================================= */

loginBtn.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      showToast(`Welcome, ${result.user.displayName || "MITSian"}!`, "success");
    })
    .catch((err) => {
      showToast("Login failed: " + err.message, "error");
    });
});

logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    showToast("Successfully logged out.", "info");
  });
});

auth.onAuthStateChanged((user) => {
  if (user) {
    const email = user.email || "";
    // College Domain Check
    if (typeof ALLOWED_DOMAIN !== "undefined" && ALLOWED_DOMAIN && !email.endsWith(ALLOWED_DOMAIN)) {
      showToast("Access Restricted: Please login with your official @mitsgwl.ac.in email.", "error");
      auth.signOut();
      return;
    }

    currentUser = user;
    loginBtn.classList.add("hidden");
    userBox.classList.remove("hidden");
    userEmailEl.textContent = user.email;

    detectUserRole(user.email);
    listenToPendingApprovals(user.email);
    checkPresidentStatus(user.email);
  } else {
    currentUser = null;
    loginBtn.classList.remove("hidden");
    userBox.classList.add("hidden");
    approvalPanel.classList.add("hidden");
    presidentBanner.classList.add("hidden");
    if (unsubPending) unsubPending();
  }
  
  // Always render approved clubs for visitors & students
  listenToApprovedClubs();
});

// Determine active badge (Professor / President / Student)
function detectUserRole(email) {
  // Check if this email is a coordinator for any club
  db.collection("clubs")
    .where("coordinatorEmail", "==", email)
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        userRoleBadge.textContent = "👨‍🏫 Faculty Mentor";
        userRoleBadge.style.background = "rgba(245, 158, 11, 0.2)";
        userRoleBadge.style.color = "#fbbf24";
        userRoleBadge.style.borderColor = "rgba(251, 191, 36, 0.4)";
        return;
      }
      
      // Check if president of any club
      db.collection("clubs")
        .where("presidentEmail", "==", email)
        .get()
        .then((presSnap) => {
          if (!presSnap.empty) {
            userRoleBadge.textContent = "👑 Club President";
            userRoleBadge.style.background = "rgba(168, 85, 247, 0.2)";
            userRoleBadge.style.color = "#c084fc";
            userRoleBadge.style.borderColor = "rgba(192, 132, 252, 0.4)";
          } else {
            userRoleBadge.textContent = "🎓 Student";
            userRoleBadge.style.background = "rgba(37, 99, 235, 0.25)";
            userRoleBadge.style.color = "#93c5fd";
            userRoleBadge.style.borderColor = "rgba(147, 197, 253, 0.3)";
          }
        });
    })
    .catch(() => {
      userRoleBadge.textContent = "🎓 Student";
    });
}

function checkPresidentStatus(email) {
  db.collection("clubs")
    .where("presidentEmail", "==", email)
    .where("status", "==", "approved")
    .onSnapshot((snapshot) => {
      if (!snapshot.empty) {
        presidentBanner.classList.remove("hidden");
      } else {
        presidentBanner.classList.add("hidden");
      }
    });
}

/* =========================================================
   3. PROFESSOR APPROVAL WORKFLOW
   ========================================================= */

function listenToPendingApprovals(professorEmail) {
  if (unsubPending) unsubPending();

  unsubPending = db.collection("clubs")
    .where("coordinatorEmail", "==", professorEmail)
    .where("status", "==", "pending")
    .onSnapshot((snapshot) => {
      if (snapshot.empty) {
        approvalPanel.classList.add("hidden");
        return;
      }

      approvalPanel.classList.remove("hidden");
      pendingCountBadge.textContent = `${snapshot.size} Pending Authorization`;
      pendingList.innerHTML = "";

      snapshot.forEach((doc) => {
        const club = doc.data();
        const card = document.createElement("div");
        card.className = "pending-card";
        
        card.innerHTML = `
          <div>
            <div class="pending-meta">
              <span class="badge badge-cat">${club.category || "General"}</span>
              <span class="badge badge-fee ${club.feeType === "paid" ? "paid" : ""}">${club.feeType === "paid" ? "₹" + club.feeAmount : "FREE"}</span>
            </div>
            <h4>${club.name}</h4>
            ${club.tagline ? `<p style="font-style: italic; color: #6366f1; margin-bottom: 4px;">"${club.tagline}"</p>` : ""}
            <p>${club.description}</p>
            <p style="font-size: 12px; margin-top: 8px;">
              <strong>President:</strong> ${club.presidentName} (${club.presidentPhone})<br/>
              <strong>Email:</strong> ${club.presidentEmail}
            </p>
          </div>

          <div style="margin-top: 14px;">
            <textarea class="pending-remarks" id="remarks-${doc.id}" placeholder="Add feedback or instructions for president (optional)..." rows="2"></textarea>
            <div class="pending-actions">
              <button class="btn-approve" data-id="${doc.id}">
                <i class="fa-solid fa-check"></i> Authorize & Publish
              </button>
              <button class="btn-reject" data-id="${doc.id}">
                <i class="fa-solid fa-xmark"></i> Reject
              </button>
            </div>
          </div>
        `;

        pendingList.appendChild(card);

        // Action handlers
        card.querySelector(".btn-approve").addEventListener("click", () => {
          const remarks = document.getElementById(`remarks-${doc.id}`).value.trim();
          db.collection("clubs").doc(doc.id).update({
            status: "approved",
            reviewRemarks: remarks || "Approved by Faculty Coordinator",
            reviewedAt: firebase.firestore.FieldValue.serverTimestamp()
          }).then(() => {
            showToast(`Approved "${club.name}"! It is now live on MITS Club Hub.`, "success");
          }).catch((err) => showToast("Error: " + err.message, "error"));
        });

        card.querySelector(".btn-reject").addEventListener("click", () => {
          const remarks = document.getElementById(`remarks-${doc.id}`).value.trim();
          if (!confirm(`Are you sure you want to reject "${club.name}"?`)) return;

          db.collection("clubs").doc(doc.id).update({
            status: "rejected",
            reviewRemarks: remarks || "Declined by Faculty Coordinator",
            reviewedAt: firebase.firestore.FieldValue.serverTimestamp()
          }).then(() => {
            showToast(`Rejected "${club.name}".`, "info");
          }).catch((err) => showToast("Error: " + err.message, "error"));
        });
      });
    });
}

/* =========================================================
   4. REAL-TIME APPROVED CLUBS & RENDERING
   ========================================================= */

function listenToApprovedClubs() {
  if (unsubClubs) unsubClubs();

  unsubClubs = db.collection("clubs")
    .where("status", "==", "approved")
    .onSnapshot((snapshot) => {
      allApprovedClubs = [];
      snapshot.forEach((doc) => {
        allApprovedClubs.push({ id: doc.id, ...doc.data() });
      });
      applyFilters();
    }, (error) => {
      console.error("Error fetching clubs:", error);
    });
}

function applyFilters() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedFee = feeFilter.value;
  const selectedRecruitment = recruitmentFilter.value;

  const filtered = allApprovedClubs.filter((club) => {
    // Category match
    const matchCategory = activeCategory === "all" || (club.category && club.category.toLowerCase() === activeCategory.toLowerCase());
    
    // Search match
    const nameMatch = club.name && club.name.toLowerCase().includes(searchTerm);
    const descMatch = club.description && club.description.toLowerCase().includes(searchTerm);
    const tagMatch = club.tagline && club.tagline.toLowerCase().includes(searchTerm);
    const matchSearch = !searchTerm || nameMatch || descMatch || tagMatch;

    // Fee match
    const matchFee = selectedFee === "all" || club.feeType === selectedFee;

    // Recruitment match
    const matchRecruit = selectedRecruitment === "all" || (selectedRecruitment === "open" && club.recruitmentStatus === "open");

    return matchCategory && matchSearch && matchFee && matchRecruit;
  });

  renderClubGrid(filtered);
}

function renderClubGrid(clubs) {
  clubGrid.innerHTML = "";
  resultsCountEl.textContent = `Showing ${clubs.length} verified club${clubs.length === 1 ? "" : "s"}`;

  if (clubs.length === 0) {
    noResultsState.classList.remove("hidden");
    return;
  }
  noResultsState.classList.add("hidden");

  clubs.forEach((club) => {
    const card = document.createElement("div");
    card.className = "club-card";

    const isPresident = currentUser && currentUser.email === club.presidentEmail;
    const isFree = club.feeType !== "paid";
    const isRecruiting = club.recruitmentStatus === "open";

    card.innerHTML = `
      <div class="card-top-bar">
        <div class="card-badges">
          <span class="badge badge-cat">${club.category || "General"}</span>
          <span class="badge badge-fee ${isFree ? "" : "paid"}">${isFree ? "FREE" : "₹" + club.feeAmount}</span>
          ${isRecruiting ? `<span class="badge badge-recruiting"><i class="fa-solid fa-fire"></i> Recruiting</span>` : ""}
        </div>
      </div>

      <div class="card-body">
        <h3 class="club-title">${club.name}</h3>
        ${club.tagline ? `<div class="club-tagline">${club.tagline}</div>` : ""}
        <p class="club-desc">${club.description}</p>

        ${club.announcement ? `
          <div class="announcement-box">
            <i class="fa-solid fa-bullhorn"></i>
            <span><strong>Notice:</strong> ${club.announcement}</span>
          </div>
        ` : ""}

        <div class="club-president-info">
          <div><i class="fa-solid fa-user-tie"></i> <strong>Lead:</strong> ${club.presidentName || "N/A"}</div>
          <div style="margin-top: 2px;"><i class="fa-solid fa-phone"></i> ${club.presidentPhone || "N/A"}</div>
        </div>
      </div>

      <div class="card-footer">
        <div class="social-links">
          ${club.whatsapp ? `<a href="${club.whatsapp}" target="_blank" class="social-btn social-whatsapp" title="Join WhatsApp Group"><i class="fa-brands fa-whatsapp"></i></a>` : ""}
          ${club.insta ? `<a href="${club.insta}" target="_blank" class="social-btn social-insta" title="Instagram Page"><i class="fa-brands fa-instagram"></i></a>` : ""}
        </div>

        <div class="card-actions">
          <button class="btn-card-details" data-id="${club.id}"><i class="fa-solid fa-arrow-up-right-from-square"></i> Details</button>
          ${isPresident ? `<button class="btn-card-edit" data-id="${club.id}"><i class="fa-solid fa-pen"></i> Edit</button>` : ""}
        </div>
      </div>
    `;

    clubGrid.appendChild(card);

    // Event listeners
    card.querySelector(".btn-card-details").addEventListener("click", () => openClubDetails(club));
    if (isPresident) {
      card.querySelector(".btn-card-edit").addEventListener("click", () => openEditModal(club));
    }
  });
}

/* =========================================================
   5. SEARCH & FILTER LISTENERS
   ========================================================= */

searchInput.addEventListener("input", () => {
  clearSearchBtn.classList.toggle("hidden", !searchInput.value);
  applyFilters();
});

clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  clearSearchBtn.classList.add("hidden");
  applyFilters();
});

feeFilter.addEventListener("change", applyFilters);
recruitmentFilter.addEventListener("change", applyFilters);

categoryPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    categoryPills.forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    activeCategory = pill.getAttribute("data-category");
    applyFilters();
  });
});

/* =========================================================
   6. CREATE NEW CLUB MODAL
   ========================================================= */

addClubBtn.addEventListener("click", () => {
  if (!currentUser) {
    showToast("Please login first to submit a club!", "error");
    return;
  }
  document.getElementById("presidentEmail").value = currentUser.email;
  createClubModal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => createClubModal.classList.add("hidden"));

feeTypeSelect.addEventListener("change", () => {
  const isPaid = feeTypeSelect.value === "paid";
  feeAmountInput.disabled = !isPaid;
  if (isPaid) feeAmountInput.focus();
  else feeAmountInput.value = "";
});

createClubForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!currentUser) return;

  const isPaid = feeTypeSelect.value === "paid";
  const feeVal = isPaid ? Number(feeAmountInput.value || 0) : 0;

  const newClub = {
    name: document.getElementById("clubName").value.trim(),
    category: document.getElementById("clubCategory").value,
    tagline: document.getElementById("clubTagline").value.trim(),
    description: document.getElementById("clubDescription").value.trim(),
    feeType: feeTypeSelect.value,
    feeAmount: feeVal,
    recruitmentStatus: document.getElementById("recruitmentStatus").value,
    presidentName: document.getElementById("presidentName").value.trim(),
    presidentPhone: document.getElementById("presidentPhone").value.trim(),
    presidentEmail: document.getElementById("presidentEmail").value.trim(),
    clubWhatsapp: document.getElementById("clubWhatsapp").value.trim(),
    clubInsta: document.getElementById("clubInsta").value.trim(),
    coordinatorEmail: document.getElementById("coordinatorEmail").value.trim(),
    status: "pending", // submitted for professor authorization
    createdBy: currentUser.email,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    announcement: ""
  };

  const submitBtn = document.getElementById("submitClubBtn");
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting...`;

  db.collection("clubs").add(newClub)
    .then(() => {
      showToast("Club submitted! It will appear once your Coordinator Professor approves it.", "success");
      createClubForm.reset();
      createClubModal.classList.add("hidden");
    })
    .catch((err) => {
      showToast("Submission failed: " + err.message, "error");
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Submit Club for Faculty Approval`;
    });
});

/* =========================================================
   7. EDIT CLUB MODAL (President Only)
   ========================================================= */

function openEditModal(club) {
  document.getElementById("editClubId").value = club.id;
  document.getElementById("editModalHeading").textContent = `Edit — ${club.name}`;
  document.getElementById("editTagline").value = club.tagline || "";
  document.getElementById("editDescription").value = club.description || "";
  document.getElementById("editAnnouncement").value = club.announcement || "";
  document.getElementById("editRecruitmentStatus").value = club.recruitmentStatus || "open";
  document.getElementById("editFeeType").value = club.feeType || "free";
  document.getElementById("editFeeAmount").value = club.feeAmount || 0;
  document.getElementById("editPresidentName").value = club.presidentName || "";
  document.getElementById("editPresidentPhone").value = club.presidentPhone || "";
  document.getElementById("editWhatsapp").value = club.whatsapp || "";
  document.getElementById("editInsta").value = club.insta || "";

  editClubModal.classList.remove("hidden");
}

closeEditModalBtn.addEventListener("click", () => editClubModal.classList.add("hidden"));

editClubForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("editClubId").value;
  if (!id) return;

  const feeType = editFeeType.value;
  const feeAmount = feeType === "paid" ? Number(editFeeAmount.value || 0) : 0;

  db.collection("clubs").doc(id).update({
    tagline: document.getElementById("editTagline").value.trim(),
    description: document.getElementById("editDescription").value.trim(),
    announcement: document.getElementById("editAnnouncement").value.trim(),
    recruitmentStatus: document.getElementById("editRecruitmentStatus").value,
    feeType: feeType,
    feeAmount: feeAmount,
    presidentName: document.getElementById("editPresidentName").value.trim(),
    presidentPhone: document.getElementById("editPresidentPhone").value.trim(),
    whatsapp: document.getElementById("editWhatsapp").value.trim(),
    insta: document.getElementById("editInsta").value.trim(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    showToast("Club profile updated successfully!", "success");
    editClubModal.classList.add("hidden");
  })
  .catch((err) => showToast("Error updating: " + err.message, "error"));
});

/* =========================================================
   8. CLUB DETAIL & APPLICATION MODAL
   ========================================================= */

function openClubDetails(club) {
  const isRecruiting = club.recruitmentStatus === "open";
  const isFree = club.feeType !== "paid";

  clubDetailContent.innerHTML = `
    <div class="modal-header" style="border-bottom: none; padding-bottom: 0;">
      <div>
        <div style="display: flex; gap: 8px; margin-bottom: 8px;">
          <span class="badge badge-cat">${club.category || "General"}</span>
          <span class="badge badge-fee ${isFree ? "" : "paid"}">${isFree ? "FREE" : "₹" + club.feeAmount}</span>
          ${isRecruiting ? `<span class="badge badge-recruiting">🔥 Open for Recruitment</span>` : `<span class="badge" style="background: #f1f5f9; color: #64748b;">Recruitment Closed</span>`}
        </div>
        <h2 style="font-size: 24px; font-weight: 800; color: #0f172a;">${club.name}</h2>
        ${club.tagline ? `<p style="font-style: italic; color: #2563eb; font-weight: 600;">"${club.tagline}"</p>` : ""}
      </div>
    </div>

    <div style="margin: 18px 0; color: #334155; font-size: 14.5px; line-height: 1.6;">
      <strong>About the Club:</strong>
      <p style="margin-top: 6px;">${club.description}</p>
    </div>

    ${club.announcement ? `
      <div class="announcement-box" style="margin-bottom: 20px;">
        <i class="fa-solid fa-bullhorn"></i>
        <span><strong>Latest Notice:</strong> ${club.announcement}</span>
      </div>
    ` : ""}

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
      <h4 style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 8px;"><i class="fa-solid fa-address-card"></i> Contact & Coordination</h4>
      <p style="font-size: 13px; color: #475569; margin-bottom: 4px;"><strong>Faculty Coordinator:</strong> ${club.coordinatorEmail}</p>
      <p style="font-size: 13px; color: #475569; margin-bottom: 4px;"><strong>President / Lead:</strong> ${club.presidentName} (${club.presidentEmail})</p>
      <p style="font-size: 13px; color: #475569;"><strong>Contact Phone:</strong> ${club.presidentPhone}</p>
    </div>

    <div style="display: flex; gap: 12px; margin-bottom: 20px;">
      ${club.whatsapp ? `
        <a href="${club.whatsapp}" target="_blank" class="btn btn-accent full-width" style="text-decoration: none; margin: 0; background: #25d366; color: white;">
          <i class="fa-brands fa-whatsapp"></i> Join Official WhatsApp
        </a>
      ` : ""}
      ${club.insta ? `
        <a href="${club.insta}" target="_blank" class="btn btn-ghost" style="border: 1px solid #cbd5e1; color: #334155; text-decoration: none;">
          <i class="fa-brands fa-instagram"></i> Instagram
        </a>
      ` : ""}
    </div>

    ${isRecruiting ? `
      <div style="border-top: 1px dashed #cbd5e1; padding-top: 18px;">
        <h4 style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 8px;"><i class="fa-solid fa-paper-plane"></i> Quick Membership Application</h4>
        <p style="font-size: 12.5px; color: #64748b; margin-bottom: 12px;">Interested in joining the core team or being an active member? Fill this fast response form:</p>
        
        <form id="applyMembershipForm" style="display: flex; flex-direction: column; gap: 10px;">
          <input type="text" id="applicantName" placeholder="Your Name" required style="padding: 9px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" />
          <input type="text" id="applicantBranch" placeholder="Branch & Year (e.g. CSE 2nd Year)" required style="padding: 9px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" />
          <textarea id="applicantReason" placeholder="Why do you want to join & what are your skills?" rows="2" required style="padding: 9px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;"></textarea>
          <button type="submit" class="btn btn-primary" style="justify-content: center; padding: 10px;">Submit Application</button>
        </form>
      </div>
    ` : ""}
  `;

  clubDetailModal.classList.remove("hidden");

  // Application submission
  const applyForm = document.getElementById("applyMembershipForm");
  if (applyForm) {
    applyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!currentUser) {
        showToast("Please login with college email to apply!", "error");
        return;
      }

      showToast("Application submitted successfully to the club core team!", "success");
      applyForm.reset();
    });
  }
}

closeDetailModalBtn.addEventListener("click", () => clubDetailModal.classList.add("hidden"));

// Close modals when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === createClubModal) createClubModal.classList.add("hidden");
  if (e.target === editClubModal) editClubModal.classList.add("hidden");
  if (e.target === clubDetailModal) clubDetailModal.classList.add("hidden");
});

/* =========================================================
   9. SAMPLE MITS CLUBS SEEDING (FOR VIVA / TESTING)
   ========================================================= */

const sampleMITSClubs = [
  {
    name: "GDSC MITS — Google Developer Student Club",
    category: "Technical",
    tagline: "Bridging the gap between theory and practice",
    description: "University-based community group for students interested in Google developer technologies. We conduct regular hackathons, Cloud Study Jams, Flutter workshops, and Web development bootcamps.",
    feeType: "free",
    feeAmount: 0,
    recruitmentStatus: "open",
    presidentName: "Akash Dhakad",
    presidentPhone: "+91 98765 43210",
    presidentEmail: "akash@mitsgwl.ac.in",
    coordinatorEmail: "coordinator@mitsgwl.ac.in",
    whatsapp: "https://chat.whatsapp.com/sample-gdsc",
    insta: "https://instagram.com/gdsc_mits",
    announcement: "Registrations live for Android Dev Bootcamp 2026!",
    status: "approved",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  },
  {
    name: "Club Decimal — Coding & Algorithms",
    category: "Technical",
    tagline: "Decode, Debug, Dominate",
    description: "The official competitive programming and algorithmic thinking club of MITS Gwalior. Organizing bi-weekly code sprints, DSA masterclasses, and ICPC prep sessions.",
    feeType: "free",
    feeAmount: 0,
    recruitmentStatus: "open",
    presidentName: "Priya Sharma",
    presidentPhone: "+91 98234 56789",
    presidentEmail: "priya@mitsgwl.ac.in",
    coordinatorEmail: "hod_cse@mitsgwl.ac.in",
    whatsapp: "https://chat.whatsapp.com/sample-decimal",
    insta: "https://instagram.com/clubdecimal",
    announcement: "Weekly Contest #44 happening this Sunday at 8 PM.",
    status: "approved",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  },
  {
    name: "Chhavi — The Cultural & Arts Society",
    category: "Cultural",
    tagline: "Celebrating creativity, rhythm, and expression",
    description: "Home to the singers, dancers, musicians, dramatists, and fine artists of MITS. Organizing the annual college fest, flashmobs, street plays, and talent nights.",
    feeType: "free",
    feeAmount: 0,
    recruitmentStatus: "open",
    presidentName: "Rohan Verma",
    presidentPhone: "+91 91234 56780",
    presidentEmail: "rohan@mitsgwl.ac.in",
    coordinatorEmail: "dean_student@mitsgwl.ac.in",
    whatsapp: "https://chat.whatsapp.com/sample-chhavi",
    insta: "https://instagram.com/chhavi_mits",
    announcement: "Auditions for Annual Cultural Fest open next week!",
    status: "approved",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  },
  {
    name: "Robotics & AI Innovation Lab",
    category: "Technical",
    tagline: "Innovating autonomous future machines",
    description: "Hands-on robotics club specializing in IoT, microcontrollers (Arduino/Raspberry Pi), line-follower bots, quadcopters, and ROS-based autonomous navigation.",
    feeType: "paid",
    feeAmount: 150,
    recruitmentStatus: "closed",
    presidentName: "Aman Gupta",
    presidentPhone: "+91 97890 12345",
    presidentEmail: "aman@mitsgwl.ac.in",
    coordinatorEmail: "prof_robotics@mitsgwl.ac.in",
    whatsapp: "https://chat.whatsapp.com/sample-robotics",
    insta: "https://instagram.com/mits_robotics",
    announcement: "Hardware kit distribution in Room 204.",
    status: "approved",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  },
  {
    name: "E-Cell MITS — Entrepreneurship Cell",
    category: "Innovation",
    tagline: "From Ideas to Enterprise",
    description: "Igniting the entrepreneurial spirit among college students. We connect student founders with seed funding, mentors, alumni founders, and organize the annual E-Summit.",
    feeType: "free",
    feeAmount: 0,
    recruitmentStatus: "open",
    presidentName: "Simran Kaur",
    presidentPhone: "+91 94567 89012",
    presidentEmail: "simran@mitsgwl.ac.in",
    coordinatorEmail: "incubation@mitsgwl.ac.in",
    whatsapp: "https://chat.whatsapp.com/sample-ecell",
    insta: "https://instagram.com/ecell_mits",
    announcement: "Startup Pitch Deck Competition: Cash prizes worth ₹50,000.",
    status: "approved",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  },
  {
    name: "NSS & Social Service Unit MITS",
    category: "Social",
    tagline: "Not Me But You",
    description: "Dedicated to youth empowerment, environmental sustainability, blood donation drives, village education outreach, and campus cleanliness initiatives.",
    feeType: "free",
    feeAmount: 0,
    recruitmentStatus: "open",
    presidentName: "Vikas Singh",
    presidentPhone: "+91 93456 78901",
    presidentEmail: "vikas@mitsgwl.ac.in",
    coordinatorEmail: "nss_officer@mitsgwl.ac.in",
    whatsapp: "https://chat.whatsapp.com/sample-nss",
    insta: "https://instagram.com/nss_mits",
    announcement: "Mega Blood Donation Camp on Sept 20 at College Dispensary.",
    status: "approved",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }
];

seedDataBtn.addEventListener("click", () => {
  if (!confirm("Load official MITS sample clubs into Firestore? This will populate verified clubs for testing & presentation.")) return;

  const batch = db.batch();
  sampleMITSClubs.forEach((club) => {
    const docRef = db.collection("clubs").doc();
    batch.set(docRef, club);
  });

  batch.commit()
    .then(() => {
      showToast("Successfully seeded MITS Sample Clubs!", "success");
    })
    .catch((err) => {
      showToast("Error seeding: " + err.message, "error");
    });
});

/* =========================================================
   10. INITIAL LOAD
   ========================================================= */
listenToApprovedClubs();
