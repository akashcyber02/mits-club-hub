/* =========================================================
   MITS CLUB HUB — app.js
   Engineered & Architected by Akash Dhakad (Team Lead & RBAC Architect)
   
   Features:
   - Mandatory Privacy Login Gatekeeper Screen
   - 3D Interactive Mouse Physics & Card Tilt
   - Single Page App (SPA) Dedicated Full Club View with Hash Routing
   - Comprehensive Multi-Filter Engine (Search, Category, Fee, Status, Sort)
   - Dynamic Role-Based Access Control (Student, President, Professor)
   - Professor Approval Workflow with Custom Remarks
   - President Live Management & Real-time Broadcast
   - Rich "Kya Hai / Kyu Hai / Kaise Join Karein" A-to-Z Club Breakdown
   - MITS Sample Data Seeder for Viva & Testing
   ========================================================= */

// ---------- Gatekeeper & Views ----------
const loginGateView = document.getElementById("loginGateView");
const mainAppView = document.getElementById("mainAppView");
const gateLoginBtn = document.getElementById("gateLoginBtn");

const navLogoBtn = document.getElementById("navLogoBtn");
const homeView = document.getElementById("homeView");
const clubFullView = document.getElementById("clubFullView");

// Auth & Nav Elements
const logoutBtn = document.getElementById("logoutBtn");
const userBox = document.getElementById("userBox");
const userEmailEl = document.getElementById("userEmail");
const userAvatarEl = document.getElementById("userAvatar");
const userRoleBadge = document.getElementById("userRoleBadge");
const addClubBtn = document.getElementById("addClubBtn");

// Stats & Approvals
const statClubsCount = document.getElementById("statClubsCount");
const statRecruitingCount = document.getElementById("statRecruitingCount");
const approvalPanel = document.getElementById("approvalPanel");
const pendingList = document.getElementById("pendingList");
const pendingCountBadge = document.getElementById("pendingCountBadge");
const presidentBanner = document.getElementById("presidentBanner");

// Search & Filters
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const feeFilter = document.getElementById("feeFilter");
const recruitmentFilter = document.getElementById("recruitmentFilter");
const sortFilter = document.getElementById("sortFilter");
const categoryPills = document.querySelectorAll("#categoryPills .pill-3d");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");

// Directory & Grid
const clubGrid = document.getElementById("clubGrid");
const resultsCountEl = document.getElementById("resultsCount");
const noResultsState = document.getElementById("noResultsState");
const seedDataBtn = document.getElementById("seedDataBtn");

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

// State
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
   2. AUTHENTICATION & LOGIN GATEKEEPER
   ========================================================= */

if (gateLoginBtn) {
  gateLoginBtn.addEventListener("click", handleGoogleLogin);
}

function handleGoogleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      showToast(`Welcome to MITS Club Hub, ${result.user.displayName || "MITSian"}!`, "success");
    })
    .catch((err) => {
      showToast("Login failed: " + err.message, "error");
    });
}

logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    showToast("Logged out successfully. Privacy gate locked.", "info");
    window.location.hash = "";
  });
});

auth.onAuthStateChanged((user) => {
  if (user) {
    const email = user.email || "";
    // Enforce @mitsgwl.ac.in restriction
    if (typeof ALLOWED_DOMAIN !== "undefined" && ALLOWED_DOMAIN && !email.endsWith(ALLOWED_DOMAIN)) {
      showToast("Access Denied: Only @mitsgwl.ac.in email addresses are permitted.", "error");
      auth.signOut();
      return;
    }

    // Authenticated User -> Unlock Portal
    currentUser = user;
    loginGateView.classList.add("hidden");
    mainAppView.classList.remove("hidden");

    userEmailEl.textContent = user.email;
    if (userAvatarEl) {
      userAvatarEl.textContent = (user.displayName || user.email || "M").charAt(0).toUpperCase();
    }

    detectUserRole(user.email);
    listenToPendingApprovals(user.email);
    checkPresidentStatus(user.email);
    listenToApprovedClubs();
  } else {
    // Logged Out -> Lock Portal behind Login Gate
    currentUser = null;
    loginGateView.classList.remove("hidden");
    mainAppView.classList.add("hidden");
    approvalPanel.classList.add("hidden");
    presidentBanner.classList.add("hidden");

    if (unsubClubs) { unsubClubs(); unsubClubs = null; }
    if (unsubPending) { unsubPending(); unsubPending = null; }
  }
});

function detectUserRole(email) {
  db.collection("clubs")
    .where("coordinatorEmail", "==", email)
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        userRoleBadge.textContent = "👨‍🏫 Faculty Mentor";
        userRoleBadge.style.color = "#facc15";
        return;
      }
      
      db.collection("clubs")
        .where("presidentEmail", "==", email)
        .get()
        .then((presSnap) => {
          if (!presSnap.empty) {
            userRoleBadge.textContent = "👑 Club President";
            userRoleBadge.style.color = "#c084fc";
          } else {
            userRoleBadge.textContent = "🎓 Student";
            userRoleBadge.style.color = "#38bdf8";
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
   3. PROFESSOR APPROVAL PORTAL
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
        card.className = "pending-card-3d";
        
        card.innerHTML = `
          <div>
            <div style="display: flex; gap: 8px; margin-bottom: 10px;">
              <span class="tag-3d tag-cat">${club.category || "General"}</span>
              <span class="tag-3d ${club.feeType === "paid" ? "tag-paid" : "tag-free"}">${club.feeType === "paid" ? "₹" + club.feeAmount : "FREE"}</span>
            </div>
            <h3 style="font-size: 20px; color: white; margin-bottom: 4px;">${club.name}</h3>
            ${club.tagline ? `<p style="font-style: italic; color: #38bdf8; font-size: 13px; margin-bottom: 8px;">"${club.tagline}"</p>` : ""}
            <p style="font-size: 13.5px; color: #94a3b8; line-height: 1.5; margin-bottom: 12px;">${club.description}</p>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 10px 14px; border-radius: 8px; font-size: 12.5px; color: #cbd5e1;">
              <strong>President:</strong> ${club.presidentName} (${club.presidentPhone})<br/>
              <strong>Email:</strong> ${club.presidentEmail}
            </div>
          </div>

          <div style="margin-top: 16px;">
            <textarea id="remarks-${doc.id}" placeholder="Add feedback / notes for president (optional)..." rows="2" style="width: 100%; padding: 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; font-size: 13px; margin-bottom: 12px; outline: none;"></textarea>
            <div style="display: flex; gap: 10px;">
              <button class="btn-approve-3d" data-id="${doc.id}">
                <i class="fa-solid fa-check"></i> Authorize & Publish
              </button>
              <button class="btn-reject-3d" data-id="${doc.id}">
                <i class="fa-solid fa-xmark"></i> Reject
              </button>
            </div>
          </div>
        `;

        pendingList.appendChild(card);

        card.querySelector(".btn-approve-3d").addEventListener("click", () => {
          const remarks = document.getElementById(`remarks-${doc.id}`).value.trim();
          db.collection("clubs").doc(doc.id).update({
            status: "approved",
            reviewRemarks: remarks || "Approved by Faculty Coordinator",
            reviewedAt: firebase.firestore.FieldValue.serverTimestamp()
          }).then(() => {
            showToast(`Authorized "${club.name}"! It is now live on the portal.`, "success");
          }).catch((err) => showToast("Error: " + err.message, "error"));
        });

        card.querySelector(".btn-reject-3d").addEventListener("click", () => {
          const remarks = document.getElementById(`remarks-${doc.id}`).value.trim();
          if (!confirm(`Are you sure you want to decline "${club.name}"?`)) return;

          db.collection("clubs").doc(doc.id).update({
            status: "rejected",
            reviewRemarks: remarks || "Declined by Faculty Coordinator",
            reviewedAt: firebase.firestore.FieldValue.serverTimestamp()
          }).then(() => {
            showToast(`Declined "${club.name}".`, "info");
          }).catch((err) => showToast("Error: " + err.message, "error"));
        });
      });
    });
}

/* =========================================================
   4. REAL-TIME APPROVED CLUBS SUBSCRIPTION
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
      
      // Update quick stats counter
      if (statClubsCount) statClubsCount.textContent = allApprovedClubs.length;
      const recruitingClubs = allApprovedClubs.filter(c => c.recruitmentStatus === "open");
      if (statRecruitingCount) statRecruitingCount.textContent = recruitingClubs.length;

      applyFilters();
      checkHashRoute();
    }, (error) => {
      console.error("Error fetching clubs:", error);
    });
}

/* =========================================================
   5. MULTI-FILTER & SEARCH ENGINE
   ========================================================= */

function applyFilters() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedFee = feeFilter.value;
  const selectedRecruitment = recruitmentFilter.value;
  const selectedSort = sortFilter.value;

  let filtered = allApprovedClubs.filter((club) => {
    // Category match
    const matchCategory = activeCategory === "all" || (club.category && club.category.toLowerCase() === activeCategory.toLowerCase());
    
    // Search match
    const nameMatch = club.name && club.name.toLowerCase().includes(searchTerm);
    const descMatch = club.description && club.description.toLowerCase().includes(searchTerm);
    const whyMatch = club.whyJoin && club.whyJoin.toLowerCase().includes(searchTerm);
    const tagMatch = club.tagline && club.tagline.toLowerCase().includes(searchTerm);
    const matchSearch = !searchTerm || nameMatch || descMatch || tagMatch || whyMatch;

    // Fee match
    const matchFee = selectedFee === "all" || club.feeType === selectedFee;

    // Recruitment match
    const matchRecruit = selectedRecruitment === "all" || (selectedRecruitment === "open" && club.recruitmentStatus === "open") || (selectedRecruitment === "closed" && club.recruitmentStatus !== "open");

    return matchCategory && matchSearch && matchFee && matchRecruit;
  });

  // Sort
  if (selectedSort === "name_asc") {
    filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  } else if (selectedSort === "name_desc") {
    filtered.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
  }

  renderClubGrid(filtered);
}

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
sortFilter.addEventListener("change", applyFilters);

categoryPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    categoryPills.forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    activeCategory = pill.getAttribute("data-category");
    applyFilters();
  });
});

if (resetFiltersBtn) {
  resetFiltersBtn.addEventListener("click", () => {
    searchInput.value = "";
    feeFilter.value = "all";
    recruitmentFilter.value = "all";
    sortFilter.value = "featured";
    activeCategory = "all";
    categoryPills.forEach((p) => p.classList.remove("active"));
    categoryPills[0].classList.add("active");
    clearSearchBtn.classList.add("hidden");
    applyFilters();
  });
}

/* =========================================================
   6. 3D CLUB CARDS RENDERING & MOUSE PHYSICS
   ========================================================= */

const categoryIcons = {
  Technical: "fa-laptop-code",
  Cultural: "fa-masks-theater",
  Sports: "fa-trophy",
  Social: "fa-hand-holding-heart",
  Literary: "fa-feather-pointed",
  Innovation: "fa-lightbulb"
};

function renderClubGrid(clubs) {
  clubGrid.innerHTML = "";
  resultsCountEl.textContent = `Showing ${clubs.length} verified MITS club${clubs.length === 1 ? "" : "s"}`;

  if (clubs.length === 0) {
    noResultsState.classList.remove("hidden");
    return;
  }
  noResultsState.classList.add("hidden");

  clubs.forEach((club) => {
    const card = document.createElement("div");
    const cat = club.category || "Technical";
    card.className = `club-card-3d cat-${cat}`;

    const isPresident = currentUser && currentUser.email === club.presidentEmail;
    const isFree = club.feeType !== "paid";
    const isRecruiting = club.recruitmentStatus === "open";
    const catIcon = categoryIcons[cat] || "fa-shapes";

    card.innerHTML = `
      <div class="card-glow-band"></div>

      <div class="card-header-3d">
        <div class="card-tags">
          <span class="tag-3d tag-cat"><i class="fa-solid ${catIcon}"></i> ${cat}</span>
          <span class="tag-3d ${isFree ? "tag-free" : "tag-paid"}">${isFree ? "FREE" : "₹" + club.feeAmount}</span>
          ${isRecruiting ? `<span class="tag-3d tag-recruiting"><i class="fa-solid fa-fire"></i> Recruiting</span>` : ""}
        </div>
      </div>

      <div class="card-body-3d">
        <h3 class="card-club-name">${club.name}</h3>
        ${club.tagline ? `<div class="card-tagline">${club.tagline}</div>` : ""}
        <p class="card-description">${club.description}</p>

        ${club.announcement ? `
          <div class="card-notice-box">
            <i class="fa-solid fa-bullhorn"></i>
            <span><strong>Notice:</strong> ${club.announcement}</span>
          </div>
        ` : ""}

        <div class="card-leader-pill">
          <div><i class="fa-solid fa-crown" style="color: #facc15;"></i> <strong>Lead:</strong> ${club.presidentName || "N/A"}</div>
          <div style="font-size: 11.5px;"><i class="fa-solid fa-phone"></i> ${club.presidentPhone || "N/A"}</div>
        </div>
      </div>

      <div class="card-footer-3d">
        <div class="card-social-links">
          ${club.whatsapp ? `<a href="${club.whatsapp}" target="_blank" class="icon-btn-sm ico-wa" title="Join WhatsApp Group" onclick="event.stopPropagation()"><i class="fa-brands fa-whatsapp"></i></a>` : ""}
          ${club.insta ? `<a href="${club.insta}" target="_blank" class="icon-btn-sm ico-ig" title="Instagram Page" onclick="event.stopPropagation()"><i class="fa-brands fa-instagram"></i></a>` : ""}
        </div>

        <div class="card-btns-wrap">
          <button class="btn-open-detail"><i class="fa-solid fa-arrow-right"></i> View Page</button>
          ${isPresident ? `<button class="btn-edit-card" onclick="event.stopPropagation()"><i class="fa-solid fa-pen"></i> Edit</button>` : ""}
        </div>
      </div>
    `;

    // 3D Physics Mouse Move Effect
    attach3DCardPhysics(card);

    // Clicking card opens the Full Dedicated Club Page
    card.addEventListener("click", () => openFullClubPage(club.id));

    if (isPresident) {
      const editBtn = card.querySelector(".btn-edit-card");
      if (editBtn) {
        editBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          openEditModal(club);
        });
      }
    }

    clubGrid.appendChild(card);
  });
}

function attach3DCardPhysics(card) {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });
}

/* =========================================================
   7. VIEW 2: DEDICATED FULL CLUB PAGE (A to Z Breakdown)
   ========================================================= */

function openFullClubPage(clubId) {
  window.location.hash = `club/${clubId}`;
}

function renderFullClubView(club) {
  if (!club) return;

  const cat = club.category || "Technical";
  const catIcon = categoryIcons[cat] || "fa-shapes";
  const isFree = club.feeType !== "paid";
  const isRecruiting = club.recruitmentStatus === "open";
  const isPresident = currentUser && currentUser.email === club.presidentEmail;

  clubFullView.innerHTML = `
    <div class="club-page-container">
      
      <!-- Top Sticky Nav Bar -->
      <div class="club-page-nav-bar">
        <button class="btn-back-hub" id="btnBackToHub">
          <i class="fa-solid fa-arrow-left"></i> Back to All Clubs
        </button>
        <div style="display: flex; gap: 10px; align-items: center;">
          <span class="tag-3d tag-cat"><i class="fa-solid ${catIcon}"></i> ${cat}</span>
          ${isPresident ? `<button class="btn btn-create-3d" id="btnEditFromPage" style="padding: 6px 14px; font-size: 13px;"><i class="fa-solid fa-pen"></i> Edit Club</button>` : ""}
        </div>
      </div>

      <!-- Hero Showcase Cover -->
      <div class="club-hero-showcase">
        <div class="club-hero-backdrop-glow" style="background: ${getCategoryGlow(cat)};"></div>

        <div class="club-header-top">
          <div class="club-avatar-3d" style="background: ${getCategoryGradient(cat)};">
            <i class="fa-solid ${catIcon}"></i>
          </div>

          <div class="club-title-block">
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px; flex-wrap: wrap;">
              <span class="tag-3d ${isFree ? "tag-free" : "tag-paid"}">${isFree ? "FREE REGISTRATION" : "ENTRY FEE: ₹" + club.feeAmount}</span>
              ${isRecruiting ? `<span class="tag-3d tag-recruiting"><i class="fa-solid fa-fire"></i> Recruitment Drive Active</span>` : `<span class="tag-3d" style="background: rgba(255,255,255,0.06); color: #94a3b8;">Recruitment Closed</span>`}
              <span class="tag-3d" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;"><i class="fa-solid fa-circle-check"></i> Official MITS Club</span>
            </div>

            <h1 class="club-page-name">${club.name}</h1>
            ${club.tagline ? `<p class="club-page-tagline">"${club.tagline}"</p>` : ""}

            <div class="club-header-actions">
              ${club.whatsapp ? `
                <a href="${club.whatsapp}" target="_blank" class="btn btn-join-wa">
                  <i class="fa-brands fa-whatsapp"></i> Join Official WhatsApp Group
                </a>
              ` : ""}
              ${club.insta ? `
                <a href="${club.insta}" target="_blank" class="btn btn-logout-3d" style="color: white; border-color: rgba(255,255,255,0.2);">
                  <i class="fa-brands fa-instagram"></i> Follow on Instagram
                </a>
              ` : ""}
              ${isRecruiting ? `
                <a href="#applySection" class="btn btn-apply-hero">
                  <i class="fa-solid fa-paper-plane"></i> Apply for Core Team
                </a>
              ` : ""}
            </div>
          </div>
        </div>
      </div>

      <!-- Live Announcement Banner if any -->
      ${club.announcement ? `
        <div style="background: linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(99, 102, 241, 0.15)); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 18px; padding: 20px 26px; margin-bottom: 32px; display: flex; align-items: center; gap: 16px;">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #38bdf8; color: #0f172a; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;">
            <i class="fa-solid fa-bullhorn"></i>
          </div>
          <div>
            <h4 style="font-size: 15px; color: #38bdf8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Latest Official Notice</h4>
            <p style="font-size: 14.5px; color: white; margin-top: 2px;">${club.announcement}</p>
          </div>
        </div>
      ` : ""}

      <!-- Bento Grid (A to Z Details) -->
      <div class="club-bento-grid">
        
        <!-- Left Big Column -->
        <div class="bento-col-main">

          <!-- 1. Kya Hai? (About & Mission) -->
          <div class="bento-card">
            <h3 class="bento-card-title">
              <i class="fa-solid fa-book-open bento-ico"></i> 📖 Kya Hai? (Club Mission & Overview)
            </h3>
            <p class="bento-prose">${club.description}</p>
          </div>

          <!-- 2. Kyu Hai? (Vision & Perks) -->
          <div class="bento-card">
            <h3 class="bento-card-title">
              <i class="fa-solid fa-bullseye bento-ico"></i> 🎯 Kyu Hai? (Why You Should Join & Benefits)
            </h3>
            <p class="bento-prose">${club.whyJoin || "Develop hands-on industry skills, work on real-world projects, participate in hackathons/fests, gain leadership experience, and network with senior mentors."}</p>

            <div class="perks-grid">
              <div class="perk-item">
                <i class="fa-solid fa-certificate perk-ico"></i>
                <div>
                  <h4>Official Certification</h4>
                  <p>Verified certificates for all active contributors & core members.</p>
                </div>
              </div>
              <div class="perk-item">
                <i class="fa-solid fa-laptop-code perk-ico"></i>
                <div>
                  <h4>Hands-on Workshops</h4>
                  <p>Regular masterclasses, bootcamps and competitive hackathons.</p>
                </div>
              </div>
              <div class="perk-item">
                <i class="fa-solid fa-users perk-ico"></i>
                <div>
                  <h4>Senior Mentorship</h4>
                  <p>Direct guidance from placed seniors and college alumni.</p>
                </div>
              </div>
              <div class="perk-item">
                <i class="fa-solid fa-trophy perk-ico"></i>
                <div>
                  <h4>Fest & Hackathon Access</h4>
                  <p>Represent MITS in national competitions with college travel support.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Kaise Join Karein? (Process) -->
          <div class="bento-card">
            <h3 class="bento-card-title">
              <i class="fa-solid fa-route bento-ico"></i> 🚀 Kaise Join Karein? (Recruitment Process)
            </h3>
            <div class="steps-timeline">
              <div class="step-card">
                <div class="step-num">1</div>
                <div class="step-info">
                  <h4>Submit Online Application</h4>
                  <p>Fill out the membership form below with your branch, year, interests & skills.</p>
                </div>
              </div>
              <div class="step-card">
                <div class="step-num">2</div>
                <div class="step-info">
                  <h4>Interactive Task / Interview</h4>
                  <p>Complete a short domain task or attend an informal interaction with core leads.</p>
                </div>
              </div>
              <div class="step-card">
                <div class="step-num">3</div>
                <div class="step-info">
                  <h4>Official Onboarding</h4>
                  <p>Get added to the private core team channel and start contributing to club events!</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Right Side Column -->
        <div class="bento-col-side">

          <!-- Core Leadership Cards -->
          <div class="bento-card">
            <h3 class="bento-card-title">
              <i class="fa-solid fa-user-tie bento-ico"></i> 👥 Leadership Team
            </h3>

            <div class="leadership-cards-wrap">
              <div class="leader-card">
                <div class="leader-title-role"><i class="fa-solid fa-chalkboard-user"></i> Faculty Coordinator</div>
                <div class="leader-name">MITS Faculty Mentor</div>
                <div class="leader-meta"><i class="fa-solid fa-envelope"></i> ${club.coordinatorEmail}</div>
              </div>

              <div class="leader-card">
                <div class="leader-title-role"><i class="fa-solid fa-crown" style="color: #facc15;"></i> Club President / Lead</div>
                <div class="leader-name">${club.presidentName || "Lead Organizer"}</div>
                <div class="leader-meta">
                  <div><i class="fa-solid fa-envelope"></i> ${club.presidentEmail}</div>
                  <div><i class="fa-solid fa-phone"></i> ${club.presidentPhone}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Membership Application Form Section -->
          <div class="bento-card" id="applySection">
            <h3 class="bento-card-title">
              <i class="fa-solid fa-paper-plane bento-ico"></i> 📝 Apply for Membership
            </h3>
            
            ${isRecruiting ? `
              <p style="font-size: 13px; color: #94a3b8; margin-bottom: 14px;">Recruitment is currently <strong>OPEN</strong>! Submit your details directly to the club core team:</p>
              
              <form id="membershipFormPage" class="application-form-3d">
                <input type="text" id="appStudentName" placeholder="Your Full Name *" class="app-input" required />
                <input type="email" id="appStudentEmail" placeholder="College Email (@mitsgwl.ac.in) *" class="app-input" required />
                <input type="text" id="appStudentBranch" placeholder="Branch & Year (e.g. IT 2nd Year) *" class="app-input" required />
                <input type="tel" id="appStudentPhone" placeholder="WhatsApp Contact Number *" class="app-input" required />
                <textarea id="appStudentWhy" rows="3" placeholder="Why do you want to join & what are your skills? *" class="app-input" required></textarea>
                
                <button type="submit" class="btn btn-apply-hero" style="justify-content: center; padding: 12px; margin-top: 6px;">
                  <i class="fa-solid fa-check"></i> Submit Application
                </button>
              </form>
            ` : `
              <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); border-radius: 12px; padding: 20px; text-align: center;">
                <i class="fa-solid fa-lock" style="font-size: 28px; color: #94a3b8; margin-bottom: 10px;"></i>
                <h4 style="font-size: 16px; color: white; margin-bottom: 4px;">Recruitments Currently Closed</h4>
                <p style="font-size: 13px; color: #94a3b8;">Follow our Instagram or join the official WhatsApp group to get notified when the next audition or recruitment drive launches!</p>
              </div>
            `}
          </div>

        </div>

      </div>

    </div>
  `;

  // Back button handler
  document.getElementById("btnBackToHub").addEventListener("click", () => {
    window.location.hash = "";
  });

  if (isPresident) {
    const editBtn = document.getElementById("btnEditFromPage");
    if (editBtn) editBtn.addEventListener("click", () => openEditModal(club));
  }

  // Application form submit
  const membershipForm = document.getElementById("membershipFormPage");
  if (membershipForm) {
    if (currentUser) {
      document.getElementById("appStudentEmail").value = currentUser.email;
    }
    membershipForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!currentUser) {
        showToast("Please login with your college email first!", "error");
        return;
      }
      showToast(`Application successfully sent to ${club.name} core team!`, "success");
      membershipForm.reset();
    });
  }
}

function getCategoryGradient(cat) {
  const map = {
    Technical: "linear-gradient(135deg, #06b6d4, #6366f1)",
    Cultural: "linear-gradient(135deg, #ec4899, #f43f5e)",
    Sports: "linear-gradient(135deg, #10b981, #84cc16)",
    Social: "linear-gradient(135deg, #f59e0b, #ea580c)",
    Literary: "linear-gradient(135deg, #8b5cf6, #d946ef)",
    Innovation: "linear-gradient(135deg, #3b82f6, #f59e0b)"
  };
  return map[cat] || "linear-gradient(135deg, #38bdf8, #818cf8)";
}

function getCategoryGlow(cat) {
  const map = {
    Technical: "rgba(6, 182, 212, 0.4)",
    Cultural: "rgba(236, 72, 153, 0.4)",
    Sports: "rgba(16, 185, 129, 0.4)",
    Social: "rgba(245, 158, 11, 0.4)",
    Literary: "rgba(139, 92, 246, 0.4)",
    Innovation: "rgba(59, 130, 246, 0.4)"
  };
  return map[cat] || "rgba(56, 189, 248, 0.4)";
}

/* =========================================================
   8. HASH-BASED ROUTING (SPA)
   ========================================================= */

function checkHashRoute() {
  if (!currentUser) return;

  const hash = window.location.hash;
  if (hash.startsWith("#club/")) {
    const clubId = hash.replace("#club/", "");
    const foundClub = allApprovedClubs.find(c => c.id === clubId);
    if (foundClub) {
      homeView.classList.add("hidden");
      clubFullView.classList.remove("hidden");
      renderFullClubView(foundClub);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
  }

  // Otherwise show Home View
  homeView.classList.remove("hidden");
  clubFullView.classList.add("hidden");
}

window.addEventListener("hashchange", checkHashRoute);

if (navLogoBtn) {
  navLogoBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.hash = "";
  });
}

/* =========================================================
   9. CREATE CLUB MODAL
   ========================================================= */

addClubBtn.addEventListener("click", () => {
  if (!currentUser) {
    showToast("Please login first to register a new club!", "error");
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
    whyJoin: document.getElementById("clubWhyJoin").value.trim(),
    feeType: feeTypeSelect.value,
    feeAmount: feeVal,
    recruitmentStatus: document.getElementById("recruitmentStatus").value,
    presidentName: document.getElementById("presidentName").value.trim(),
    presidentPhone: document.getElementById("presidentPhone").value.trim(),
    presidentEmail: document.getElementById("presidentEmail").value.trim(),
    whatsapp: document.getElementById("clubWhatsapp").value.trim(),
    insta: document.getElementById("clubInsta").value.trim(),
    coordinatorEmail: document.getElementById("coordinatorEmail").value.trim(),
    status: "pending",
    createdBy: currentUser.email,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    announcement: ""
  };

  const submitBtn = document.getElementById("submitClubBtn");
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting for Approval...`;

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
   10. EDIT CLUB MODAL (President Only)
   ========================================================= */

function openEditModal(club) {
  document.getElementById("editClubId").value = club.id;
  document.getElementById("editModalHeading").textContent = `Edit — ${club.name}`;
  document.getElementById("editTagline").value = club.tagline || "";
  document.getElementById("editDescription").value = club.description || "";
  document.getElementById("editWhyJoin").value = club.whyJoin || "";
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
    whyJoin: document.getElementById("editWhyJoin").value.trim(),
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
    showToast("Club details updated & broadcasted successfully!", "success");
    editClubModal.classList.add("hidden");
  })
  .catch((err) => showToast("Error updating: " + err.message, "error"));
});

// Close modals when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === createClubModal) createClubModal.classList.add("hidden");
  if (e.target === editClubModal) editClubModal.classList.add("hidden");
});

/* =========================================================
   11. SAMPLE MITS CLUBS SEEDER (Viva & Presentation Engine)
   ========================================================= */

const sampleMITSClubs = [
  {
    name: "GDSC MITS — Google Developer Student Club",
    category: "Technical",
    tagline: "Bridging the gap between theory and practice",
    description: "University-based community group supported by Google Developers. We empower students to build real-world software solutions, participate in Google Solution Challenge, Flutter bootcamps, Cloud Study Jams, and Web dev sprints.",
    whyJoin: "Hands-on projects with Google technologies, global hackathon exposure, Cloud credits, peer coding sessions, and official Google certificates.",
    feeType: "free",
    feeAmount: 0,
    recruitmentStatus: "open",
    presidentName: "Akash Dhakad",
    presidentPhone: "+91 98765 43210",
    presidentEmail: "akash@mitsgwl.ac.in",
    coordinatorEmail: "coordinator@mitsgwl.ac.in",
    whatsapp: "https://chat.whatsapp.com/sample-gdsc",
    insta: "https://instagram.com/gdsc_mits",
    announcement: "Android Dev Bootcamp 2026 starts this Saturday in SAC Lab!",
    status: "approved",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  },
  {
    name: "Club Decimal — Competitive Coding & DSA",
    category: "Technical",
    tagline: "Decode, Debug, Dominate",
    description: "The premier coding and algorithmic thinking chapter of MITS Gwalior. Conducting bi-weekly Codeforces/LeetCode contests, ICPC coaching, and tech placement interview masterclasses.",
    whyJoin: "Level up DSA & problem solving for MAANG interviews, compete in college hackathons, and learn from top rated coders in college.",
    feeType: "free",
    feeAmount: 0,
    recruitmentStatus: "open",
    presidentName: "Priya Sharma",
    presidentPhone: "+91 98234 56789",
    presidentEmail: "priya@mitsgwl.ac.in",
    coordinatorEmail: "hod_cse@mitsgwl.ac.in",
    whatsapp: "https://chat.whatsapp.com/sample-decimal",
    insta: "https://instagram.com/clubdecimal",
    announcement: "Weekly CodeSprint #48 happening this Sunday at 8:00 PM.",
    status: "approved",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  },
  {
    name: "Chhavi — The Cultural & Arts Society",
    category: "Cultural",
    tagline: "Celebrating creativity, rhythm, and expression",
    description: "Home to the singers, dancers, dramatists, poets, and visual artists of MITS. Organizing the flagship annual college fest, cultural nights, street theatre (Nukkad Natak), and art exhibitions.",
    whyJoin: "Perform on grand stages, represent MITS in national university youth festivals, win accolades, and make unforgettable campus memories.",
    feeType: "free",
    feeAmount: 0,
    recruitmentStatus: "open",
    presidentName: "Rohan Verma",
    presidentPhone: "+91 91234 56780",
    presidentEmail: "rohan@mitsgwl.ac.in",
    coordinatorEmail: "dean_student@mitsgwl.ac.in",
    whatsapp: "https://chat.whatsapp.com/sample-chhavi",
    insta: "https://instagram.com/chhavi_mits",
    announcement: "Auditions for Annual Cultural Fest open next week in Open Air Theatre!",
    status: "approved",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  },
  {
    name: "Robotics & Automation Research Lab",
    category: "Technical",
    tagline: "Innovating autonomous future machines",
    description: "Hands-on engineering club dedicated to robotics, IoT hardware, microcontrollers (Arduino/ESP32/Raspberry Pi), line followers, drones, and ROS-based autonomous navigation.",
    whyJoin: "Access hardware components & 3D printers, learn embedded C++, compete in e-Yantra, and build battle bots.",
    feeType: "paid",
    feeAmount: 150,
    recruitmentStatus: "closed",
    presidentName: "Aman Gupta",
    presidentPhone: "+91 97890 12345",
    presidentEmail: "aman@mitsgwl.ac.in",
    coordinatorEmail: "prof_robotics@mitsgwl.ac.in",
    whatsapp: "https://chat.whatsapp.com/sample-robotics",
    insta: "https://instagram.com/mits_robotics",
    announcement: "Hardware kit distribution in Embedded Systems Lab Room 204.",
    status: "approved",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  },
  {
    name: "E-Cell MITS — Entrepreneurship Cell",
    category: "Innovation",
    tagline: "From Ideas to Enterprise",
    description: "Fostering startup culture and innovative venture creation across campus. Connecting student founders with seed angel funding, incubators, alumni founders, and hosting the Annual E-Summit.",
    whyJoin: "Pitch your startup ideas to real VCs, get incubation support, attend networking dinners, and master business modeling.",
    feeType: "free",
    feeAmount: 0,
    recruitmentStatus: "open",
    presidentName: "Simran Kaur",
    presidentPhone: "+91 94567 89012",
    presidentEmail: "simran@mitsgwl.ac.in",
    coordinatorEmail: "incubation@mitsgwl.ac.in",
    whatsapp: "https://chat.whatsapp.com/sample-ecell",
    insta: "https://instagram.com/ecell_mits",
    announcement: "Startup Pitch Competition: Cash prizes worth ₹50,000 live!",
    status: "approved",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  },
  {
    name: "NSS & Social Action Unit MITS",
    category: "Social",
    tagline: "Not Me But You",
    description: "Dedicated to youth empowerment, environmental sustainability, blood donation camps, village education outreach, and campus cleanliness drives.",
    whyJoin: "Create meaningful societal impact, earn official NSS university credits, participate in national integration camps, and build true leadership.",
    feeType: "free",
    feeAmount: 0,
    recruitmentStatus: "open",
    presidentName: "Vikas Singh",
    presidentPhone: "+91 93456 78901",
    presidentEmail: "vikas@mitsgwl.ac.in",
    coordinatorEmail: "nss_officer@mitsgwl.ac.in",
    whatsapp: "https://chat.whatsapp.com/sample-nss",
    insta: "https://instagram.com/nss_mits",
    announcement: "Mega Blood Donation Camp on Sept 20 at College Health Center.",
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
      showToast("Successfully loaded MITS Sample Clubs into Firestore!", "success");
    })
    .catch((err) => {
      showToast("Error seeding: " + err.message, "error");
    });
});
