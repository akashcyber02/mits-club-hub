/* =========================================================
   MITS CLUB HUB — app.js
   Engineered & Architected by Akash Dhakad (Team Lead & RBAC Architect)
   
   Features:
   - Multiple Photo Uploads & 3D Lightbox Gallery
   - Mandatory Privacy Login Gatekeeper Screen
   - 3D Interactive Mouse Physics & Card Tilt
   - Single Page App (SPA) Dedicated Full Club View with Hash Routing
   - Comprehensive Multi-Filter Engine (Search, Category, Fee, Status, Sort)
   - Dynamic Role-Based Access Control (Student, President, Professor)
   - Professor Approval Workflow with Custom Remarks
   - President Live Management & Real-time Broadcast
   - Rich "Kya Hai / Kyu Hai / Kaise Join Karein" A-to-Z Club Breakdown
   - MITS Sample Data Seeder with High-Res Photos
   ========================================================= */

/* global firebase, auth, db, ALLOWED_DOMAIN */

// Auto-redirect 127.0.0.1 to localhost so Firebase OAuth works out-of-the-box
if (window.location.hostname === "127.0.0.1") {
  window.location.hostname = "localhost";
}

// ---------- Gatekeeper & Views ----------
const loginGateView = document.getElementById("loginGateView");
const mainAppView = document.getElementById("mainAppView");
const gateLoginBtn = document.getElementById("gateLoginBtn");

const navLogoBtn = document.getElementById("navLogoBtn");
const homeView = document.getElementById("homeView");
const clubFullView = document.getElementById("clubFullView");
const developerPageView = document.getElementById("developerPageView");
const navDevBtn = document.getElementById("navDevBtn");
const devBackBtn = document.getElementById("devBackBtn");
const devBackToClubsLink = document.getElementById("devBackToClubsLink");

// Bilingual Language Switcher
const langToggleBtn = document.getElementById("langToggleBtn");
const langBtnText = document.getElementById("langBtnText");

// Auth & Nav Elements
const logoutBtn = document.getElementById("logoutBtn");
const userBox = document.getElementById("userBox");
const userEmailEl = document.getElementById("userEmail");
const userAvatarEl = document.getElementById("userAvatar");
const userDisplayNameEl = document.getElementById("userDisplayName");
const userProfileTrigger = document.getElementById("userProfileTrigger");
const userRoleBadge = document.getElementById("userRoleBadge");
const addClubBtn = document.getElementById("addClubBtn");
const aiAdvisorNavBtn = document.getElementById("aiAdvisorNavBtn");

// Theme Switcher (Dark / Light)
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeIcon = document.getElementById("themeIcon");

// My Clubs & Applications
const myClubsNavBtn = document.getElementById("myClubsNavBtn");
const myClubsCountBadge = document.getElementById("myClubsCountBadge");
const myClubsModal = document.getElementById("myClubsModal");
const closeMyClubsModalBtn = document.getElementById("closeMyClubsModalBtn");
const myClubsListContainer = document.getElementById("myClubsListContainer");

// Handover Gmail Dispatch Modal
const handoverGmailModal = document.getElementById("handoverGmailModal");
const closeHandoverGmailModalBtn = document.getElementById("closeHandoverGmailModalBtn");
const handoverMailRecipient = document.getElementById("handoverMailRecipient");
const prevMailTo = document.getElementById("prevMailTo");
const prevMailSubject = document.getElementById("prevMailSubject");
const prevMailBody = document.getElementById("prevMailBody");
const btnOpenGmailApp = document.getElementById("btnOpenGmailApp");
const btnOpenDefaultMail = document.getElementById("btnOpenDefaultMail");

// Collaborator Invitation Banner
const collabInviteBanner = document.getElementById("collabInviteBanner");
const collabInviteTitle = document.getElementById("collabInviteTitle");
const collabInviteDesc = document.getElementById("collabInviteDesc");
const btnAcceptCollab = document.getElementById("btnAcceptCollab");
const btnDeclineCollab = document.getElementById("btnDeclineCollab");

// Stats & Approvals
const statClubsCount = document.getElementById("statClubsCount");
const statCategoriesCount = document.getElementById("statCategoriesCount");
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
const categoryPillsContainer = document.getElementById("categoryPills");
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
const clubCategorySelect = document.getElementById("clubCategory");
const customCategoryWrap = document.getElementById("customCategoryWrap");
const customCategoryInput = document.getElementById("customCategoryInput");
const feeTypeSelect = document.getElementById("feeType");
const feeAmountInput = document.getElementById("feeAmount");
const clubPhotoFilesInput = document.getElementById("clubPhotoFiles");

// Extended Leadership inputs (Create)
const videographyLeadNameInput = document.getElementById("videographyLeadName");
const videographyLeadPhoneInput = document.getElementById("videographyLeadPhone");
const sponsorshipLeadNameInput = document.getElementById("sponsorshipLeadName");
const sponsorshipLeadPhoneInput = document.getElementById("sponsorshipLeadPhone");

// Edit Club Modal
const editClubModal = document.getElementById("editClubModal");
const closeEditModalBtn = document.getElementById("closeEditModalBtn");
const editClubForm = document.getElementById("editClubForm");
const editCategorySelect = document.getElementById("editCategory");
const editCustomCategoryWrap = document.getElementById("editCustomCategoryWrap");
const editCustomCategoryInput = document.getElementById("editCustomCategoryInput");
const editFeeType = document.getElementById("editFeeType");
const editFeeAmount = document.getElementById("editFeeAmount");
const editPhotoFilesInput = document.getElementById("editPhotoFiles");
const editGalleryThumbnails = document.getElementById("editGalleryThumbnails");
const editPhotoCount = document.getElementById("editPhotoCount");
const aiNoticeGenBtn = document.getElementById("aiNoticeGenBtn");

// Extended Leadership inputs (Edit)
const editVideographyLeadNameInput = document.getElementById("editVideographyLeadName");
const editVideographyLeadPhoneInput = document.getElementById("editVideographyLeadPhone");
const editSponsorshipLeadNameInput = document.getElementById("editSponsorshipLeadName");
const editSponsorshipLeadPhoneInput = document.getElementById("editSponsorshipLeadPhone");

// Co-Lead Management inputs (Edit)
const newCollabEmailInput = document.getElementById("newCollabEmail");
const newCollabRoleInput = document.getElementById("newCollabRole");
const btnAddCollabMember = document.getElementById("btnAddCollabMember");
const collabListContainer = document.getElementById("collabListContainer");

// Handover Tenure / Transfer Leadership
const transferNewNameInput = document.getElementById("transferNewName");
const transferNewPhoneInput = document.getElementById("transferNewPhone");
const transferNewEmailInput = document.getElementById("transferNewEmail");
const btnTransferLeadership = document.getElementById("btnTransferLeadership");

// User Profile Modal
const userProfileModal = document.getElementById("userProfileModal");
const closeUserProfileModalBtn = document.getElementById("closeUserProfileModalBtn");
const userProfileForm = document.getElementById("userProfileForm");
const profileModalAvatar = document.getElementById("profileModalAvatar");
const profileHeaderName = document.getElementById("profileHeaderName");
const profileHeaderEmail = document.getElementById("profileHeaderEmail");
const profileRoleBadge = document.getElementById("profileRoleBadge");
const profileNameInput = document.getElementById("profileNameInput");
const btnAutoCleanName = document.getElementById("btnAutoCleanName");
const profileRollInput = document.getElementById("profileRollInput");
const profileBranchInput = document.getElementById("profileBranchInput");
const profilePhoneInput = document.getElementById("profilePhoneInput");
const profile2faBadge = document.getElementById("profile2faBadge");
const btnTriggerPhone2FA = document.getElementById("btnTriggerPhone2FA");
const profileEmailInput = document.getElementById("profileEmailInput");

// 2FA Phone Verification Modal (Real Firebase SMS)
const phoneVerifyModal = document.getElementById("phoneVerifyModal");
const closePhoneVerifyModalBtn = document.getElementById("closePhoneVerifyModalBtn");
const otpTargetPhoneText = document.getElementById("otpTargetPhoneText");
const otpSmsStatusCard = document.getElementById("otpSmsStatusCard");
const otpSmsStatusDetail = document.getElementById("otpSmsStatusDetail");
const otpInputSection = document.getElementById("otpInputSection");
const otpCodeInput = document.getElementById("otpCodeInput");
const otpTimerText = document.getElementById("otpTimerText");
const btnResendOtp = document.getElementById("btnResendOtp");
const btnSendOtpCode = document.getElementById("btnSendOtpCode");
const btnConfirmOtpCode = document.getElementById("btnConfirmOtpCode");

// Interactive Contact Action Sheet Modal
const contactActionModal = document.getElementById("contactActionModal");
const closeContactActionModalBtn = document.getElementById("closeContactActionModalBtn");
const contactSheetAvatar = document.getElementById("contactSheetAvatar");
const contactSheetName = document.getElementById("contactSheetName");
const contactSheetRole = document.getElementById("contactSheetRole");
const contactSheetClub = document.getElementById("contactSheetClub");
const contactActionWa = document.getElementById("contactActionWa");
const contactActionCall = document.getElementById("contactActionCall");
const contactActionEmail = document.getElementById("contactActionEmail");
const contactActionInsta = document.getElementById("contactActionInsta");
const contactActionCallNum = document.getElementById("contactActionCallNum");
const contactActionEmailAddr = document.getElementById("contactActionEmailAddr");

// Faculty Mentor Notification Modal
const mentorNotifyModal = document.getElementById("mentorNotifyModal");
const closeMentorNotifyModalBtn = document.getElementById("closeMentorNotifyModalBtn");
const closeMentorNotifyDoneBtn = document.getElementById("closeMentorNotifyDoneBtn");
const notifyClubName = document.getElementById("notifyClubName");
const notifyProfessorEmail = document.getElementById("notifyProfessorEmail");
const notifyGmailBtn = document.getElementById("notifyGmailBtn");
const notifyWhatsAppBtn = document.getElementById("notifyWhatsAppBtn");
const notifyCopyBtn = document.getElementById("notifyCopyBtn");

// Applicants Management Modal (President Only)
const viewApplicantsModal = document.getElementById("viewApplicantsModal");
const closeApplicantsModalBtn = document.getElementById("closeApplicantsModalBtn");
const applicantsClubTitle = document.getElementById("applicantsClubTitle");
const appStatTotal = document.getElementById("appStatTotal");
const appStatPending = document.getElementById("appStatPending");
const appStatShortlisted = document.getElementById("appStatShortlisted");
const appStatApproved = document.getElementById("appStatApproved");
const appSearchInput = document.getElementById("appSearchInput");
const appStatusFilter = document.getElementById("appStatusFilter");
const btnExportApplicantsCSV = document.getElementById("btnExportApplicantsCSV");
const applicantsListWrapper = document.getElementById("applicantsListWrapper");

// Apply Membership Modal (Student)
const applyMembershipModal = document.getElementById("applyMembershipModal");
const closeApplyModalBtn = document.getElementById("closeApplyModalBtn");
const applyMembershipModalForm = document.getElementById("applyMembershipModalForm");
const applyModalClubTag = document.getElementById("applyModalClubTag");
const applyModalClubName = document.getElementById("applyModalClubName");
const applyClubId = document.getElementById("applyClubId");
const applyClubNameHidden = document.getElementById("applyClubNameHidden");
const applyPresidentEmailHidden = document.getElementById("applyPresidentEmailHidden");
const modalAppName = document.getElementById("modalAppName");
const modalAppRoll = document.getElementById("modalAppRoll");
const modalAppBranch = document.getElementById("modalAppBranch");
const modalAppPhone = document.getElementById("modalAppPhone");
const modalAppEmail = document.getElementById("modalAppEmail");
const modalAppSop = document.getElementById("modalAppSop");
const modalAppSubmitBtn = document.getElementById("modalAppSubmitBtn");

// AI Advisor Modal
const aiAdvisorModal = document.getElementById("aiAdvisorModal");
const closeAiModalBtn = document.getElementById("closeAiModalBtn");
const aiUserInput = document.getElementById("aiUserInput");
const aiRunMatchBtn = document.getElementById("aiRunMatchBtn");
const aiMatchResults = document.getElementById("aiMatchResults");
const aiClubCardsList = document.getElementById("aiClubCardsList");
const aiConfidencePill = document.getElementById("aiConfidencePill");

// Lightbox Modal
const imageLightboxModal = document.getElementById("imageLightboxModal");
const closeLightboxBtn = document.getElementById("closeLightboxBtn");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");

// State
let currentUser = null;
let currentUserProfile = null;
let currentLanguage = localStorage.getItem("mits_club_lang") || "en";
let allApprovedClubs = [];
let activeCategory = "all";
let currentEditingClubPhotos = [];
let currentEditingClubCollabs = [];
let currentManagingClub = null;
let currentClubApplications = [];
let pendingCollabClub = null;
let currentGeneratedOtp = null;
let otpCountdownInterval = null;
let unsubApplicants = null;
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
   2. IMAGE LIGHTBOX VIEWER
   ========================================================= */
function openLightbox(imgUrl, caption = "") {
  if (!imgUrl) return;
  lightboxImg.src = imgUrl;
  lightboxCaption.textContent = caption;
  imageLightboxModal.classList.remove("hidden");
}

if (closeLightboxBtn) {
  closeLightboxBtn.addEventListener("click", () => {
    imageLightboxModal.classList.add("hidden");
  });
}

if (imageLightboxModal) {
  imageLightboxModal.addEventListener("click", (e) => {
    if (e.target === imageLightboxModal) {
      imageLightboxModal.classList.add("hidden");
    }
  });
}

/* =========================================================
   2.0 THEME ENGINE (DARK / LIGHT MODE)
   ========================================================= */
let currentTheme = localStorage.getItem("mits_theme") || "dark";

function applyTheme(theme) {
  currentTheme = theme;
  localStorage.setItem("mits_theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
  document.body.setAttribute("data-theme", theme);

  if (theme === "light") {
    document.documentElement.classList.add("light-theme");
    document.documentElement.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme");
  } else {
    document.documentElement.classList.add("dark-theme");
    document.documentElement.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme");
  }

  const icons = [document.getElementById("themeIcon"), document.getElementById("gateThemeIcon")];
  icons.forEach(ico => {
    if (ico) {
      if (theme === "light") {
        ico.className = "fa-solid fa-sun";
        ico.style.color = "#d97706";
      } else {
        ico.className = "fa-solid fa-moon";
        ico.style.color = "#fbbf24";
      }
    }
  });
}

function toggleThemeMode() {
  const nextTheme = (currentTheme === "dark") ? "light" : "dark";
  applyTheme(nextTheme);
  showToast(nextTheme === "dark" ? "🌙 Switched to Cyber Dark Mode" : "☀️ Switched to Clean Light Mode", "info");
}

// Apply saved theme immediately
applyTheme(currentTheme);

if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleThemeMode);
const gateThemeBtn = document.getElementById("gateThemeToggleBtn");
if (gateThemeBtn) gateThemeBtn.addEventListener("click", toggleThemeMode);

// Wipe Demo Sample Data Action (For Production Deployment)
const btnWipeDemoData = document.getElementById("btnWipeDemoData");
if (btnWipeDemoData) {
  btnWipeDemoData.addEventListener("click", async () => {
    const confirmed = confirm("⚠️ WIPE DEMO SAMPLE DATA\n\nAre you sure you want to permanently delete all sample demo clubs from Firestore?\n\nThis will purge sample clubs and make your database 100% clean for real student club registrations.");
    if (!confirmed) return;

    try {
      btnWipeDemoData.disabled = true;
      btnWipeDemoData.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Wiping Demo Clubs...`;

      const snap = await db.collection("clubs").get();
      const batch = db.batch();
      let count = 0;

      snap.forEach(doc => {
        const data = doc.data() || {};
        const name = data.name || "";
        if (
          doc.id.startsWith("mits_sample_") ||
          name.includes("GDSC MITS") ||
          name.includes("Club Decimal") ||
          name.includes("Chhavi") ||
          name.includes("Robotics & Automation Research") ||
          name.includes("E-Cell MITS") ||
          name.includes("NSS & Social Action")
        ) {
          batch.delete(doc.ref);
          count++;
        }
      });

      if (count > 0) {
        await batch.commit();
        showToast(`✨ Successfully deleted ${count} demo sample clubs! Database is clean for real clubs.`, "success");
      } else {
        showToast("No demo sample clubs found. Database is already clean!", "info");
      }
    } catch (err) {
      showToast("Error wiping demo data: " + err.message, "error");
    } finally {
      btnWipeDemoData.disabled = false;
      btnWipeDemoData.innerHTML = `<i class="fa-solid fa-trash-can"></i> Wipe All Demo Sample Clubs`;
    }
  });
}

/* =========================================================
   2.1 BILINGUAL ENGINE (ENGLISH / हिन्दी)
   ========================================================= */
const translations = {
  en: {
    langBtnText: "हिन्दी",
    navSubtitle: "Madhav Institute of Technology & Science",
    lblAddClubBtn: "+ New Club",
    lblLogoutBtn: "Logout",
    lblMyClubsBtn: "My Clubs",
    myClubsModalHeading: "My Clubs & Applications",
    myClubsModalSub: "Track your active memberships, review application statuses, or leave a club.",
    heroBadgePill: '<span class="badge-sparkle"><i class="fa-solid fa-bolt"></i></span> Official MITS Campus Life Platform',
    heroTitle: 'Explore, Lead & Dominate In <span class="text-gradient">MITS Clubs</span>',
    heroSubtitle: "From cutting-edge Tech hackathons and Cultural fests to Sports, E-Cell & Social initiatives — discover everything happening in college in one ultra-modern hub.",
    lblStatClubs: "Active Clubs",
    lblStatCategories: "Categories",
    lblStatRecruiting: "Recruiting Now",
    searchPlaceholder: "Search clubs by name, keywords, president, domains...",
    lblResetFilters: "Reset",
    lblFeeFilter: "Fee Status",
    lblRecruitFilter: "Recruitment",
    lblSortFilter: "Sort By",
    dirHeading: '<i class="fa-solid fa-compass"></i> Official Clubs Directory',
    lblSeedBtn: "Seed MITS Sample Data",
    emptyHeading: "No matching college clubs found",
    emptySub: "Try adjusting your search query, clearing filters, or exploring other categories.",
    devBackBtn: '<i class="fa-solid fa-arrow-left"></i> Back to Clubs Hub',
    lblCreateClubDesc: "📖 Club Mission & Overview *",
    lblCreateClubWhy: "🎯 Why Join & Key Benefits *",
    lblEditClubDesc: "📖 Club Mission & Overview",
    lblEditClubWhy: "🎯 Vision & Why Join (Key Benefits)"
  },
  hi: {
    langBtnText: "English",
    navSubtitle: "माधव इंस्टीट्यूट ऑफ टेक्नोलॉजी एंड साइंस",
    lblAddClubBtn: "+ नया क्लब बनाएं",
    lblLogoutBtn: "लॉगआउट",
    lblMyClubsBtn: "मेरे क्लब",
    myClubsModalHeading: "मेरे क्लब और आवेदन",
    myClubsModalSub: "अपनी सक्रिय सदस्यताएँ देखें, आवेदन की स्थिति ट्रैक करें या क्लब छोड़ें।",
    heroBadgePill: '<span class="badge-sparkle"><i class="fa-solid fa-bolt"></i></span> आधिकारिक एमआईटीएस कैंपस लाइफ प्लेटफॉर्म',
    heroTitle: 'एमआईटीएस क्लब्स में <span class="text-gradient">एक्सप्लोर करें और लीड करें</span>',
    heroSubtitle: "टेक हैकथॉन और कल्चरल फेस्ट से लेकर स्पोर्ट्स, ई-सेल और सोशल इनिशिएटिव तक — कॉलेज की हर गतिविधि एक ही आधुनिक हब में देखें।",
    lblStatClubs: "सक्रिय क्लब्स",
    lblStatCategories: "श्रेणियां",
    lblStatRecruiting: "भर्ती जारी है",
    searchPlaceholder: "क्लब का नाम, कीवर्ड, अध्यक्ष या डोमेन खोजें...",
    lblResetFilters: "रीसेट",
    lblFeeFilter: "शुल्क स्थिति",
    lblRecruitFilter: "भर्ती स्थिति",
    lblSortFilter: "क्रमबद्ध करें",
    dirHeading: '<i class="fa-solid fa-compass"></i> आधिकारिक क्लब निर्देशिका',
    lblSeedBtn: "सैंपल डेटा लोड करें",
    emptyHeading: "कोई क्लब नहीं मिला",
    emptySub: "कृपया अपना सर्च शब्द बदलें या फिल्टर रीसेट करें।",
    devBackBtn: '<i class="fa-solid fa-arrow-left"></i> क्लब हब पर वापस जाएं',
    lblCreateClubDesc: "📖 क्लब का उद्देश्य और विवरण *",
    lblCreateClubWhy: "🎯 क्लब क्यों ज्वाइन करें और क्या फायदे हैं *",
    lblEditClubDesc: "📖 क्लब का उद्देश्य और विवरण",
    lblEditClubWhy: "🎯 क्लब क्यों ज्वाइन करें और क्या फायदे हैं"
  }
};

function applyLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem("mits_club_lang", lang);
  const t = translations[lang] || translations.en;

  if (langBtnText) langBtnText.textContent = t.langBtnText;
  
  const navSub = document.getElementById("navSubtitle");
  if (navSub) navSub.textContent = t.navSubtitle;

  const lblAdd = document.getElementById("lblAddClubBtn");
  if (lblAdd) lblAdd.textContent = t.lblAddClubBtn;

  const lblLog = document.getElementById("lblLogoutBtn");
  if (lblLog) lblLog.textContent = t.lblLogoutBtn;

  const lblMy = document.getElementById("lblMyClubsBtn");
  if (lblMy) lblMy.textContent = t.lblMyClubsBtn;

  const myModalH = document.getElementById("myClubsModalHeading");
  if (myModalH) myModalH.textContent = t.myClubsModalHeading;

  const myModalS = document.getElementById("myClubsModalSub");
  if (myModalS) myModalS.textContent = t.myClubsModalSub;

  const hBadge = document.getElementById("heroBadgePill");
  if (hBadge) hBadge.innerHTML = t.heroBadgePill;

  const hTitle = document.getElementById("heroTitle");
  if (hTitle) hTitle.innerHTML = t.heroTitle;

  const hSub = document.getElementById("heroSubtitle");
  if (hSub) hSub.textContent = t.heroSubtitle;

  const lblClubs = document.getElementById("lblStatClubs");
  if (lblClubs) lblClubs.textContent = t.lblStatClubs;

  const lblCats = document.getElementById("lblStatCategories");
  if (lblCats) lblCats.textContent = t.lblStatCategories;

  const lblRec = document.getElementById("lblStatRecruiting");
  if (lblRec) lblRec.textContent = t.lblStatRecruiting;

  if (searchInput) searchInput.placeholder = t.searchPlaceholder;

  const lblRes = document.getElementById("lblResetFilters");
  if (lblRes) lblRes.textContent = t.lblResetFilters;

  const lblFee = document.getElementById("lblFeeFilter");
  if (lblFee) lblFee.textContent = t.lblFeeFilter;

  const lblRecF = document.getElementById("lblRecruitFilter");
  if (lblRecF) lblRecF.textContent = t.lblRecruitFilter;

  const lblSort = document.getElementById("lblSortFilter");
  if (lblSort) lblSort.textContent = t.lblSortFilter;

  const dHead = document.getElementById("dirHeading");
  if (dHead) dHead.innerHTML = t.dirHeading;

  const lblSeed = document.getElementById("lblSeedBtn");
  if (lblSeed) lblSeed.textContent = t.lblSeedBtn;

  const eHead = document.getElementById("emptyHeading");
  if (eHead) eHead.textContent = t.emptyHeading;

  const eSub = document.getElementById("emptySub");
  if (eSub) eSub.textContent = t.emptySub;

  const dBack = document.getElementById("devBackBtn");
  if (dBack) dBack.innerHTML = t.devBackBtn;

  const lblCDesc = document.getElementById("lblCreateClubDesc");
  if (lblCDesc) lblCDesc.textContent = t.lblCreateClubDesc;

  const lblCWhy = document.getElementById("lblCreateClubWhy");
  if (lblCWhy) lblCWhy.textContent = t.lblCreateClubWhy;

  const lblEDesc = document.getElementById("lblEditClubDesc");
  if (lblEDesc) lblEDesc.textContent = t.lblEditClubDesc;

  const lblEWhy = document.getElementById("lblEditClubWhy");
  if (lblEWhy) lblEWhy.textContent = t.lblEditClubWhy;

  // Re-render full club view if active
  if (window.location.hash.startsWith("#club/")) {
    const clubId = window.location.hash.replace("#club/", "");
    const club = allApprovedClubs.find(c => c.id === clubId);
    if (club) renderFullClubView(club);
  }
}

if (langToggleBtn) {
  langToggleBtn.addEventListener("click", () => {
    const nextLang = (currentLanguage === "en") ? "hi" : "en";
    applyLanguage(nextLang);
    showToast(nextLang === "hi" ? "भाषा बदलकर हिन्दी कर दी गई है।" : "Switched language to English.", "info");
  });
}

/* =========================================================
   2.2 NAME CLEANER & SANITIZER
   ========================================================= */
function sanitizeGoogleName(rawName) {
  if (!rawName) return "Student";
  // Remove college enrollment prefixes such as "0901AI231001 Akash", "BTAI26O1009 Akash Dhakad", "26AI1AK9" etc.
  const cleaned = rawName.replace(/^(BTAI|0901|BTCS|BTME|BTEE|BTIT|BTCSE|[0-9]{4}[A-Z]{2,4}[0-9]{2,8})\s*[-:_]?\s*/i, '').trim();
  return cleaned || rawName;
}

/* =========================================================
   2.3 USER PROFILE & 2FA VERIFICATION SYSTEM
   ========================================================= */
function loadUserProfile(user) {
  if (!user) return;
  const cleanName = sanitizeGoogleName(user.displayName || user.email.split("@")[0]);
  
  // Update Navbar UI
  if (userDisplayNameEl) userDisplayNameEl.textContent = cleanName;
  if (userAvatarEl) {
    if (user.photoURL) {
      userAvatarEl.innerHTML = `<img src="${user.photoURL}" alt="${cleanName}" onerror="this.parentElement.textContent='${cleanName.charAt(0).toUpperCase()}';" />`;
    } else {
      userAvatarEl.textContent = cleanName.charAt(0).toUpperCase();
    }
  }

  // Load Firestore / LocalStorage profile
  const storedProfile = localStorage.getItem(`mits_profile_${user.email}`);
  if (storedProfile) {
    try {
      currentUserProfile = JSON.parse(storedProfile);
      if (currentUserProfile.cleanName && userDisplayNameEl) {
        userDisplayNameEl.textContent = currentUserProfile.cleanName;
      }
    } catch (e) {}
  }

  // Fetch from Firestore
  db.collection("users").doc(user.email).get().then(doc => {
    if (doc.exists) {
      currentUserProfile = doc.data();
      localStorage.setItem(`mits_profile_${user.email}`, JSON.stringify(currentUserProfile));
      if (currentUserProfile.cleanName && userDisplayNameEl) {
        userDisplayNameEl.textContent = currentUserProfile.cleanName;
      }
    }
  }).catch(() => {});
}

function openUserProfileModal() {
  if (!currentUser) return;
  const cleanName = (currentUserProfile && currentUserProfile.cleanName) || sanitizeGoogleName(currentUser.displayName || currentUser.email.split("@")[0]);
  
  if (profileHeaderName) profileHeaderName.textContent = cleanName;
  if (profileHeaderEmail) profileHeaderEmail.textContent = currentUser.email;
  if (profileEmailInput) profileEmailInput.value = currentUser.email;
  if (profileNameInput) profileNameInput.value = cleanName;
  
  if (profileModalAvatar) {
    if (currentUser.photoURL) {
      profileModalAvatar.innerHTML = `<img src="${currentUser.photoURL}" alt="${cleanName}" onerror="this.parentElement.textContent='${cleanName.charAt(0).toUpperCase()}';" />`;
    } else {
      profileModalAvatar.textContent = cleanName.charAt(0).toUpperCase();
    }
  }

  if (currentUserProfile) {
    if (profileRollInput) profileRollInput.value = currentUserProfile.rollNo || "";
    if (profileBranchInput) profileBranchInput.value = currentUserProfile.branch || "";
    if (profilePhoneInput) profilePhoneInput.value = currentUserProfile.phone || "";
    
    if (profile2faBadge) {
      if (currentUserProfile.isPhoneVerified) {
        profile2faBadge.className = "badge-2fa-verified";
        profile2faBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> 2FA Verified`;
      } else {
        profile2faBadge.className = "badge-2fa-unverified";
        profile2faBadge.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> 2FA Unverified`;
      }
    }
  } else {
    if (profileRollInput) profileRollInput.value = "";
    if (profileBranchInput) profileBranchInput.value = "";
    if (profilePhoneInput) profilePhoneInput.value = "";
    if (profile2faBadge) {
      profile2faBadge.className = "badge-2fa-unverified";
      profile2faBadge.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> 2FA Unverified`;
    }
  }

  if (userProfileModal) userProfileModal.classList.remove("hidden");
}

if (userProfileTrigger) {
  userProfileTrigger.addEventListener("click", openUserProfileModal);
}

if (closeUserProfileModalBtn) {
  closeUserProfileModalBtn.addEventListener("click", () => {
    if (userProfileModal) userProfileModal.classList.add("hidden");
  });
}

if (btnAutoCleanName) {
  btnAutoCleanName.addEventListener("click", () => {
    if (profileNameInput && currentUser) {
      const clean = sanitizeGoogleName(currentUser.displayName || profileNameInput.value);
      profileNameInput.value = clean;
      showToast("Cleaned college roll/enrollment prefixes from your name!", "success");
    }
  });
}

if (userProfileForm) {
  userProfileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const updatedProfile = {
      email: currentUser.email,
      cleanName: profileNameInput.value.trim() || sanitizeGoogleName(currentUser.displayName),
      rollNo: profileRollInput.value.trim(),
      branch: profileBranchInput.value.trim(),
      phone: profilePhoneInput.value.trim(),
      isPhoneVerified: currentUserProfile ? !!currentUserProfile.isPhoneVerified : false,
      photoURL: currentUser.photoURL || "",
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
      await db.collection("users").doc(currentUser.email).set(updatedProfile, { merge: true });
      currentUserProfile = updatedProfile;
      localStorage.setItem(`mits_profile_${currentUser.email}`, JSON.stringify(updatedProfile));
      if (userDisplayNameEl) userDisplayNameEl.textContent = updatedProfile.cleanName;
      showToast("Student profile successfully saved & updated!", "success");
      if (userProfileModal) userProfileModal.classList.add("hidden");
    } catch (err) {
      showToast("Could not save profile: " + err.message, "error");
    }
  });
}

// Helper: Format raw input to standard E.164 (+91 for India)
function formatPhoneToE164(rawPhone) {
  if (!rawPhone) return "";
  let clean = rawPhone.trim().replace(/[^\d+]/g, "");
  if (clean.startsWith("+")) {
    return clean;
  }
  if (clean.startsWith("0")) {
    clean = clean.substring(1);
  }
  if (clean.length === 10) {
    return `+91${clean}`;
  }
  if (clean.startsWith("91") && clean.length === 12) {
    return `+${clean}`;
  }
  return `+91${clean}`;
}

// Helper: Get or initialize Invisible Firebase RecaptchaVerifier
function resetRecaptchaVerifier() {
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (e) {
      console.warn("Recaptcha clear error:", e);
    }
    window.recaptchaVerifier = null;
  }
  const container = document.getElementById("recaptcha-container");
  if (container) {
    container.innerHTML = "";
  }
}

function getOrCreateRecaptchaVerifier() {
  const container = document.getElementById("recaptcha-container");
  if (window.recaptchaVerifier) {
    return window.recaptchaVerifier;
  }
  if (container) {
    container.innerHTML = "";
  }
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
    size: "invisible",
    callback: (response) => {
      // reCAPTCHA solved
    },
    "expired-callback": () => {
      showToast("reCAPTCHA session expired. Please click Send SMS again.", "error");
      resetRecaptchaVerifier();
    }
  });
  return window.recaptchaVerifier;
}

// 2FA Phone Verification Trigger
if (btnTriggerPhone2FA) {
  btnTriggerPhone2FA.addEventListener("click", () => {
    const rawPhone = profilePhoneInput ? profilePhoneInput.value.trim() : "";
    if (!rawPhone) {
      showToast("Please enter your WhatsApp/phone number first!", "error");
      if (profilePhoneInput) profilePhoneInput.focus();
      return;
    }

    const formattedPhone = formatPhoneToE164(rawPhone);
    if (!formattedPhone || formattedPhone.length < 12) {
      showToast("Please enter a valid 10-digit mobile number!", "error");
      if (profilePhoneInput) profilePhoneInput.focus();
      return;
    }

    resetRecaptchaVerifier();
    if (otpTargetPhoneText) otpTargetPhoneText.textContent = formattedPhone;
    if (otpCodeInput) otpCodeInput.value = "";
    if (otpSmsStatusCard) otpSmsStatusCard.classList.add("hidden");
    if (otpInputSection) otpInputSection.classList.add("hidden");
    if (btnSendOtpCode) {
      btnSendOtpCode.classList.remove("hidden");
      btnSendOtpCode.disabled = false;
      btnSendOtpCode.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send SMS OTP`;
    }
    if (btnConfirmOtpCode) btnConfirmOtpCode.classList.add("hidden");
    if (btnResendOtp) btnResendOtp.classList.add("hidden");

    if (phoneVerifyModal) phoneVerifyModal.classList.remove("hidden");
  });
}

if (closePhoneVerifyModalBtn) {
  closePhoneVerifyModalBtn.addEventListener("click", () => {
    if (phoneVerifyModal) phoneVerifyModal.classList.add("hidden");
    if (otpCountdownInterval) clearInterval(otpCountdownInterval);
    resetRecaptchaVerifier();
  });
}

function startOtpTimer() {
  let seconds = 60;
  if (otpTimerText) otpTimerText.innerHTML = `Resend SMS in <strong>${seconds}s</strong>`;
  if (btnResendOtp) btnResendOtp.classList.add("hidden");

  if (otpCountdownInterval) clearInterval(otpCountdownInterval);
  otpCountdownInterval = setInterval(() => {
    seconds--;
    if (seconds <= 0) {
      clearInterval(otpCountdownInterval);
      if (otpTimerText) otpTimerText.textContent = "Didn't receive the SMS?";
      if (btnResendOtp) {
        btnResendOtp.classList.remove("hidden");
        btnResendOtp.disabled = false;
      }
    } else {
      if (otpTimerText) otpTimerText.innerHTML = `Resend SMS in <strong>${seconds}s</strong>`;
    }
  }, 1000);
}

// Send Real Telecom SMS OTP via Google Firebase Phone Auth
async function sendVerificationOtp() {
  const rawPhone = profilePhoneInput ? profilePhoneInput.value.trim() : "";
  const formattedPhone = formatPhoneToE164(rawPhone);

  if (!formattedPhone || formattedPhone.length < 12) {
    showToast("Please enter a valid 10-digit mobile number!", "error");
    return;
  }

  if (btnSendOtpCode) {
    btnSendOtpCode.disabled = true;
    btnSendOtpCode.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Dispatching SMS...`;
  }
  if (btnResendOtp) {
    btnResendOtp.disabled = true;
  }

  try {
    let appVerifier = getOrCreateRecaptchaVerifier();
    let confirmationResult;
    try {
      confirmationResult = await auth.signInWithPhoneNumber(formattedPhone, appVerifier);
    } catch (innerErr) {
      if (innerErr.message && innerErr.message.includes("already been rendered")) {
        console.warn("reCAPTCHA already rendered detected, resetting & retrying...");
        resetRecaptchaVerifier();
        appVerifier = getOrCreateRecaptchaVerifier();
        confirmationResult = await auth.signInWithPhoneNumber(formattedPhone, appVerifier);
      } else {
        throw innerErr;
      }
    }

    window.confirmationResult = confirmationResult;

    startOtpTimer();

    if (otpSmsStatusCard) otpSmsStatusCard.classList.remove("hidden");
    if (otpSmsStatusDetail) {
      otpSmsStatusDetail.textContent = `6-digit code has been delivered via SMS to ${formattedPhone}. Check your messages inbox.`;
    }
    if (otpInputSection) otpInputSection.classList.remove("hidden");
    if (btnSendOtpCode) btnSendOtpCode.classList.add("hidden");
    if (btnConfirmOtpCode) {
      btnConfirmOtpCode.classList.remove("hidden");
      btnConfirmOtpCode.disabled = false;
      btnConfirmOtpCode.innerHTML = `<i class="fa-solid fa-circle-check"></i> Verify & Confirm`;
    }
    if (otpCodeInput) {
      otpCodeInput.value = "";
      otpCodeInput.focus();
    }

    showToast(`📱 Real SMS OTP sent to ${formattedPhone}!`, "success");
  } catch (error) {
    console.error("Firebase Phone Auth Error:", error);
    resetRecaptchaVerifier();
    if (btnSendOtpCode) {
      btnSendOtpCode.disabled = false;
      btnSendOtpCode.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send SMS OTP`;
    }
    if (btnResendOtp) btnResendOtp.disabled = false;

    if (error.code === "auth/operation-not-allowed") {
      showToast("⚠️ Phone Auth is disabled in Firebase Console! Please enable 'Phone' in Firebase Console > Authentication > Sign-in method.", "error");
    } else if (error.code === "auth/invalid-phone-number") {
      showToast("❌ Invalid phone number. Please enter a valid 10-digit mobile number (+91).", "error");
    } else if (error.code === "auth/quota-exceeded") {
      showToast("⚠️ SMS quota exceeded for today. Please try again later.", "error");
    } else if (error.code === "auth/captcha-check-failed") {
      showToast("reCAPTCHA check failed. Please click Send SMS again.", "error");
    } else {
      showToast("SMS delivery error: " + (error.message || error.code), "error");
    }
  }
}

if (btnSendOtpCode) btnSendOtpCode.addEventListener("click", sendVerificationOtp);
if (btnResendOtp) btnResendOtp.addEventListener("click", sendVerificationOtp);

// Confirm Real SMS OTP
if (btnConfirmOtpCode) {
  btnConfirmOtpCode.addEventListener("click", async () => {
    const entered = (otpCodeInput ? otpCodeInput.value.trim() : "");
    if (!entered || entered.length !== 6) {
      showToast("Please enter the complete 6-digit SMS OTP code!", "error");
      return;
    }

    if (!window.confirmationResult) {
      showToast("Please request an SMS OTP first.", "error");
      return;
    }

    if (btnConfirmOtpCode) {
      btnConfirmOtpCode.disabled = true;
      btnConfirmOtpCode.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Verifying Code...`;
    }

    try {
      // Validate OTP with Firebase server
      await window.confirmationResult.confirm(entered);

      if (otpCountdownInterval) clearInterval(otpCountdownInterval);
      
      const rawPhone = profilePhoneInput ? profilePhoneInput.value.trim() : "";
      const formattedPhone = formatPhoneToE164(rawPhone);

      // Save verified status in Firestore
      if (currentUser) {
        await db.collection("users").doc(currentUser.email).set({
          isPhoneVerified: true,
          phone: formattedPhone,
          phoneVerifiedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        if (!currentUserProfile) currentUserProfile = {};
        currentUserProfile.isPhoneVerified = true;
        currentUserProfile.phone = formattedPhone;
        localStorage.setItem(`mits_profile_${currentUser.email}`, JSON.stringify(currentUserProfile));

        if (profile2faBadge) {
          profile2faBadge.className = "badge-2fa-verified";
          profile2faBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> 2FA Verified`;
        }

        showToast("🎉 Phone number verified successfully via Real SMS OTP!", "success");
        if (phoneVerifyModal) phoneVerifyModal.classList.add("hidden");
      }
    } catch (error) {
      console.error("Firebase OTP Verification Error:", error);
      if (error.code === "auth/invalid-verification-code") {
        showToast("❌ Invalid 6-digit SMS code. Please check your SMS inbox and re-enter.", "error");
      } else if (error.code === "auth/code-expired") {
        showToast("⌛ Verification code expired. Please click 'Resend SMS'.", "error");
      } else {
        showToast("Verification failed: " + (error.message || error.code), "error");
      }
    } finally {
      if (btnConfirmOtpCode) {
        btnConfirmOtpCode.disabled = false;
        btnConfirmOtpCode.innerHTML = `<i class="fa-solid fa-circle-check"></i> Verify & Confirm`;
      }
    }
  });
}

/* =========================================================
   2.4 INTERACTIVE CONTACT ACTION SHEET
   ========================================================= */
function openContactSheet({ name, role, clubName, phone, email, insta }) {
  if (contactSheetName) contactSheetName.textContent = name || "Club Leader";
  if (contactSheetRole) contactSheetRole.textContent = role || "Core Leadership";
  if (contactSheetClub) contactSheetClub.textContent = clubName || "MITS Club Hub";

  const cleanPhone = (phone || "").replace(/[^0-9]/g, "");

  if (contactActionWa) {
    if (phone) {
      contactActionWa.href = `https://wa.me/91${cleanPhone}?text=Namaste%20${encodeURIComponent(name || 'Leader')},%20connecting%20via%20MITS%20Club%20Hub%20regarding%20${encodeURIComponent(clubName || 'the club')}.`;
      contactActionWa.classList.remove("hidden");
    } else {
      contactActionWa.classList.add("hidden");
    }
  }

  if (contactActionCall) {
    if (phone) {
      contactActionCall.href = `tel:${phone}`;
      if (contactActionCallNum) contactActionCallNum.textContent = phone;
      contactActionCall.classList.remove("hidden");
    } else {
      contactActionCall.classList.add("hidden");
    }
  }

  if (contactActionEmail) {
    if (email) {
      contactActionEmail.href = `mailto:${email}?subject=Regarding%20${encodeURIComponent(clubName || 'MITS Club')}`;
      if (contactActionEmailAddr) contactActionEmailAddr.textContent = email;
      contactActionEmail.classList.remove("hidden");
    } else {
      contactActionEmail.classList.add("hidden");
    }
  }

  if (contactActionInsta) {
    if (insta) {
      contactActionInsta.href = insta;
      contactActionInsta.classList.remove("hidden");
    } else {
      contactActionInsta.classList.add("hidden");
    }
  }

  if (contactActionModal) contactActionModal.classList.remove("hidden");
}

if (closeContactActionModalBtn) {
  closeContactActionModalBtn.addEventListener("click", () => {
    if (contactActionModal) contactActionModal.classList.add("hidden");
  });
}

/* =========================================================
   2.5 LEADERSHIP HANDOVER & COLLABORATOR INVITATION LISTENER
   ========================================================= */
let pendingInvitationType = "collab"; // "president_handover" | "collab"
let pendingInviteData = null;

function checkCollaboratorInvitations(userEmail) {
  if (!userEmail) return;
  
  db.collection("clubs")
    .where("status", "==", "approved")
    .get()
    .then((snap) => {
      let foundHandoverClub = null;
      let foundCollabClub = null;
      let userRoleInClub = "Co-Lead";

      snap.forEach(doc => {
        const club = doc.data();
        // 1. Check for Pending President Handover
        if (club.pendingPresidentEmail && club.pendingPresidentEmail.toLowerCase() === userEmail.toLowerCase()) {
          foundHandoverClub = { id: doc.id, ...club };
        }

        // 2. Check for Co-Lead / Core Team Member authorization
        if (club.collaborators && Array.isArray(club.collaborators)) {
          const collabEntry = club.collaborators.find(c => {
            const email = (typeof c === "string") ? c : c.email;
            return (email || "").toLowerCase() === userEmail.toLowerCase();
          });
          if (collabEntry) {
            foundCollabClub = { id: doc.id, ...club };
            userRoleInClub = (typeof collabEntry === "object" && collabEntry.role) ? collabEntry.role : "Core Team Member";
          }
        }
      });

      if (foundHandoverClub) {
        pendingInvitationType = "president_handover";
        pendingCollabClub = foundHandoverClub;
        pendingInviteData = foundHandoverClub;
        if (collabInviteTitle) collabInviteTitle.innerHTML = `<span style="color: #fbbf24;">👑 President Handover:</span> ${foundHandoverClub.name}`;
        if (collabInviteDesc) collabInviteDesc.textContent = `${foundHandoverClub.pendingTransferByName || 'The Previous President'} has nominated you to take over as the Official Club President & Administrator.`;
        if (btnAcceptCollab) btnAcceptCollab.innerHTML = `<i class="fa-solid fa-crown"></i> Accept & Assume Presidency`;
        if (collabInviteBanner) collabInviteBanner.classList.remove("hidden");
      } else if (foundCollabClub && !localStorage.getItem(`dismiss_collab_${foundCollabClub.id}_${userEmail}`)) {
        pendingInvitationType = "collab";
        pendingCollabClub = foundCollabClub;
        pendingInviteData = foundCollabClub;
        if (collabInviteTitle) collabInviteTitle.textContent = `Leadership Role: ${foundCollabClub.name}`;
        if (collabInviteDesc) collabInviteDesc.textContent = `You have been authorized as "${userRoleInClub}" with applicant management & editing rights.`;
        if (btnAcceptCollab) btnAcceptCollab.innerHTML = `<i class="fa-solid fa-check"></i> Accept & Join Core Team`;
        if (collabInviteBanner) collabInviteBanner.classList.remove("hidden");
      } else {
        if (collabInviteBanner) collabInviteBanner.classList.add("hidden");
      }
    }).catch((err) => {
      console.warn("Could not check leadership invitations:", err);
    });
}

if (btnAcceptCollab) {
  btnAcceptCollab.addEventListener("click", async () => {
    if (!pendingCollabClub || !currentUser) return;

    if (pendingInvitationType === "president_handover") {
      try {
        btnAcceptCollab.disabled = true;
        btnAcceptCollab.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Transferring Presidency...`;

        await db.collection("clubs").doc(pendingCollabClub.id).update({
          presidentEmail: currentUser.email,
          presidentName: (currentUserProfile && currentUserProfile.cleanName) || currentUser.displayName || pendingCollabClub.pendingPresidentName || "President",
          presidentPhone: pendingCollabClub.pendingPresidentPhone || (currentUserProfile ? currentUserProfile.phone : "") || "",
          pendingPresidentEmail: firebase.firestore.FieldValue.delete(),
          pendingPresidentName: firebase.firestore.FieldValue.delete(),
          pendingPresidentPhone: firebase.firestore.FieldValue.delete(),
          pendingTransferBy: firebase.firestore.FieldValue.delete(),
          pendingTransferByName: firebase.firestore.FieldValue.delete(),
          transferredAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        await db.collection("leadershipInvitations").doc(`${pendingCollabClub.id}_${currentUser.email}`).update({
          status: "Accepted",
          acceptedAt: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(() => {});

        if (collabInviteBanner) collabInviteBanner.classList.add("hidden");
        showToast(`🎉 Congratulations! You are now the Official President of ${pendingCollabClub.name}!`, "success");
        if (userRoleBadge) {
          userRoleBadge.textContent = "👑 Club President";
          userRoleBadge.style.color = "#fbbf24";
        }
      } catch (err) {
        showToast("Failed to accept handover: " + err.message, "error");
      } finally {
        btnAcceptCollab.disabled = false;
      }
    } else {
      localStorage.setItem(`dismiss_collab_${pendingCollabClub.id}_${currentUser.email}`, "accepted");
      if (collabInviteBanner) collabInviteBanner.classList.add("hidden");
      showToast(`🎉 Accepted leadership access for ${pendingCollabClub.name}!`, "success");
      if (userRoleBadge) {
        userRoleBadge.textContent = "⭐ Core Leadership";
        userRoleBadge.style.color = "#38bdf8";
      }
    }
  });
}

if (btnDeclineCollab) {
  btnDeclineCollab.addEventListener("click", async () => {
    if (!pendingCollabClub || !currentUser) return;

    if (pendingInvitationType === "president_handover") {
      try {
        await db.collection("clubs").doc(pendingCollabClub.id).update({
          pendingPresidentEmail: firebase.firestore.FieldValue.delete(),
          pendingPresidentName: firebase.firestore.FieldValue.delete(),
          pendingPresidentPhone: firebase.firestore.FieldValue.delete(),
          pendingTransferBy: firebase.firestore.FieldValue.delete(),
          pendingTransferByName: firebase.firestore.FieldValue.delete()
        });

        await db.collection("leadershipInvitations").doc(`${pendingCollabClub.id}_${currentUser.email}`).update({
          status: "Declined",
          declinedAt: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(() => {});

        if (collabInviteBanner) collabInviteBanner.classList.add("hidden");
        showToast("Handover invitation declined.", "info");
      } catch (err) {
        showToast("Error declining: " + err.message, "error");
      }
    } else {
      localStorage.setItem(`dismiss_collab_${pendingCollabClub.id}_${currentUser.email}`, "declined");
      if (collabInviteBanner) collabInviteBanner.classList.add("hidden");
      showToast("Invitation dismissed.", "info");
    }
  });
}


// Compress & Read files to Base64
async function readFilesAsDataURLs(fileList) {
  const files = Array.from(fileList || []);
  const readPromises = files.map(file => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Compress image using canvas
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxDim = 800;
          let width = img.width;
          let height = img.height;
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.75));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  });

  return Promise.all(readPromises);
}

/* =========================================================
   DATE & REGISTRATION DEADLINE HELPERS
   ========================================================= */

function formatDatePretty(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const y = parts[0];
  const m = months[parseInt(parts[1], 10) - 1] || parts[1];
  const d = parseInt(parts[2], 10);
  return `${d} ${m} ${y}`;
}

function getDeadlineStatus(deadlineStr) {
  if (!deadlineStr) {
    return { hasDeadline: false, isExpired: false, isToday: false, daysLeft: 0, text: "", badgeHtml: "" };
  }
  const deadlineDate = new Date(deadlineStr + "T23:59:59");
  const now = new Date();
  const diffMs = deadlineDate - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const formatted = formatDatePretty(deadlineStr);

  if (diffMs < 0) {
    return {
      hasDeadline: true,
      isExpired: true,
      isToday: false,
      daysLeft: 0,
      text: `Registration Closed on ${formatted}`,
      badgeHtml: `<span class="tag-3d tag-deadline-closed" title="Deadline has passed"><i class="fa-solid fa-lock"></i> Reg Closed (${formatted})</span>`
    };
  } else if (diffDays <= 0 || (deadlineDate.toDateString() === now.toDateString())) {
    return {
      hasDeadline: true,
      isExpired: false,
      isToday: true,
      daysLeft: 0,
      text: "Registration Closes Today!",
      badgeHtml: `<span class="tag-3d tag-deadline-today" title="Last day to register!"><i class="fa-solid fa-hourglass-half"></i> ⚠️ Closes Today!</span>`
    };
  } else if (diffDays <= 4) {
    return {
      hasDeadline: true,
      isExpired: false,
      isToday: false,
      daysLeft: diffDays,
      text: `Closes in ${diffDays} day${diffDays === 1 ? "" : "s"} (${formatted})`,
      badgeHtml: `<span class="tag-3d tag-deadline-urgent" title="Closing soon!"><i class="fa-solid fa-clock"></i> ⏳ ${diffDays}d left (${formatted})</span>`
    };
  } else {
    return {
      hasDeadline: true,
      isExpired: false,
      isToday: false,
      daysLeft: diffDays,
      text: `Deadline: ${formatted}`,
      badgeHtml: `<span class="tag-3d tag-deadline" title="Registration deadline"><i class="fa-regular fa-calendar-check"></i> Closes ${formatted}</span>`
    };
  }
}

/* =========================================================
   CSV ROSTER EXPORTER (For President Members Management)
   ========================================================= */

function exportApplicantsToCSV(clubName, applicants) {
  if (!applicants || applicants.length === 0) {
    showToast("No applicants data to export!", "info");
    return;
  }

  const headers = ["S.No", "Applicant Name", "Enrollment / Roll No", "Branch & Year", "WhatsApp Number", "College Email", "Status", "Applied Date", "Statement of Purpose / Skills"];
  
  const rows = applicants.map((app, index) => {
    let appliedDateStr = "N/A";
    if (app.appliedAt) {
      if (typeof app.appliedAt.toDate === "function") {
        appliedDateStr = app.appliedAt.toDate().toLocaleDateString("en-IN");
      } else if (app.appliedAt instanceof Date) {
        appliedDateStr = app.appliedAt.toLocaleDateString("en-IN");
      }
    }

    const clean = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    return [
      index + 1,
      clean(app.applicantName || app.studentName || ""),
      clean(app.rollNo || app.enrollmentNo || ""),
      clean(app.branch || ""),
      clean(app.phone || app.whatsapp || ""),
      clean(app.email || ""),
      clean(app.status || "Pending"),
      clean(appliedDateStr),
      clean(app.sop || app.whyJoin || "")
    ].join(",");
  });

  const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  const sanitizedClubName = (clubName || "MITS_Club").replace(/[^a-zA-Z0-9_-]/g, "_");
  link.setAttribute("href", url);
  link.setAttribute("download", `${sanitizedClubName}_Registered_Members_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast(`Downloaded CSV roster for ${clubName}!`, "success");
}

/* =========================================================
   3. AUTHENTICATION & LOGIN GATEKEEPER
   ========================================================= */

if (gateLoginBtn) {
  gateLoginBtn.addEventListener("click", handleGoogleLogin);
}

function handleGoogleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  
  auth.signInWithPopup(provider)
    .then((result) => {
      showToast(`Welcome to MITS Club Hub, ${result.user.displayName || "MITSian"}!`, "success");
    })
    .catch((err) => {
      console.error("Google Auth Error:", err);
      if (err.code === "auth/unauthorized-domain") {
        const host = window.location.hostname;
        showToast(`⚠️ Domain "${host}" not authorized in Firebase! Add "${host}" in Firebase Console > Authentication > Settings > Authorized domains.`, "error");
      } else if (err.code === "auth/popup-blocked") {
        showToast("Popup blocked. Redirecting to Google Login...", "info");
        auth.signInWithRedirect(provider);
      } else if (err.code === "auth/cancelled-popup-request" || err.code === "auth/popup-closed-by-user") {
        showToast("Login window was closed. Please try again.", "info");
      } else {
        showToast("Login failed: " + err.message, "error");
      }
    });
}

// Handle redirect result if signInWithRedirect was triggered
if (auth.getRedirectResult) {
  auth.getRedirectResult().catch((err) => {
    if (err && err.code) console.warn("Redirect auth error:", err);
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
    const email = (user.email || "").toLowerCase();
    
    // Check allowed email domains (@mitsgwl.ac.in or @gmail.com for testing)
    const isCollegeEmail = email.endsWith("@mitsgwl.ac.in");
    const isGmail = email.endsWith("@gmail.com");
    
    if (!isCollegeEmail && !isGmail) {
      showToast("Access Denied: Please log in with your college (@mitsgwl.ac.in) or Google account.", "error");
      auth.signOut();
      return;
    }

    currentUser = user;
    loginGateView.classList.add("hidden");
    mainAppView.classList.remove("hidden");

    userEmailEl.textContent = user.email;
    loadUserProfile(user);
    applyLanguage(currentLanguage);

    detectUserRole(user.email);
    listenToPendingApprovals(user.email);
    checkPresidentStatus(user.email);
    checkCollaboratorInvitations(user.email);
    subscribeMyApplications(user.email);
    listenToApprovedClubs();
  } else {
    currentUser = null;
    currentUserProfile = null;
    loginGateView.classList.remove("hidden");
    mainAppView.classList.add("hidden");
    approvalPanel.classList.add("hidden");
    presidentBanner.classList.add("hidden");
    if (collabInviteBanner) collabInviteBanner.classList.add("hidden");

    if (unsubClubs) { unsubClubs(); unsubClubs = null; }
    if (unsubPending) { unsubPending(); unsubPending = null; }
    if (unsubMyApplications) { unsubMyApplications(); unsubMyApplications = null; }
    myApplications = [];
    updateMyClubsBadge();
  }
});

function detectUserRole(email) {
  if (!email) return;
  const cleanEmail = email.toLowerCase();

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
            // Check if user is a co-lead/collaborator in any club
            db.collection("clubs").where("status", "==", "approved").get().then(allSnap => {
              let isCollab = false;
              allSnap.forEach(d => {
                const c = d.data();
                if (c.collaborators && Array.isArray(c.collaborators)) {
                  if (c.collaborators.some(col => (typeof col === "string" ? col : col.email || "").toLowerCase() === cleanEmail)) {
                    isCollab = true;
                  }
                }
              });

              if (isCollab) {
                userRoleBadge.textContent = "⭐ Core Leadership";
                userRoleBadge.style.color = "#38bdf8";
              } else {
                userRoleBadge.textContent = "🎓 Student";
                userRoleBadge.style.color = "#38bdf8";
              }
            }).catch(() => {
              userRoleBadge.textContent = "🎓 Student";
              userRoleBadge.style.color = "#38bdf8";
            });
          }
        });
    })
    .catch(() => {
      userRoleBadge.textContent = "🎓 Student";
    });
}

function checkPresidentStatus(email) {
  if (!email) return;
  const cleanEmail = email.toLowerCase();

  db.collection("clubs")
    .where("status", "==", "approved")
    .onSnapshot((snapshot) => {
      let hasAdminClub = false;
      snapshot.forEach(doc => {
        const c = doc.data();
        if ((c.presidentEmail || "").toLowerCase() === cleanEmail) {
          hasAdminClub = true;
        } else if (c.collaborators && Array.isArray(c.collaborators)) {
          if (c.collaborators.some(col => (typeof col === "string" ? col : col.email || "").toLowerCase() === cleanEmail)) {
            hasAdminClub = true;
          }
        }
      });

      if (hasAdminClub) {
        presidentBanner.classList.remove("hidden");
      } else {
        presidentBanner.classList.add("hidden");
      }
    });
}

/* =========================================================
   4. PROFESSOR APPROVAL PORTAL
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
   5. REAL-TIME APPROVED CLUBS SUBSCRIPTION
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
      
      // Update stats
      if (statClubsCount) statClubsCount.textContent = allApprovedClubs.length;
      const recruitingClubs = allApprovedClubs.filter(c => c.recruitmentStatus === "open");
      if (statRecruitingCount) statRecruitingCount.textContent = recruitingClubs.length;

      renderDynamicCategoryPills(allApprovedClubs);
      applyFilters();
      checkHashRoute();
    }, (error) => {
      console.error("Error fetching clubs:", error);
    });
}

/* =========================================================
   6. DYNAMIC CATEGORY PILLS & MULTI-FILTER ENGINE
   ========================================================= */

function renderDynamicCategoryPills(clubs) {
  if (!categoryPillsContainer) return;

  const standardCategories = [
    { key: "Technical", label: "Technical & Coding", icon: "fa-laptop-code", theme: "theme-tech" },
    { key: "Cultural", label: "Cultural & Arts", icon: "fa-masks-theater", theme: "theme-cultural" },
    { key: "Sports", label: "Sports & Fitness", icon: "fa-trophy", theme: "theme-sports" },
    { key: "Social", label: "Social & NSS", icon: "fa-hand-holding-heart", theme: "theme-social" },
    { key: "Literary", label: "Literary & Debate", icon: "fa-feather-pointed", theme: "theme-literary" },
    { key: "Innovation", label: "E-Cell & Innovation", icon: "fa-lightbulb", theme: "theme-innovation" }
  ];

  // Detect any custom categories
  const clubCategories = new Set();
  (clubs || []).forEach(c => {
    if (c.category && c.category.trim()) {
      clubCategories.add(c.category.trim());
    }
  });

  const customCategories = [];
  clubCategories.forEach(cat => {
    const isStandard = standardCategories.some(s => s.key.toLowerCase() === cat.toLowerCase());
    if (!isStandard && cat.toLowerCase() !== "all") {
      customCategories.push({
        key: cat,
        label: cat,
        icon: "fa-shapes",
        theme: "theme-custom"
      });
    }
  });

  // Update total unique categories count stat
  const totalCategories = standardCategories.length + customCategories.length;
  if (statCategoriesCount) statCategoriesCount.textContent = totalCategories;

  // Build HTML
  let pillsHtml = `
    <button class="pill-3d ${activeCategory === 'all' ? 'active' : ''}" data-category="all">
      <span class="pill-icon"><i class="fa-solid fa-compass"></i></span> All Clubs
    </button>
  `;

  standardCategories.forEach(cat => {
    const isActive = activeCategory.toLowerCase() === cat.key.toLowerCase();
    pillsHtml += `
      <button class="pill-3d ${cat.theme} ${isActive ? 'active' : ''}" data-category="${cat.key}">
        <span class="pill-icon"><i class="fa-solid ${cat.icon}"></i></span> ${cat.label}
      </button>
    `;
  });

  customCategories.forEach(cat => {
    const isActive = activeCategory.toLowerCase() === cat.key.toLowerCase();
    pillsHtml += `
      <button class="pill-3d theme-custom ${isActive ? 'active' : ''}" data-category="${cat.key}">
        <span class="pill-icon"><i class="fa-solid ${cat.icon}"></i></span> ${cat.label}
      </button>
    `;
  });

  categoryPillsContainer.innerHTML = pillsHtml;

  // Re-bind listeners
  categoryPillsContainer.querySelectorAll(".pill-3d").forEach(pill => {
    pill.addEventListener("click", () => {
      categoryPillsContainer.querySelectorAll(".pill-3d").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      activeCategory = pill.getAttribute("data-category");
      applyFilters();
    });
  });
}

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

if (resetFiltersBtn) {
  resetFiltersBtn.addEventListener("click", () => {
    searchInput.value = "";
    feeFilter.value = "all";
    recruitmentFilter.value = "all";
    sortFilter.value = "featured";
    activeCategory = "all";
    if (categoryPillsContainer) {
      categoryPillsContainer.querySelectorAll(".pill-3d").forEach((p) => p.classList.remove("active"));
      const firstPill = categoryPillsContainer.querySelector(".pill-3d");
      if (firstPill) firstPill.classList.add("active");
    }
    clearSearchBtn.classList.add("hidden");
    applyFilters();
  });
}

/* =========================================================
   7. 3D CLUB CARDS RENDERING & MOUSE PHYSICS
   ========================================================= */

const categoryIcons = {
  Technical: "fa-laptop-code",
  Cultural: "fa-masks-theater",
  Sports: "fa-trophy",
  Social: "fa-hand-holding-heart",
  Literary: "fa-feather-pointed",
  Innovation: "fa-lightbulb"
};

const defaultCategoryCovers = {
  Technical: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
  Cultural: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
  Sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
  Social: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80",
  Literary: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80",
  Innovation: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80"
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

    const isPresident = currentUser && (currentUser.email || "").toLowerCase() === (club.presidentEmail || "").toLowerCase();
    const isFree = club.feeType !== "paid";
    const isRecruiting = club.recruitmentStatus === "open";
    const catIcon = categoryIcons[cat] || "fa-shapes";

    const coverImg = club.coverImg || (club.gallery && club.gallery.length > 0 ? club.gallery[0] : defaultCategoryCovers[cat]);
    const photoCount = (club.gallery && club.gallery.length) || 0;

    const deadlineInfo = getDeadlineStatus(club.registrationDeadline);

    card.innerHTML = `
      <!-- Card Cover Photo -->
      <div class="card-cover-wrapper">
        <img src="${coverImg}" alt="${club.name} Cover" class="card-cover-img" loading="lazy" />
        <div class="card-cover-overlay"></div>
        ${photoCount > 0 ? `<div class="card-photo-count-badge"><i class="fa-solid fa-camera"></i> ${photoCount} Photos</div>` : ""}
      </div>

      <div class="card-glow-band"></div>

      <div class="card-header-3d">
        <div class="card-tags">
          <span class="tag-3d tag-cat"><i class="fa-solid ${catIcon}"></i> ${cat}</span>
          <span class="tag-3d ${isFree ? "tag-free" : "tag-paid"}">${isFree ? "FREE" : "₹" + club.feeAmount}</span>
          ${isRecruiting && !deadlineInfo.isExpired ? `<span class="tag-3d tag-recruiting"><i class="fa-solid fa-fire"></i> Recruiting</span>` : ""}
          ${deadlineInfo.badgeHtml}
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
          ${isPresident ? `
            <button class="btn-edit-card btn-manage-app-card" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border-color: rgba(245, 158, 11, 0.4);" title="Manage Registered Members" onclick="event.stopPropagation()">
              <i class="fa-solid fa-users-gear"></i> Roster
            </button>
            <button class="btn-edit-card" onclick="event.stopPropagation()"><i class="fa-solid fa-pen"></i> Edit</button>
          ` : (isRecruiting && !deadlineInfo.isExpired ? `
            <button class="btn-edit-card btn-quick-apply" style="background: rgba(6, 182, 212, 0.15); color: #22d3ee; border-color: rgba(6, 182, 212, 0.35);" title="Apply to Join Club" onclick="event.stopPropagation()">
              <i class="fa-solid fa-paper-plane"></i> Apply
            </button>
          ` : "")}
        </div>
      </div>
    `;

    // 3D Physics Mouse Move Effect
    attach3DCardPhysics(card);

    // Clicking card opens the Full Dedicated Club Page
    card.addEventListener("click", () => openFullClubPage(club.id));

    if (isPresident) {
      const editBtn = card.querySelector(".btn-edit-card:not(.btn-manage-app-card)");
      if (editBtn) {
        editBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          openEditModal(club);
        });
      }
      const manageBtn = card.querySelector(".btn-manage-app-card");
      if (manageBtn) {
        manageBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          openApplicantsModal(club);
        });
      }
    } else {
      const applyBtn = card.querySelector(".btn-quick-apply");
      if (applyBtn) {
        applyBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          openApplyModal(club);
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
   8. VIEW 2: DEDICATED FULL CLUB PAGE (A to Z Breakdown + Gallery)
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

  const userEmailLower = (currentUser && currentUser.email ? currentUser.email.toLowerCase() : "");
  const isPresident = currentUser && (userEmailLower === (club.presidentEmail || "").toLowerCase());
  const isCollaborator = currentUser && club.collaborators && Array.isArray(club.collaborators) && club.collaborators.some(c => (typeof c === "string" ? c : c.email || "").toLowerCase() === userEmailLower);
  const isAuthorizedLead = isPresident || isCollaborator;

  const coverImg = club.coverImg || (club.gallery && club.gallery.length > 0 ? club.gallery[0] : defaultCategoryCovers[cat]);
  const gallery = club.gallery || [];
  const deadlineInfo = getDeadlineStatus(club.registrationDeadline);
  const isHindi = (currentLanguage === "hi");
  const userApp = myApplications.find(a => a.clubId === club.id);

  // Clean phone number for WhatsApp link
  const cleanPhone = (phone) => (phone || "").replace(/[^0-9]/g, "");

  clubFullView.innerHTML = `
    <div class="club-page-container">
      
      <!-- Top Sticky Nav Bar -->
      <div class="club-page-nav-bar">
        <button class="btn-back-hub" id="btnBackToHub">
          <i class="fa-solid fa-arrow-left"></i> ${isHindi ? "क्लब डायरेक्टरी पर वापस जाएं" : "Back to All Clubs"}
        </button>
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <span class="tag-3d tag-cat"><i class="fa-solid ${catIcon}"></i> ${cat}</span>
          ${isAuthorizedLead ? `
            <button class="btn btn-create-3d" id="btnManageAppFromPage" style="padding: 6px 14px; font-size: 13px; background: linear-gradient(135deg, #d97706, #f59e0b); border-color: #f59e0b;">
              <i class="fa-solid fa-users-gear"></i> ${isHindi ? "आवेदक और सदस्य प्रबंधन" : "Manage Applicants & Members"} (<span id="pageAppCount">0</span>)
            </button>
            <button class="btn btn-create-3d" id="btnEditFromPage" style="padding: 6px 14px; font-size: 13px;">
              <i class="fa-solid fa-pen"></i> ${isHindi ? "क्लब और फोटो संपादित करें" : "Edit Club & Photos"}
            </button>
          ` : ""}
        </div>
      </div>

      <!-- Hero Showcase Cover -->
      <div class="club-hero-showcase">
        <div class="club-hero-cover-bg">
          <img src="${coverImg}" alt="${club.name} Banner" />
          <div class="club-hero-cover-overlay"></div>
        </div>

        <div class="club-hero-body-content">
          <div class="club-header-top">
            <div class="club-avatar-3d" style="background: ${getCategoryGradient(cat)};">
              <i class="fa-solid ${catIcon}"></i>
            </div>

            <div class="club-title-block">
              <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px; flex-wrap: wrap;">
                <span class="tag-3d ${isFree ? "tag-free" : "tag-paid"}">${isFree ? (isHindi ? "निःशुल्क पंजीकरण" : "FREE REGISTRATION") : (isHindi ? "प्रवेश शुल्क: ₹" : "ENTRY FEE: ₹") + club.feeAmount}</span>
                ${isRecruiting && !deadlineInfo.isExpired ? `<span class="tag-3d tag-recruiting"><i class="fa-solid fa-fire"></i> ${isHindi ? "भर्ती अभियान सक्रिय" : "Recruitment Drive Active"}</span>` : `<span class="tag-3d" style="background: rgba(255,255,255,0.06); color: #94a3b8;">${isHindi ? "भर्ती बंद" : "Recruitment Closed"}</span>`}
                ${deadlineInfo.badgeHtml}
                <span class="tag-3d" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;"><i class="fa-solid fa-circle-check"></i> Official MITS Club</span>
              </div>

              <h1 class="club-page-name">${club.name}</h1>
              ${club.tagline ? `<p class="club-page-tagline">"${club.tagline}"</p>` : ""}

              <div class="club-header-actions">
                ${club.whatsapp ? `
                  <a href="${club.whatsapp}" target="_blank" class="btn btn-join-wa">
                    <i class="fa-brands fa-whatsapp"></i> ${isHindi ? "ऑफिशियल व्हाट्सएप ग्रुप जॉइन करें" : "Join Official WhatsApp Group"}
                  </a>
                ` : ""}
                ${club.insta ? `
                  <a href="${club.insta}" target="_blank" class="btn btn-logout-3d" style="color: white; border-color: rgba(255,255,255,0.2);">
                    <i class="fa-brands fa-instagram"></i> ${isHindi ? "इंस्टाग्राम पर फॉलो करें" : "Follow on Instagram"}
                  </a>
                ` : ""}
                ${isRecruiting && !deadlineInfo.isExpired ? `
                  <a href="#applySection" class="btn btn-apply-hero">
                    <i class="fa-solid fa-paper-plane"></i> ${isHindi ? "सदस्यता के लिए आवेदन करें" : "Apply for Membership"}
                  </a>
                ` : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Registration Deadline Countdown Banner (if set) -->
      ${deadlineInfo.hasDeadline ? `
        <div style="background: ${deadlineInfo.isExpired ? "rgba(239, 68, 68, 0.12)" : "linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(249, 115, 22, 0.15))"}; border: 1px solid ${deadlineInfo.isExpired ? "rgba(239, 68, 68, 0.35)" : "rgba(245, 158, 11, 0.4)"}; border-radius: 16px; padding: 16px 22px; margin-bottom: 28px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 42px; height: 42px; border-radius: 10px; background: ${deadlineInfo.isExpired ? "#ef4444" : "#f59e0b"}; color: #0b0f19; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;">
              <i class="fa-solid ${deadlineInfo.isExpired ? "fa-lock" : "fa-clock"}"></i>
            </div>
            <div>
              <h4 style="font-size: 14px; color: ${deadlineInfo.isExpired ? "#f87171" : "#fbbf24"}; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">${isHindi ? "पंजीकरण अंतिम तिथि" : "Registration Deadline"}</h4>
              <p style="font-size: 14px; color: white; margin-top: 2px;">
                ${deadlineInfo.text}
              </p>
            </div>
          </div>
          ${!deadlineInfo.isExpired && isRecruiting ? `
            <a href="#applySection" class="btn" style="background: #f59e0b; color: #0f172a; font-weight: 800; padding: 8px 18px; border-radius: 8px; text-decoration: none;">
              <i class="fa-solid fa-paper-plane"></i> ${isHindi ? "अभी आवेदन करें" : "Apply Now"}
            </a>
          ` : ""}
        </div>
      ` : ""}

      <!-- Live Notice Banner if any -->
      ${club.announcement ? `
        <div style="background: linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(99, 102, 241, 0.15)); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 18px; padding: 20px 26px; margin-bottom: 32px; display: flex; align-items: center; gap: 16px;">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: #38bdf8; color: #0f172a; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;">
            <i class="fa-solid fa-bullhorn"></i>
          </div>
          <div>
            <h4 style="font-size: 15px; color: #38bdf8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">${isHindi ? "ताजा आधिकारिक सूचना" : "Latest Official Notice"}</h4>
            <p style="font-size: 14.5px; color: white; margin-top: 2px;">${club.announcement}</p>
          </div>
        </div>
      ` : ""}

      <!-- 📸 3D PHOTO & MOMENTS GALLERY -->
      ${gallery.length > 0 ? `
        <div class="club-gallery-showcase">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 class="bento-card-title" style="margin-bottom: 0;">
              <i class="fa-solid fa-camera-retro bento-ico"></i> 📸 ${isHindi ? "क्लब फोटो गैलरी और कार्यक्रम की यादें" : "Club Photo Gallery & Event Memories"} (${gallery.length} Photos)
            </h3>
            <span style="font-size: 12px; color: #94a3b8;"><i class="fa-solid fa-expand"></i> ${isHindi ? "फुलस्क्रीन देखने के लिए किसी भी फोटो पर क्लिक करें" : "Click any photo to preview fullview"}</span>
          </div>

          <div class="gallery-grid-3d">
            ${gallery.map((imgUrl, idx) => `
              <div class="gallery-item-3d" data-img="${imgUrl}" data-caption="${club.name} — Event Photo #${idx + 1}">
                <img src="${imgUrl}" alt="${club.name} Event Photo" loading="lazy" />
                <div class="gallery-item-overlay">
                  <span><i class="fa-solid fa-magnifying-glass-plus"></i> View High-Res</span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      ` : ""}

      <!-- 👥 CORE LEADERSHIP TEAM & MENTORS SHOWCASE -->
      <div class="bento-card leadership-showcase-section">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <h3 class="bento-card-title" style="margin-bottom: 0;">
            <i class="fa-solid fa-crown bento-ico" style="color: #facc15;"></i> 👥 ${isHindi ? "सञ्चालक मण्डल एवं मेंटर्स" : "Core Leadership Team & Mentors"}
          </h3>
          <span style="font-size: 12px; color: #94a3b8;"><i class="fa-solid fa-shield-halved"></i> Official MITS Student Council &amp; Faculty Lead</span>
        </div>

        <div class="leadership-grid-3d">
          <!-- 1. Faculty Coordinator -->
          <div class="lead-card-3d">
            <div class="lead-role-pill role-faculty"><i class="fa-solid fa-chalkboard-user"></i> Faculty Coordinator</div>
            <div class="lead-person-info">
              <div class="lead-avatar-circle" style="background: linear-gradient(135deg, #059669, #10b981);"><i class="fa-solid fa-user-graduate"></i></div>
              <div>
                <div class="lead-name">MITS Faculty Mentor</div>
                <div style="font-size: 12px; color: #94a3b8;">Faculty In-Charge</div>
              </div>
            </div>
            <div class="lead-contact-row">
              <a href="mailto:${club.coordinatorEmail}" class="btn-lead-contact btn-lead-mail" title="Send Official Email"><i class="fa-solid fa-envelope"></i> Email</a>
            </div>
          </div>

          <!-- 2. President / Boy Lead -->
          <div class="lead-card-3d">
            <div class="lead-role-pill role-president"><i class="fa-solid fa-crown"></i> President / Lead</div>
            <div class="lead-person-info">
              <div class="lead-avatar-circle" style="background: linear-gradient(135deg, #d97706, #f59e0b);"><i class="fa-solid fa-user-tie"></i></div>
              <div>
                <div class="lead-name">${club.presidentName || "Lead Organizer"}</div>
                <div style="font-size: 12px; color: #94a3b8;">Club President</div>
              </div>
            </div>
            <div class="lead-contact-row">
              ${club.presidentPhone ? `<a href="https://wa.me/91${cleanPhone(club.presidentPhone)}" target="_blank" class="btn-lead-contact btn-lead-wa" title="WhatsApp Message"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>` : ""}
              ${club.presidentPhone ? `<a href="tel:${club.presidentPhone}" class="btn-lead-contact" title="Call"><i class="fa-solid fa-phone"></i> Call</a>` : ""}
              ${club.presidentEmail ? `<a href="mailto:${club.presidentEmail}" class="btn-lead-contact btn-lead-mail" title="Email"><i class="fa-solid fa-envelope"></i> Email</a>` : ""}
              ${club.presidentInsta || club.insta ? `<a href="${club.presidentInsta || club.insta}" target="_blank" class="btn-lead-contact btn-lead-ig" title="Instagram"><i class="fa-brands fa-instagram"></i> Instagram</a>` : ""}
              <button type="button" class="btn-lead-action-sheet" data-name="${club.presidentName || 'President'}" data-role="Club President" data-phone="${club.presidentPhone || ''}" data-email="${club.presidentEmail || ''}" data-insta="${club.presidentInsta || club.insta || ''}"><i class="fa-solid fa-address-card"></i> Connect</button>
            </div>
          </div>

          <!-- 3. Vice President / Girl Lead / Co-Lead (if configured) -->
          ${club.vpName ? `
            <div class="lead-card-3d">
              <div class="lead-role-pill role-vp"><i class="fa-solid fa-star"></i> Vice President / Co-Lead</div>
              <div class="lead-person-info">
                <div class="lead-avatar-circle" style="background: linear-gradient(135deg, #db2777, #ec4899);"><i class="fa-solid fa-user"></i></div>
                <div>
                  <div class="lead-name">${club.vpName}</div>
                  <div style="font-size: 12px; color: #94a3b8;">Vice President</div>
                </div>
              </div>
              <div class="lead-contact-row">
                ${club.vpPhone ? `<a href="https://wa.me/91${cleanPhone(club.vpPhone)}" target="_blank" class="btn-lead-contact btn-lead-wa" title="WhatsApp Message"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>` : ""}
                ${club.vpPhone ? `<a href="tel:${club.vpPhone}" class="btn-lead-contact" title="Call"><i class="fa-solid fa-phone"></i> Call</a>` : ""}
                ${club.vpEmail ? `<a href="mailto:${club.vpEmail}" class="btn-lead-contact btn-lead-mail" title="Email"><i class="fa-solid fa-envelope"></i> Email</a>` : ""}
                ${club.vpInsta ? `<a href="${club.vpInsta}" target="_blank" class="btn-lead-contact btn-lead-ig" title="Instagram"><i class="fa-brands fa-instagram"></i> Instagram</a>` : ""}
                <button type="button" class="btn-lead-action-sheet" data-name="${club.vpName}" data-role="Vice President" data-phone="${club.vpPhone || ''}" data-email="${club.vpEmail || ''}" data-insta="${club.vpInsta || ''}"><i class="fa-solid fa-address-card"></i> Connect</button>
              </div>
            </div>
          ` : ""}

          <!-- 4. Media & Promotions Lead (if configured) -->
          ${club.mediaLeadName ? `
            <div class="lead-card-3d">
              <div class="lead-role-pill role-media"><i class="fa-solid fa-bullhorn"></i> Media & PR Lead</div>
              <div class="lead-person-info">
                <div class="lead-avatar-circle" style="background: linear-gradient(135deg, #0891b2, #06b6d4);"><i class="fa-solid fa-camera"></i></div>
                <div>
                  <div class="lead-name">${club.mediaLeadName}</div>
                  <div style="font-size: 12px; color: #94a3b8;">Public Relations &amp; Outreach</div>
                </div>
              </div>
              <div class="lead-contact-row">
                ${club.mediaLeadPhone ? `<a href="https://wa.me/91${cleanPhone(club.mediaLeadPhone)}" target="_blank" class="btn-lead-contact btn-lead-wa" title="WhatsApp Message"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>` : ""}
                <button type="button" class="btn-lead-action-sheet" data-name="${club.mediaLeadName}" data-role="Media & PR Lead" data-phone="${club.mediaLeadPhone || ''}" data-email="" data-insta=""><i class="fa-solid fa-address-card"></i> Connect</button>
              </div>
            </div>
          ` : ""}

          <!-- 5. Technical & Events Lead (if configured) -->
          ${club.techLeadName ? `
            <div class="lead-card-3d">
              <div class="lead-role-pill role-tech"><i class="fa-solid fa-laptop-code"></i> Technical Lead</div>
              <div class="lead-person-info">
                <div class="lead-avatar-circle" style="background: linear-gradient(135deg, #7c3aed, #a855f7);"><i class="fa-solid fa-code"></i></div>
                <div>
                  <div class="lead-name">${club.techLeadName}</div>
                  <div style="font-size: 12px; color: #94a3b8;">Technical &amp; Event Operations</div>
                </div>
              </div>
              <div class="lead-contact-row">
                ${club.techLeadPhone ? `<a href="https://wa.me/91${cleanPhone(club.techLeadPhone)}" target="_blank" class="btn-lead-contact btn-lead-wa" title="WhatsApp Message"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>` : ""}
                <button type="button" class="btn-lead-action-sheet" data-name="${club.techLeadName}" data-role="Technical Lead" data-phone="${club.techLeadPhone || ''}" data-email="" data-insta=""><i class="fa-solid fa-address-card"></i> Connect</button>
              </div>
            </div>
          ` : ""}

          <!-- 6. Videography & Creative Design Lead (if configured) -->
          ${club.videographyLeadName ? `
            <div class="lead-card-3d">
              <div class="lead-role-pill role-videography"><i class="fa-solid fa-video"></i> Videography &amp; Creative Lead</div>
              <div class="lead-person-info">
                <div class="lead-avatar-circle" style="background: linear-gradient(135deg, #059669, #10b981);"><i class="fa-solid fa-clapperboard"></i></div>
                <div>
                  <div class="lead-name">${club.videographyLeadName}</div>
                  <div style="font-size: 12px; color: #94a3b8;">Videography, Reels &amp; Design</div>
                </div>
              </div>
              <div class="lead-contact-row">
                ${club.videographyLeadPhone ? `<a href="https://wa.me/91${cleanPhone(club.videographyLeadPhone)}" target="_blank" class="btn-lead-contact btn-lead-wa" title="WhatsApp Message"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>` : ""}
                <button type="button" class="btn-lead-action-sheet" data-name="${club.videographyLeadName}" data-role="Videography Lead" data-phone="${club.videographyLeadPhone || ''}" data-email="" data-insta=""><i class="fa-solid fa-address-card"></i> Connect</button>
              </div>
            </div>
          ` : ""}

          <!-- 7. Corporate Outreach & Sponsorships Lead (if configured) -->
          ${club.sponsorshipLeadName ? `
            <div class="lead-card-3d">
              <div class="lead-role-pill role-sponsorship"><i class="fa-solid fa-handshake"></i> Corporate Outreach &amp; Sponsorships</div>
              <div class="lead-person-info">
                <div class="lead-avatar-circle" style="background: linear-gradient(135deg, #d97706, #f59e0b);"><i class="fa-solid fa-building"></i></div>
                <div>
                  <div class="lead-name">${club.sponsorshipLeadName}</div>
                  <div style="font-size: 12px; color: #94a3b8;">Sponsorships &amp; Industrial Connect</div>
                </div>
              </div>
              <div class="lead-contact-row">
                ${club.sponsorshipLeadPhone ? `<a href="https://wa.me/91${cleanPhone(club.sponsorshipLeadPhone)}" target="_blank" class="btn-lead-contact btn-lead-wa" title="WhatsApp Message"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>` : ""}
                <button type="button" class="btn-lead-action-sheet" data-name="${club.sponsorshipLeadName}" data-role="Sponsorships Lead" data-phone="${club.sponsorshipLeadPhone || ''}" data-email="" data-insta=""><i class="fa-solid fa-address-card"></i> Connect</button>
              </div>
            </div>
          ` : ""}

          <!-- 8. Authorized Co-Leads (if any) -->
          ${(club.collaborators && Array.isArray(club.collaborators)) ? club.collaborators.map(col => {
            const email = (typeof col === "string") ? col : col.email;
            const role = (typeof col === "object" && col.role) ? col.role : "Core Team Member";
            return `
              <div class="lead-card-3d">
                <div class="lead-role-pill role-tech"><i class="fa-solid fa-user-check"></i> ${role}</div>
                <div class="lead-person-info">
                  <div class="lead-avatar-circle" style="background: linear-gradient(135deg, #3b82f6, #06b6d4);"><i class="fa-solid fa-user"></i></div>
                  <div>
                    <div class="lead-name">${email.split("@")[0]}</div>
                    <div style="font-size: 12px; color: #94a3b8;">${email}</div>
                  </div>
                </div>
                <div class="lead-contact-row">
                  <a href="mailto:${email}" class="btn-lead-contact btn-lead-mail"><i class="fa-solid fa-envelope"></i> Email</a>
                </div>
              </div>
            `;
          }).join("") : ""}

        </div>
      </div>

      <!-- Bento Grid (A to Z Details) -->
      <div class="club-bento-grid">
        
        <!-- Left Big Column -->
        <div class="bento-col-main">

          <!-- 1. Club Mission & Overview -->
          <div class="bento-card">
            <h3 class="bento-card-title">
              <i class="fa-solid fa-book-open bento-ico"></i> 📖 ${isHindi ? "क्लब का उद्देश्य और विवरण" : "Club Mission & Overview"}
            </h3>
            <p class="bento-prose">${club.description}</p>
          </div>

          <!-- 2. Vision & Why Join / Key Benefits -->
          <div class="bento-card">
            <h3 class="bento-card-title">
              <i class="fa-solid fa-bullseye bento-ico"></i> 🎯 ${isHindi ? "क्लब क्यों ज्वाइन करें और क्या फायदे हैं" : "Why You Should Join & Benefits"}
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

          <!-- 3. Recruitment Process & Guidelines -->
          <div class="bento-card">
            <h3 class="bento-card-title">
              <i class="fa-solid fa-route bento-ico"></i> 🚀 ${isHindi ? "सदस्यता प्रक्रिया और दिशा-निर्देश" : "Recruitment Process & Joining Guidelines"}
            </h3>
            <div class="steps-timeline">
              <div class="step-card">
                <div class="step-num">1</div>
                <div class="step-info">
                  <h4>Submit Online Application</h4>
                  <p>Fill out the membership form with your branch, year, interests & skills.</p>
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

          <!-- President / Leadership Admin Portal Box (if Authorized) -->
          ${isAuthorizedLead ? `
            <div class="bento-card" style="border: 1px solid rgba(245, 158, 11, 0.4); background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(249, 115, 22, 0.08));">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                <div style="width: 32px; height: 32px; border-radius: 8px; background: #f59e0b; color: #0b0f19; display: flex; align-items: center; justify-content: center; font-size: 16px;">
                  <i class="fa-solid fa-crown"></i>
                </div>
                <div>
                  <h4 style="font-size: 14px; font-weight: 800; color: #fbbf24;">${isPresident ? "President Admin Portal" : "Core Leadership Portal"}</h4>
                  <span style="font-size: 11px; color: #94a3b8;">Verified Leadership Rights</span>
                </div>
              </div>
              <p style="font-size: 12.5px; color: #cbd5e1; margin-bottom: 14px; line-height: 1.45;">
                You have authorized rights for <strong>${club.name}</strong>. View student applications, contact applicants directly, update status or export the official CSV roster.
              </p>
              <button type="button" id="btnManageAppSidebar" class="btn btn-apply-hero" style="width: 100%; justify-content: center; background: linear-gradient(135deg, #d97706, #f59e0b); color: #0b0f19; font-weight: 800;">
                <i class="fa-solid fa-users-gear"></i> Open Registered Members Portal
              </button>
            </div>
          ` : ""}

          <!-- Membership Application Form Section -->
          <div class="bento-card" id="applySection">
            <h3 class="bento-card-title">
              <i class="fa-solid fa-paper-plane bento-ico"></i> 📝 ${isHindi ? "क्लब सदस्यता" : "Club Membership"}
            </h3>
            
            ${userApp ? `
              <div class="membership-status-card ${userApp.status === 'Approved' ? 'approved' : 'pending'}">
                <div class="member-card-badge ${userApp.status === 'Approved' ? 'approved' : 'pending'}">
                  <i class="fa-solid ${userApp.status === 'Approved' ? 'fa-circle-check' : 'fa-clock'}"></i>
                  ${userApp.status === 'Approved' ? (isHindi ? '🌟 सक्रिय सत्यापित सदस्य' : '🌟 Official Active Member') : (userApp.status === 'Shortlisted' ? (isHindi ? '🎯 शॉर्टलिस्टेड' : '🎯 Shortlisted for Round 2') : (isHindi ? '⏳ आवेदन समीक्षाधीन है' : '⏳ Application In Review'))}
                </div>
                <h4 style="color: var(--text-white); font-size: 15px; margin-bottom: 6px;">
                  ${userApp.status === 'Approved' ? (isHindi ? 'आप इस क्लब के आधिकारिक सदस्य हैं!' : 'You are an enrolled member of this club!') : (isHindi ? 'आपका आवेदन क्लब लीडरशिप द्वारा देखा जा रहा है।' : 'Your application has been received and is being evaluated.')}
                </h4>
                <p style="font-size: 12.5px; color: var(--text-gray); line-height: 1.45; margin-bottom: 12px;">
                  Roll No: <strong>${userApp.rollNo || 'N/A'}</strong> &bull; Branch: <strong>${userApp.branch || 'N/A'}</strong> &bull; WhatsApp: <strong>${userApp.phone || 'N/A'}</strong>
                </p>
                <button type="button" id="btnWithdrawDetailView" class="btn-withdraw-detail" data-app-id="${userApp.id}" data-club-name="${club.name}" data-status="${userApp.status}">
                  <i class="fa-solid fa-arrow-right-from-bracket"></i> ${userApp.status === 'Approved' ? (isHindi ? 'क्लब छोड़ें' : 'Leave Club Membership') : (isHindi ? 'आवेदन वापस लें' : 'Withdraw Application')}
                </button>
              </div>
            ` : (deadlineInfo.isExpired ? `
              <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 12px; padding: 20px; text-align: center;">
                <i class="fa-solid fa-lock" style="font-size: 32px; color: #ef4444; margin-bottom: 10px;"></i>
                <h4 style="font-size: 16px; color: white; margin-bottom: 4px;">Registration Deadline Ended</h4>
                <p style="font-size: 13px; color: #94a3b8;">Recruitments for this cycle closed on <strong>${formatDatePretty(club.registrationDeadline)}</strong>. Stay tuned to the official WhatsApp group for the next opening!</p>
              </div>
            ` : (isRecruiting ? `
              <p style="font-size: 13px; color: #94a3b8; margin-bottom: 14px;">Recruitment is currently <strong>OPEN</strong>! Submit your details directly to the club core team:</p>
              
              <form id="membershipFormPage" class="application-form-3d">
                <input type="text" id="appStudentName" placeholder="Your Full Name *" class="app-input" required />
                <input type="text" id="appStudentRoll" placeholder="Enrollment / Roll No (e.g. 0901AI231001) *" class="app-input" required />
                <input type="text" id="appStudentBranch" placeholder="Branch & Year (e.g. AI 1st Year) *" class="app-input" required />
                <input type="tel" id="appStudentPhone" placeholder="WhatsApp Contact Number *" class="app-input" required />
                <input type="email" id="appStudentEmail" placeholder="College Email (@mitsgwl.ac.in) *" class="app-input" required />
                <textarea id="appStudentWhy" rows="3" placeholder="Why do you want to join & what are your skills/interests? *" class="app-input" required></textarea>
                
                <button type="submit" class="btn btn-apply-hero" id="pageAppSubmitBtn" style="justify-content: center; padding: 12px; margin-top: 6px;">
                  <i class="fa-solid fa-check"></i> ${isHindi ? "ऑफिशियल आवेदन सबमिट करें" : "Submit Official Membership Application"}
                </button>
              </form>
            ` : `
              <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); border-radius: 12px; padding: 20px; text-align: center;">
                <i class="fa-solid fa-lock" style="font-size: 28px; color: #94a3b8; margin-bottom: 10px;"></i>
                <h4 style="font-size: 16px; color: white; margin-bottom: 4px;">Recruitments Currently Closed</h4>
                <p style="font-size: 13px; color: #94a3b8;">Follow our Instagram or join the official WhatsApp group to get notified when the next audition or recruitment drive launches!</p>
              </div>
            `))}
          </div>

        </div>

      </div>

    </div>
  `;

  // Back button handler
  document.getElementById("btnBackToHub").addEventListener("click", () => {
    window.location.hash = "";
  });

  // Attach Connect button triggers to Interactive Action Sheet
  clubFullView.querySelectorAll(".btn-lead-action-sheet").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openContactSheet({
        name: btn.getAttribute("data-name"),
        role: btn.getAttribute("data-role"),
        clubName: club.name,
        phone: btn.getAttribute("data-phone"),
        email: btn.getAttribute("data-email"),
        insta: btn.getAttribute("data-insta")
      });
    });
  });

  if (isAuthorizedLead) {
    const editBtn = document.getElementById("btnEditFromPage");
    if (editBtn) editBtn.addEventListener("click", () => openEditModal(club));

    const manageTopBtn = document.getElementById("btnManageAppFromPage");
    if (manageTopBtn) manageTopBtn.addEventListener("click", () => openApplicantsModal(club));

    const manageSideBtn = document.getElementById("btnManageAppSidebar");
    if (manageSideBtn) manageSideBtn.addEventListener("click", () => openApplicantsModal(club));

    // Listen for applicant count real-time
    db.collection("clubApplications")
      .where("clubId", "==", club.id)
      .onSnapshot((snap) => {
        const count = snap.size;
        const countBadge = document.getElementById("pageAppCount");
        if (countBadge) countBadge.textContent = count;
      }, (err) => {
        console.warn("Could not fetch applicant count:", err);
      });
  }

  // Lightbox click on gallery items
  const galleryItems = clubFullView.querySelectorAll(".gallery-item-3d");
  galleryItems.forEach(item => {
    item.addEventListener("click", () => {
      openLightbox(item.getAttribute("data-img"), item.getAttribute("data-caption"));
    });
  });

  // Pre-fill application form with user details
  const membershipForm = document.getElementById("membershipFormPage");
  if (membershipForm && currentUser) {
    const cleanName = (currentUserProfile && currentUserProfile.cleanName) || sanitizeGoogleName(currentUser.displayName);
    const emailInput = document.getElementById("appStudentEmail");
    const nameInput = document.getElementById("appStudentName");
    const rollInput = document.getElementById("appStudentRoll");
    const branchInput = document.getElementById("appStudentBranch");
    const phoneInput = document.getElementById("appStudentPhone");

    if (emailInput) emailInput.value = currentUser.email;
    if (nameInput) nameInput.value = cleanName;
    if (currentUserProfile) {
      if (rollInput && currentUserProfile.rollNo) rollInput.value = currentUserProfile.rollNo;
      if (branchInput && currentUserProfile.branch) branchInput.value = currentUserProfile.branch;
      if (phoneInput && currentUserProfile.phone) phoneInput.value = currentUserProfile.phone;
    }

    membershipForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!currentUser) {
        showToast("Please login with your college email first!", "error");
        return;
      }

      const submitBtn = document.getElementById("pageAppSubmitBtn");
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting to ${club.name}...`;

      try {
        const applicationData = {
          clubId: club.id,
          clubName: club.name,
          presidentEmail: club.presidentEmail || "",
          coordinatorEmail: club.coordinatorEmail || "",
          applicantName: document.getElementById("appStudentName").value.trim(),
          rollNo: document.getElementById("appStudentRoll").value.trim(),
          branch: document.getElementById("appStudentBranch").value.trim(),
          phone: document.getElementById("appStudentPhone").value.trim(),
          email: document.getElementById("appStudentEmail").value.trim(),
          sop: document.getElementById("appStudentWhy").value.trim(),
          photoURL: currentUser.photoURL || "",
          status: "Pending",
          appliedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.collection("clubApplications").add(applicationData);
        showToast(`🎉 Application successfully submitted to ${club.name} Core Leadership!`, "success");
        membershipForm.reset();
        if (currentUser) {
          if (emailInput) emailInput.value = currentUser.email;
        }
      } catch (err) {
        showToast("Submission failed: " + err.message, "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Submit Official Membership Application`;
      }
    });
  }

  // Withdraw / Leave Club from Club Detail Page
  const btnWithdrawDetail = document.getElementById("btnWithdrawDetailView");
  if (btnWithdrawDetail) {
    btnWithdrawDetail.addEventListener("click", async () => {
      const appId = btnWithdrawDetail.getAttribute("data-app-id");
      const cName = btnWithdrawDetail.getAttribute("data-club-name");
      const st = btnWithdrawDetail.getAttribute("data-status");
      const actionPrompt = (st === "Approved") ? `leave "${cName}"` : `withdraw your application from "${cName}"`;
      if (!confirm(`Are you sure you want to ${actionPrompt}? Your membership record will be deleted.`)) return;

      try {
        btnWithdrawDetail.disabled = true;
        btnWithdrawDetail.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing...`;
        await db.collection("clubApplications").doc(appId).delete();
        showToast(`Successfully removed from ${cName}.`, "info");
        // Re-render
        renderFullClubView(club);
      } catch (err) {
        showToast("Action failed: " + err.message, "error");
        btnWithdrawDetail.disabled = false;
      }
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

/* =========================================================
   9. HASH-BASED ROUTING (SPA)
   ========================================================= */

function checkHashRoute() {
  if (!currentUser) return;

  const hash = window.location.hash;
  if (hash === "#developer") {
    homeView.classList.add("hidden");
    clubFullView.classList.add("hidden");
    if (developerPageView) developerPageView.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (hash.startsWith("#club/")) {
    const clubId = hash.replace("#club/", "");
    const foundClub = allApprovedClubs.find(c => c.id === clubId);
    if (foundClub) {
      homeView.classList.add("hidden");
      if (developerPageView) developerPageView.classList.add("hidden");
      clubFullView.classList.remove("hidden");
      renderFullClubView(foundClub);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
  }

  // Otherwise show Home View
  homeView.classList.remove("hidden");
  clubFullView.classList.add("hidden");
  if (developerPageView) developerPageView.classList.add("hidden");
}

window.addEventListener("hashchange", checkHashRoute);

if (navLogoBtn) {
  navLogoBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.hash = "";
  });
}

if (devBackBtn) {
  devBackBtn.addEventListener("click", () => {
    window.location.hash = "";
  });
}

if (devBackToClubsLink) {
  devBackToClubsLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.hash = "";
  });
}

/* =========================================================
   10. CREATE CLUB MODAL WITH PHOTO UPLOAD
   ========================================================= */

function openCreateClubModal() {
  if (!currentUser) {
    showToast("Please login first to register a new club!", "error");
    return;
  }
  document.getElementById("presidentEmail").value = currentUser.email;
  createClubModal.classList.remove("hidden");
}

if (addClubBtn) addClubBtn.addEventListener("click", openCreateClubModal);
const emptyAddClubBtn = document.getElementById("emptyAddClubBtn");
if (emptyAddClubBtn) emptyAddClubBtn.addEventListener("click", openCreateClubModal);


closeModalBtn.addEventListener("click", () => createClubModal.classList.add("hidden"));

feeTypeSelect.addEventListener("change", () => {
  const isPaid = feeTypeSelect.value === "paid";
  feeAmountInput.disabled = !isPaid;
  if (isPaid) feeAmountInput.focus();
  else feeAmountInput.value = "";
});

if (clubCategorySelect) {
  clubCategorySelect.addEventListener("change", () => {
    if (clubCategorySelect.value === "Other") {
      if (customCategoryWrap) customCategoryWrap.classList.remove("hidden");
      if (customCategoryInput) customCategoryInput.focus();
    } else {
      if (customCategoryWrap) customCategoryWrap.classList.add("hidden");
    }
  });
}

if (editCategorySelect) {
  editCategorySelect.addEventListener("change", () => {
    if (editCategorySelect.value === "Other") {
      if (editCustomCategoryWrap) editCustomCategoryWrap.classList.remove("hidden");
      if (editCustomCategoryInput) editCustomCategoryInput.focus();
    } else {
      if (editCustomCategoryWrap) editCustomCategoryWrap.classList.add("hidden");
    }
  });
}

createClubForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser) return;

  const submitBtn = document.getElementById("submitClubBtn");
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing Photos & Submitting...`;

  try {
    const isPaid = feeTypeSelect.value === "paid";
    const feeVal = isPaid ? Number(feeAmountInput.value || 0) : 0;

    let finalCategory = clubCategorySelect.value;
    if (finalCategory === "Other") {
      finalCategory = (customCategoryInput ? customCategoryInput.value.trim() : "") || "General";
    }

    // Read uploaded gallery files
    const uploadedPhotos = await readFilesAsDataURLs(clubPhotoFilesInput.files);
    const coverUrl = document.getElementById("clubCoverImg").value.trim();

    const newClub = {
      name: document.getElementById("clubName").value.trim(),
      category: finalCategory,
      tagline: document.getElementById("clubTagline").value.trim(),
      coverImg: coverUrl || (uploadedPhotos.length > 0 ? uploadedPhotos[0] : ""),
      gallery: uploadedPhotos,
      description: document.getElementById("clubDescription").value.trim(),
      whyJoin: document.getElementById("clubWhyJoin").value.trim(),
      feeType: feeTypeSelect.value,
      feeAmount: feeVal,
      recruitmentStatus: document.getElementById("recruitmentStatus").value,
      registrationDeadline: document.getElementById("clubDeadline") ? document.getElementById("clubDeadline").value.trim() : "",
      // Core Leadership Team
      presidentName: document.getElementById("presidentName").value.trim(),
      presidentPhone: document.getElementById("presidentPhone").value.trim(),
      presidentEmail: document.getElementById("presidentEmail").value.trim(),
      presidentInsta: document.getElementById("presidentInsta") ? document.getElementById("presidentInsta").value.trim() : "",
      vpName: document.getElementById("vpName") ? document.getElementById("vpName").value.trim() : "",
      vpPhone: document.getElementById("vpPhone") ? document.getElementById("vpPhone").value.trim() : "",
      vpEmail: document.getElementById("vpEmail") ? document.getElementById("vpEmail").value.trim() : "",
      vpInsta: document.getElementById("vpInsta") ? document.getElementById("vpInsta").value.trim() : "",
      mediaLeadName: document.getElementById("mediaLeadName") ? document.getElementById("mediaLeadName").value.trim() : "",
      mediaLeadPhone: document.getElementById("mediaLeadPhone") ? document.getElementById("mediaLeadPhone").value.trim() : "",
      techLeadName: document.getElementById("techLeadName") ? document.getElementById("techLeadName").value.trim() : "",
      techLeadPhone: document.getElementById("techLeadPhone") ? document.getElementById("techLeadPhone").value.trim() : "",
      videographyLeadName: videographyLeadNameInput ? videographyLeadNameInput.value.trim() : "",
      videographyLeadPhone: videographyLeadPhoneInput ? videographyLeadPhoneInput.value.trim() : "",
      sponsorshipLeadName: sponsorshipLeadNameInput ? sponsorshipLeadNameInput.value.trim() : "",
      sponsorshipLeadPhone: sponsorshipLeadPhoneInput ? sponsorshipLeadPhoneInput.value.trim() : "",
      collaborators: [],
      whatsapp: document.getElementById("clubWhatsapp").value.trim(),
      insta: document.getElementById("clubInsta").value.trim(),
      coordinatorEmail: document.getElementById("coordinatorEmail").value.trim(),
      status: "pending",
      createdBy: currentUser.email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      announcement: ""
    };

    await db.collection("clubs").add(newClub);
    showToast(`Club "${newClub.name}" submitted! Category "${finalCategory}" will appear automatically once approved.`, "success");
    createClubForm.reset();
    if (customCategoryWrap) customCategoryWrap.classList.add("hidden");
    createClubModal.classList.add("hidden");

    // Automatically trigger Faculty Mentor Notification Action Sheet
    openFacultyMentorNotificationModal(newClub);
  } catch (err) {
    showToast("Submission failed: " + err.message, "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Submit Club for Faculty Approval`;
  }
});

/* =========================================================
   10.1 FACULTY MENTOR NOTIFICATION DISPATCHER
   ========================================================= */

function openFacultyMentorNotificationModal(clubData) {
  if (!mentorNotifyModal) return;

  if (notifyClubName) notifyClubName.textContent = clubData.name || "Club";
  if (notifyProfessorEmail) notifyProfessorEmail.textContent = clubData.coordinatorEmail || "coordinator@mitsgwl.ac.in";

  const subject = `[MITS Club Hub] Faculty Coordinator Authorization Request: "${clubData.name}"`;
  const body = `Respected Professor / Faculty Mentor,

Greetings from MITS Club Hub!

A new student club has been registered on the MITS Club Hub portal and assigned to you as the Faculty Coordinator:

📌 Club Name: ${clubData.name}
📂 Category: ${clubData.category || "General"}
👤 Student President: ${clubData.presidentName || "President"} (${clubData.presidentPhone || "Phone"})
✉️ President Email: ${clubData.presidentEmail || ""}
📝 Description: ${clubData.description || ""}

👉 Please review and authorize this club by logging into the portal:
https://mits-gwl-club-hub.netlify.app

Once authorized, the club will go live for all MITS students.

Warm regards,
${clubData.presidentName || "Club President"}
MITS Club Hub | Madhav Institute of Technology & Science, Gwalior`;

  if (notifyGmailBtn) {
    notifyGmailBtn.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(clubData.coordinatorEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  if (notifyWhatsAppBtn) {
    const waMsg = `*Namaste Professor* 🙏\n\nI have registered *${clubData.name}* on the *MITS Club Hub* portal and nominated you as our Faculty Coordinator.\n\nKindly review and approve our club on the portal:\n🔗 https://mits-gwl-club-hub.netlify.app\n\nThank you,\n${clubData.presidentName}`;
    notifyWhatsAppBtn.href = `https://wa.me/?text=${encodeURIComponent(waMsg)}`;
  }

  if (notifyCopyBtn) {
    notifyCopyBtn.onclick = () => {
      navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`).then(() => {
        showToast("📋 Official approval request copied to clipboard!", "success");
      }).catch(() => {
        showToast("Failed to copy to clipboard", "error");
      });
    };
  }

  mentorNotifyModal.classList.remove("hidden");
}

if (closeMentorNotifyModalBtn) {
  closeMentorNotifyModalBtn.addEventListener("click", () => {
    if (mentorNotifyModal) mentorNotifyModal.classList.add("hidden");
  });
}

if (closeMentorNotifyDoneBtn) {
  closeMentorNotifyDoneBtn.addEventListener("click", () => {
    if (mentorNotifyModal) mentorNotifyModal.classList.add("hidden");
  });
}

/* =========================================================
   11. EDIT CLUB MODAL (President Photo, Details & Leadership Manager)
   ========================================================= */

function openEditModal(club) {
  document.getElementById("editClubId").value = club.id;
  document.getElementById("editModalHeading").textContent = `Edit — ${club.name}`;
  document.getElementById("editTagline").value = club.tagline || "";
  document.getElementById("editCoverImg").value = club.coverImg || "";
  document.getElementById("editDescription").value = club.description || "";
  document.getElementById("editWhyJoin").value = club.whyJoin || "";
  document.getElementById("editAnnouncement").value = club.announcement || "";
  document.getElementById("editRecruitmentStatus").value = club.recruitmentStatus || "open";
  document.getElementById("editFeeType").value = club.feeType || "free";
  document.getElementById("editFeeAmount").value = club.feeAmount || 0;
  
  if (document.getElementById("editDeadline")) {
    document.getElementById("editDeadline").value = club.registrationDeadline || "";
  }

  // Leadership Team values
  document.getElementById("editPresidentName").value = club.presidentName || "";
  document.getElementById("editPresidentPhone").value = club.presidentPhone || "";
  if (document.getElementById("editPresidentEmail")) {
    document.getElementById("editPresidentEmail").value = club.presidentEmail || "";
  }
  if (document.getElementById("editPresidentInsta")) {
    document.getElementById("editPresidentInsta").value = club.presidentInsta || club.insta || "";
  }
  if (document.getElementById("editVpName")) {
    document.getElementById("editVpName").value = club.vpName || "";
  }
  if (document.getElementById("editVpPhone")) {
    document.getElementById("editVpPhone").value = club.vpPhone || "";
  }
  if (document.getElementById("editVpEmail")) {
    document.getElementById("editVpEmail").value = club.vpEmail || "";
  }
  if (document.getElementById("editVpInsta")) {
    document.getElementById("editVpInsta").value = club.vpInsta || "";
  }
  if (document.getElementById("editMediaLeadName")) {
    document.getElementById("editMediaLeadName").value = club.mediaLeadName || "";
  }
  if (document.getElementById("editMediaLeadPhone")) {
    document.getElementById("editMediaLeadPhone").value = club.mediaLeadPhone || "";
  }
  if (document.getElementById("editTechLeadName")) {
    document.getElementById("editTechLeadName").value = club.techLeadName || "";
  }
  if (document.getElementById("editTechLeadPhone")) {
    document.getElementById("editTechLeadPhone").value = club.techLeadPhone || "";
  }
  if (editVideographyLeadNameInput) {
    editVideographyLeadNameInput.value = club.videographyLeadName || "";
  }
  if (editVideographyLeadPhoneInput) {
    editVideographyLeadPhoneInput.value = club.videographyLeadPhone || "";
  }
  if (editSponsorshipLeadNameInput) {
    editSponsorshipLeadNameInput.value = club.sponsorshipLeadName || "";
  }
  if (editSponsorshipLeadPhoneInput) {
    editSponsorshipLeadPhoneInput.value = club.sponsorshipLeadPhone || "";
  }

  document.getElementById("editWhatsapp").value = club.whatsapp || "";
  document.getElementById("editInsta").value = club.insta || "";

  // Reset transfer form
  if (document.getElementById("transferNewName")) document.getElementById("transferNewName").value = "";
  if (document.getElementById("transferNewPhone")) document.getElementById("transferNewPhone").value = "";
  if (document.getElementById("transferNewEmail")) document.getElementById("transferNewEmail").value = "";

  // Category in edit modal
  if (editCategorySelect) {
    const standardCats = ["Technical", "Cultural", "Sports", "Social", "Literary", "Innovation"];
    if (standardCats.includes(club.category)) {
      editCategorySelect.value = club.category;
      if (editCustomCategoryWrap) editCustomCategoryWrap.classList.add("hidden");
    } else if (club.category) {
      editCategorySelect.value = "Other";
      if (editCustomCategoryWrap) {
        editCustomCategoryWrap.classList.remove("hidden");
        if (editCustomCategoryInput) editCustomCategoryInput.value = club.category;
      }
    }
  }

  // Set gallery state
  currentEditingClubPhotos = [...(club.gallery || [])];
  renderEditThumbnails();

  // Set collaborators state
  currentEditingClubCollabs = [...(club.collaborators || [])];
  renderCollabTags();

  editClubModal.classList.remove("hidden");
}

function renderCollabTags() {
  if (!collabListContainer) return;
  collabListContainer.innerHTML = "";

  if (currentEditingClubCollabs.length === 0) {
    collabListContainer.innerHTML = `<span style="font-size: 12px; color: #64748b;">No co-leads added yet.</span>`;
    return;
  }

  currentEditingClubCollabs.forEach((col, idx) => {
    const email = (typeof col === "string") ? col : col.email;
    const role = (typeof col === "object" && col.role) ? col.role : "Co-Lead";
    const tag = document.createElement("div");
    tag.className = "collab-tag-item";
    tag.innerHTML = `
      <i class="fa-solid fa-user-tag" style="color: #38bdf8;"></i>
      <span><strong>${role}:</strong> ${email}</span>
      <span class="collab-tag-remove" data-index="${idx}" title="Remove access">&times;</span>
    `;

    tag.querySelector(".collab-tag-remove").addEventListener("click", () => {
      currentEditingClubCollabs.splice(idx, 1);
      renderCollabTags();
    });

    collabListContainer.appendChild(tag);
  });
}

if (btnAddCollabMember) {
  btnAddCollabMember.addEventListener("click", () => {
    const email = (newCollabEmailInput ? newCollabEmailInput.value.trim().toLowerCase() : "");
    const role = (newCollabRoleInput ? newCollabRoleInput.value.trim() : "") || "Co-Lead";

    if (!email || !email.endsWith("@mitsgwl.ac.in")) {
      showToast("Please enter a valid @mitsgwl.ac.in college email for the co-lead!", "error");
      return;
    }

    const alreadyExists = currentEditingClubCollabs.some(c => (typeof c === "string" ? c : c.email).toLowerCase() === email);
    if (alreadyExists) {
      showToast("This member is already added to leadership list.", "info");
      return;
    }

    currentEditingClubCollabs.push({ email, role });
    if (newCollabEmailInput) newCollabEmailInput.value = "";
    if (newCollabRoleInput) newCollabRoleInput.value = "";
    renderCollabTags();
    showToast(`Added ${email} as ${role}!`, "success");
  });
}

function renderEditThumbnails() {
  editGalleryThumbnails.innerHTML = "";
  editPhotoCount.textContent = currentEditingClubPhotos.length;

  currentEditingClubPhotos.forEach((imgUrl, index) => {
    const wrap = document.createElement("div");
    wrap.className = "thumb-preview-wrap";
    wrap.innerHTML = `
      <img src="${imgUrl}" alt="Thumbnail" />
      <button type="button" class="thumb-delete-btn" data-index="${index}">&times;</button>
    `;
    wrap.querySelector(".thumb-delete-btn").addEventListener("click", () => {
      currentEditingClubPhotos.splice(index, 1);
      renderEditThumbnails();
    });
    editGalleryThumbnails.appendChild(wrap);
  });
}

closeEditModalBtn.addEventListener("click", () => editClubModal.classList.add("hidden"));

editClubForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("editClubId").value;
  if (!id) return;

  const submitBtn = editClubForm.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving Photos & Changes...`;

  try {
    const feeType = editFeeType.value;
    const feeAmount = feeType === "paid" ? Number(editFeeAmount.value || 0) : 0;

    let finalEditCat = editCategorySelect ? editCategorySelect.value : "Technical";
    if (finalEditCat === "Other") {
      finalEditCat = (editCustomCategoryInput ? editCustomCategoryInput.value.trim() : "") || "General";
    }

    // Read any newly selected photo files
    const newlyAddedPhotos = await readFilesAsDataURLs(editPhotoFilesInput.files);
    const updatedGallery = [...currentEditingClubPhotos, ...newlyAddedPhotos];
    const coverUrl = document.getElementById("editCoverImg").value.trim() || (updatedGallery.length > 0 ? updatedGallery[0] : "");

    const updatePayload = {
      category: finalEditCat,
      tagline: document.getElementById("editTagline").value.trim(),
      coverImg: coverUrl,
      gallery: updatedGallery,
      description: document.getElementById("editDescription").value.trim(),
      whyJoin: document.getElementById("editWhyJoin").value.trim(),
      announcement: document.getElementById("editAnnouncement").value.trim(),
      recruitmentStatus: document.getElementById("editRecruitmentStatus").value,
      feeType: feeType,
      feeAmount: feeAmount,
      registrationDeadline: document.getElementById("editDeadline") ? document.getElementById("editDeadline").value.trim() : "",
      // Core Leadership updates
      presidentName: document.getElementById("editPresidentName").value.trim(),
      presidentPhone: document.getElementById("editPresidentPhone").value.trim(),
      presidentInsta: document.getElementById("editPresidentInsta") ? document.getElementById("editPresidentInsta").value.trim() : "",
      vpName: document.getElementById("editVpName") ? document.getElementById("editVpName").value.trim() : "",
      vpPhone: document.getElementById("editVpPhone") ? document.getElementById("editVpPhone").value.trim() : "",
      vpEmail: document.getElementById("editVpEmail") ? document.getElementById("editVpEmail").value.trim() : "",
      vpInsta: document.getElementById("editVpInsta") ? document.getElementById("editVpInsta").value.trim() : "",
      mediaLeadName: document.getElementById("editMediaLeadName") ? document.getElementById("editMediaLeadName").value.trim() : "",
      mediaLeadPhone: document.getElementById("editMediaLeadPhone") ? document.getElementById("editMediaLeadPhone").value.trim() : "",
      techLeadName: document.getElementById("editTechLeadName") ? document.getElementById("editTechLeadName").value.trim() : "",
      techLeadPhone: document.getElementById("editTechLeadPhone") ? document.getElementById("editTechLeadPhone").value.trim() : "",
      videographyLeadName: editVideographyLeadNameInput ? editVideographyLeadNameInput.value.trim() : "",
      videographyLeadPhone: editVideographyLeadPhoneInput ? editVideographyLeadPhoneInput.value.trim() : "",
      sponsorshipLeadName: editSponsorshipLeadNameInput ? editSponsorshipLeadNameInput.value.trim() : "",
      sponsorshipLeadPhone: editSponsorshipLeadPhoneInput ? editSponsorshipLeadPhoneInput.value.trim() : "",
      collaborators: currentEditingClubCollabs,
      whatsapp: document.getElementById("editWhatsapp").value.trim(),
      insta: document.getElementById("editInsta").value.trim(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    await db.collection("clubs").doc(id).update(updatePayload);

    showToast("Club details, leadership roster & gallery updated successfully!", "success");
    editClubModal.classList.add("hidden");
  } catch (err) {
    showToast("Error updating: " + err.message, "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Save & Broadcast Changes`;
  }
});

function openHandoverGmailModal(clubName, toEmail, toName, role = "Club President & Head Administrator") {
  const senderName = (currentUserProfile && currentUserProfile.cleanName) || (currentUser ? currentUser.displayName : "Club President");
  const senderEmail = currentUser ? currentUser.email : "president@mitsgwl.ac.in";
  const portalUrl = window.location.origin;

  const mailSubject = `[MITS Club Hub] 🏛️ Official Leadership Handover: ${clubName}`;
  const mailBody = `Namaste ${toName || "Student"},

You have been officially nominated and invited by ${senderName} (${senderEmail}) to take over as the "${role}" of "${clubName}" at Madhav Institute of Technology & Science (MITS Gwalior).

📋 Handover Details:
• Club: ${clubName}
• Nominated Role: ${role}
• Transferred By: ${senderName} (${senderEmail})
• Status: Pending Your Official Confirmation

👉 How to Accept or Decline Leadership:
1. Open the official MITS Club Hub Portal: ${portalUrl}
2. Sign in with your official college email (${toEmail})
3. An official Leadership Handover banner will appear at the top. Click "Accept & Assume Presidency" or "Decline".

Once accepted, full administrative control, membership management, and editing rights will be transferred to your college account.

Best regards,
MITS Club Hub Administration
Madhav Institute of Technology & Science, Gwalior`;

  if (handoverMailRecipient) handoverMailRecipient.textContent = toEmail;
  if (prevMailTo) prevMailTo.textContent = `${toName ? toName + ' ' : ''}<${toEmail}>`;
  if (prevMailSubject) prevMailSubject.textContent = mailSubject;
  if (prevMailBody) prevMailBody.textContent = mailBody;

  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(toEmail)}&su=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
  const defaultMailto = `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

  if (btnOpenGmailApp) btnOpenGmailApp.href = gmailComposeUrl;
  if (btnOpenDefaultMail) btnOpenDefaultMail.href = defaultMailto;

  if (handoverGmailModal) handoverGmailModal.classList.remove("hidden");
}

if (closeHandoverGmailModalBtn) {
  closeHandoverGmailModalBtn.addEventListener("click", () => {
    if (handoverGmailModal) handoverGmailModal.classList.add("hidden");
  });
}

if (btnTransferLeadership) {
  btnTransferLeadership.addEventListener("click", async () => {
    const clubId = document.getElementById("editClubId").value;
    const newEmail = (document.getElementById("transferNewEmail").value || "").trim().toLowerCase();
    const newName = (document.getElementById("transferNewName").value || "").trim();
    const newPhone = (document.getElementById("transferNewPhone").value || "").trim();

    if (!newEmail || !newEmail.endsWith("@mitsgwl.ac.in")) {
      showToast("Please enter a valid successor @mitsgwl.ac.in college email!", "error");
      return;
    }

    if (currentUser && newEmail === currentUser.email.toLowerCase()) {
      showToast("You are already the registered President.", "info");
      return;
    }

    const club = allApprovedClubs.find(c => c.id === clubId) || {};
    const clubName = club.name || document.getElementById("editModalHeading").textContent.replace("Edit — ", "").trim() || "Club";

    const confirmed = confirm(`⚠️ TENURE HANDOVER CONFIRMATION\n\nAre you sure you want to transfer President leadership of "${clubName}" to "${newEmail}"?\n\nAn official handover nomination will be recorded and you will be directed to send an invitation email via Gmail.`);
    if (!confirmed) return;

    try {
      btnTransferLeadership.disabled = true;
      btnTransferLeadership.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Initiating Handover...`;

      // 1. Record pending transfer on the club document
      await db.collection("clubs").doc(clubId).update({
        pendingPresidentEmail: newEmail,
        pendingPresidentName: newName || "New President",
        pendingPresidentPhone: newPhone || "",
        pendingTransferBy: currentUser ? currentUser.email : "Previous President",
        pendingTransferByName: (currentUserProfile && currentUserProfile.cleanName) || (currentUser ? currentUser.displayName : "Previous President"),
        pendingTransferAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // 2. Also record in leadershipInvitations collection
      await db.collection("leadershipInvitations").doc(`${clubId}_${newEmail}`).set({
        clubId: clubId,
        clubName: clubName,
        toEmail: newEmail,
        toName: newName || "Student",
        newPhone: newPhone || "",
        fromEmail: currentUser ? currentUser.email : "",
        fromName: (currentUserProfile && currentUserProfile.cleanName) || (currentUser ? currentUser.displayName : "President"),
        role: "Club President & Head Administrator",
        status: "Pending",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      showToast(`🎉 Leadership nomination saved! Opening email dispatch...`, "success");
      editClubModal.classList.add("hidden");

      // 3. Open Gmail Dispatch modal
      openHandoverGmailModal(clubName, newEmail, newName, "Club President & Head Administrator");
    } catch (err) {
      showToast("Transfer failed: " + err.message, "error");
    } finally {
      btnTransferLeadership.disabled = false;
      btnTransferLeadership.innerHTML = `<i class="fa-solid fa-right-left"></i> Confirm Leadership Handover`;
    }
  });
}

/* =========================================================
   10. APPLICANTS MANAGEMENT & CSV ROSTER (President & Co-Leads Only)
   ========================================================= */

function openApplicantsModal(club) {
  currentManagingClub = club;
  applicantsClubTitle.textContent = `${club.name} — Registered Members`;
  viewApplicantsModal.classList.remove("hidden");

  // Listen to applicants in realtime
  if (unsubApplicants) unsubApplicants();

  unsubApplicants = db.collection("clubApplications")
    .where("clubId", "==", club.id)
    .onSnapshot((snapshot) => {
      currentClubApplications = [];
      snapshot.forEach((doc) => {
        currentClubApplications.push({ id: doc.id, ...doc.data() });
      });

      // Sort by applied date descending
      currentClubApplications.sort((a, b) => {
        const timeA = a.appliedAt ? (a.appliedAt.seconds || 0) : 0;
        const timeB = b.appliedAt ? (b.appliedAt.seconds || 0) : 0;
        return timeB - timeA;
      });

      updateApplicantStats();
      renderFilteredApplicants();
    }, (error) => {
      console.error("Error fetching applicants:", error);
      showToast("Error loading applicants: " + error.message, "error");
    });
}

closeApplicantsModalBtn.addEventListener("click", () => {
  if (unsubApplicants) {
    unsubApplicants();
    unsubApplicants = null;
  }
  viewApplicantsModal.classList.add("hidden");
});

function updateApplicantStats() {
  const total = currentClubApplications.length;
  const pending = currentClubApplications.filter(a => (a.status || "Pending") === "Pending").length;
  const shortlisted = currentClubApplications.filter(a => a.status === "Shortlisted").length;
  const approved = currentClubApplications.filter(a => a.status === "Approved").length;

  if (appStatTotal) appStatTotal.textContent = total;
  if (appStatPending) appStatPending.textContent = pending;
  if (appStatShortlisted) appStatShortlisted.textContent = shortlisted;
  if (appStatApproved) appStatApproved.textContent = approved;
}

function renderFilteredApplicants() {
  if (!applicantsListWrapper) return;

  const query = (appSearchInput ? appSearchInput.value.trim().toLowerCase() : "");
  const statusVal = (appStatusFilter ? appStatusFilter.value : "all");

  let filtered = currentClubApplications.filter(app => {
    const matchesSearch = !query || 
      (app.applicantName || "").toLowerCase().includes(query) ||
      (app.rollNo || "").toLowerCase().includes(query) ||
      (app.branch || "").toLowerCase().includes(query) ||
      (app.email || "").toLowerCase().includes(query);

    const matchesStatus = (statusVal === "all") || ((app.status || "Pending") === statusVal);

    return matchesSearch && matchesStatus;
  });

  if (filtered.length === 0) {
    applicantsListWrapper.innerHTML = `
      <div class="empty-applicants-state">
        <i class="fa-solid fa-users-slash"></i>
        <h4>No Applications Found</h4>
        <p>${currentClubApplications.length === 0 ? "No students have applied for this club yet. Share your club link to start receiving applications!" : "No applications match your current search or status filter."}</p>
      </div>
    `;
    return;
  }

  const cleanPhone = (p) => (p || "").replace(/[^0-9]/g, "");

  applicantsListWrapper.innerHTML = `
    <table class="applicants-roster-table">
      <thead>
        <tr>
          <th>Student Avatar &amp; Name</th>
          <th>Enrollment No</th>
          <th>Branch &amp; Year</th>
          <th>Direct Contact</th>
          <th>Statement / Skills</th>
          <th>Status</th>
          <th>Applied</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${filtered.map(app => {
          const status = app.status || "Pending";
          let dateStr = "Recently";
          if (app.appliedAt) {
            if (typeof app.appliedAt.toDate === "function") {
              dateStr = app.appliedAt.toDate().toLocaleDateString("en-IN");
            }
          }
          const firstLetter = (app.applicantName || "S")[0].toUpperCase();
          const avatarHtml = app.photoURL
            ? `<img src="${app.photoURL}" alt="${app.applicantName || 'Student'}" onerror="this.parentElement.innerHTML='${firstLetter}';" />`
            : firstLetter;

          return `
            <tr>
              <td>
                <div class="app-student-cell">
                  <div class="app-student-avatar">${avatarHtml}</div>
                  <div>
                    <div class="app-student-name">${app.applicantName || "Student"}</div>
                    <div style="font-size: 11px; color: #94a3b8;">${app.email}</div>
                  </div>
                </div>
              </td>
              <td><span class="app-student-roll">${app.rollNo || "N/A"}</span></td>
              <td>${app.branch || "General"}</td>
              <td>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  ${app.phone ? `
                    <a href="https://wa.me/91${cleanPhone(app.phone)}?text=Hi%20${encodeURIComponent(app.applicantName || 'Student')},%20this%20is%20regarding%20your%20membership%20application%20for%20${encodeURIComponent(currentManagingClub ? currentManagingClub.name : 'MITS Club')}." target="_blank" class="btn-wa-direct" title="Quick WhatsApp Chat">
                      <i class="fa-brands fa-whatsapp"></i> Chat
                    </a>
                  ` : ""}
                  ${app.email ? `
                    <a href="mailto:${app.email}?subject=Regarding%20${encodeURIComponent(currentManagingClub ? currentManagingClub.name : 'Club')}%20Application" class="btn-mail-direct" title="Send Email">
                      <i class="fa-solid fa-envelope"></i>
                    </a>
                  ` : ""}
                </div>
              </td>
              <td>
                <button type="button" class="btn-sop-peek" data-sop="${encodeURIComponent(app.sop || 'No statement provided.')}" data-name="${encodeURIComponent(app.applicantName || 'Student')}">
                  <i class="fa-solid fa-file-lines"></i> View SOP
                </button>
              </td>
              <td>
                <select class="status-badge-select status-${status}" data-appid="${app.id}">
                  <option value="Pending" ${status === "Pending" ? "selected" : ""}>⏳ Pending</option>
                  <option value="Shortlisted" ${status === "Shortlisted" ? "selected" : ""}>🌟 Shortlisted</option>
                  <option value="Approved" ${status === "Approved" ? "selected" : ""}>✅ Approved</option>
                  <option value="Rejected" ${status === "Rejected" ? "selected" : ""}>❌ Rejected</option>
                </select>
              </td>
              <td style="font-size: 11.5px; color: #94a3b8; white-space: nowrap;">${dateStr}</td>
              <td>
                <button type="button" class="btn-delete-app" data-appid="${app.id}" title="Remove applicant" style="background: transparent; border: none; color: #ef4444; cursor: pointer; padding: 4px 8px; font-size: 14px;">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;

  // Attach Status Change handlers
  applicantsListWrapper.querySelectorAll(".status-badge-select").forEach(sel => {
    sel.addEventListener("change", async () => {
      const appId = sel.getAttribute("data-appid");
      const newStatus = sel.value;
      try {
        await db.collection("clubApplications").doc(appId).update({ status: newStatus });
        showToast(`Applicant status marked as ${newStatus}!`, "success");
      } catch (err) {
        showToast("Could not update status: " + err.message, "error");
      }
    });
  });

  // Attach SOP Peek Viewers
  applicantsListWrapper.querySelectorAll(".btn-sop-peek").forEach(btn => {
    btn.addEventListener("click", () => {
      const sop = decodeURIComponent(btn.getAttribute("data-sop"));
      const name = decodeURIComponent(btn.getAttribute("data-name"));
      alert(`📝 Statement of Purpose / Skills — ${name}\n\n"${sop}"`);
    });
  });

  // Attach Delete Applicant handlers
  applicantsListWrapper.querySelectorAll(".btn-delete-app").forEach(btn => {
    btn.addEventListener("click", async () => {
      const appId = btn.getAttribute("data-appid");
      if (!confirm("Are you sure you want to remove this applicant from the roster?")) return;
      try {
        await db.collection("clubApplications").doc(appId).delete();
        showToast("Applicant removed from roster.", "info");
      } catch (err) {
        showToast("Error removing: " + err.message, "error");
      }
    });
  });
}

// Search & filter listeners for applicants modal
if (appSearchInput) appSearchInput.addEventListener("input", renderFilteredApplicants);
if (appStatusFilter) appStatusFilter.addEventListener("change", renderFilteredApplicants);

// Export CSV Button
if (btnExportApplicantsCSV) {
  btnExportApplicantsCSV.addEventListener("click", () => {
    if (currentManagingClub) {
      exportApplicantsToCSV(currentManagingClub.name, currentClubApplications);
    }
  });
}

/* =========================================================
   STUDENT QUICK-APPLY MEMBERSHIP MODAL
   ========================================================= */

function openApplyModal(club) {
  if (!club) return;
  if (!currentUser) {
    showToast("Please login with your college email first to apply!", "error");
    return;
  }

  if (applyClubId) applyClubId.value = club.id;
  if (applyClubNameHidden) applyClubNameHidden.value = club.name;
  if (applyPresidentEmailHidden) applyPresidentEmailHidden.value = club.presidentEmail || "";
  if (applyModalClubTag) applyModalClubTag.textContent = `${club.category} Club Recruitment`;
  if (applyModalClubName) applyModalClubName.textContent = `Apply to Join — ${club.name}`;

  if (modalAppEmail) modalAppEmail.value = currentUser.email;

  const cleanName = (currentUserProfile && currentUserProfile.cleanName) || sanitizeGoogleName(currentUser.displayName);
  if (modalAppName) modalAppName.value = cleanName;
  if (currentUserProfile) {
    if (modalAppRoll && currentUserProfile.rollNo) modalAppRoll.value = currentUserProfile.rollNo;
    if (modalAppBranch && currentUserProfile.branch) modalAppBranch.value = currentUserProfile.branch;
    if (modalAppPhone && currentUserProfile.phone) modalAppPhone.value = currentUserProfile.phone;
  }

  if (applyMembershipModal) applyMembershipModal.classList.remove("hidden");
}

if (closeApplyModalBtn) {
  closeApplyModalBtn.addEventListener("click", () => {
    if (applyMembershipModal) applyMembershipModal.classList.add("hidden");
  });
}

if (applyMembershipModalForm) {
  applyMembershipModalForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser) {
      showToast("Please login first!", "error");
      return;
    }

    if (modalAppSubmitBtn) {
      modalAppSubmitBtn.disabled = true;
      modalAppSubmitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting...`;
    }

    try {
      const applicationData = {
        clubId: applyClubId.value,
        clubName: applyClubNameHidden.value,
        presidentEmail: applyPresidentEmailHidden.value,
        coordinatorEmail: "",
        applicantName: modalAppName.value.trim(),
        rollNo: modalAppRoll.value.trim(),
        branch: modalAppBranch.value.trim(),
        phone: modalAppPhone.value.trim(),
        email: modalAppEmail.value.trim(),
        sop: modalAppSop.value.trim(),
        photoURL: currentUser.photoURL || "",
        status: "Pending",
        appliedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      await db.collection("clubApplications").add(applicationData);
      showToast(`🎉 Application successfully sent to ${applyClubNameHidden.value} Core Leadership!`, "success");
      applyMembershipModalForm.reset();
      if (applyMembershipModal) applyMembershipModal.classList.add("hidden");
    } catch (err) {
      showToast("Submission failed: " + err.message, "error");
    } finally {
      if (modalAppSubmitBtn) {
        modalAppSubmitBtn.disabled = false;
        modalAppSubmitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Submit Official Application`;
      }
    }
  });
}

/* =========================================================
   11.5 MY CLUBS & APPLICATIONS DASHBOARD (Student Self-Service)
   ========================================================= */

let myApplications = [];
let unsubMyApplications = null;
let currentMyClubsFilter = "all";

function subscribeMyApplications(email) {
  if (!email) return;
  if (unsubMyApplications) unsubMyApplications();

  unsubMyApplications = db.collection("clubApplications")
    .where("email", "==", email.toLowerCase())
    .onSnapshot((snap) => {
      myApplications = [];
      snap.forEach(doc => {
        myApplications.push({ id: doc.id, ...doc.data() });
      });
      myApplications.sort((a, b) => {
        const tA = (a.appliedAt && a.appliedAt.toMillis) ? a.appliedAt.toMillis() : 0;
        const tB = (b.appliedAt && b.appliedAt.toMillis) ? b.appliedAt.toMillis() : 0;
        return tB - tA;
      });
      updateMyClubsBadge();
      renderMyClubsList(currentMyClubsFilter);

      // If viewing a club full view, re-render it to update membership status
      if (window.location.hash.startsWith("#club/")) {
        const clubId = window.location.hash.replace("#club/", "");
        const currentClub = allApprovedClubs.find(c => c.id === clubId);
        if (currentClub) renderFullClubView(currentClub);
      }
    }, (err) => {
      console.warn("Could not subscribe to my applications:", err);
    });
}

function updateMyClubsBadge() {
  if (!myClubsCountBadge) return;
  const count = myApplications.length;
  if (count > 0) {
    myClubsCountBadge.textContent = count;
    myClubsCountBadge.classList.remove("hidden");
  } else {
    myClubsCountBadge.classList.add("hidden");
  }

  // Update tab counts
  const countAll = myApplications.length;
  const countApproved = myApplications.filter(a => a.status === "Approved").length;
  const countPending = myApplications.filter(a => (a.status || "Pending") === "Pending").length;
  const countShortlisted = myApplications.filter(a => a.status === "Shortlisted").length;

  const tabAll = document.getElementById("myTabCountAll");
  const tabAppr = document.getElementById("myTabCountApproved");
  const tabPend = document.getElementById("myTabCountPending");
  const tabShort = document.getElementById("myTabCountShortlisted");

  if (tabAll) tabAll.textContent = countAll;
  if (tabAppr) tabAppr.textContent = countApproved;
  if (tabPend) tabPend.textContent = countPending;
  if (tabShort) tabShort.textContent = countShortlisted;
}

function renderMyClubsList(filter = "all") {
  if (!myClubsListContainer) return;
  currentMyClubsFilter = filter;

  let filtered = myApplications;
  if (filter === "Approved") {
    filtered = myApplications.filter(a => a.status === "Approved");
  } else if (filter === "Pending") {
    filtered = myApplications.filter(a => (a.status || "Pending") === "Pending");
  } else if (filter === "Shortlisted") {
    filtered = myApplications.filter(a => a.status === "Shortlisted");
  }

  if (filtered.length === 0) {
    myClubsListContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-gray);">
        <div style="font-size: 40px; margin-bottom: 12px; color: #64748b;"><i class="fa-solid fa-folder-open"></i></div>
        <h4 style="font-size: 16px; color: var(--text-white); margin-bottom: 6px;">No Clubs in this list</h4>
        <p style="font-size: 13px;">${myApplications.length === 0 ? "You haven't joined or applied to any clubs yet. Explore the directory and apply!" : "No applications found under this status filter."}</p>
      </div>
    `;
    return;
  }

  myClubsListContainer.innerHTML = filtered.map(app => {
    const status = app.status || "Pending";
    let badgeClass = "status-pending-badge";
    let statusLabel = "⏳ In Review";
    let actionBtnLabel = "Withdraw Application";
    let actionBtnIcon = "fa-xmark";

    if (status === "Approved") {
      badgeClass = "status-approved-badge";
      statusLabel = "🌟 Active Member";
      actionBtnLabel = "Leave Club";
      actionBtnIcon = "fa-arrow-right-from-bracket";
    } else if (status === "Shortlisted") {
      badgeClass = "status-shortlisted-badge";
      statusLabel = "🎯 Shortlisted";
    } else if (status === "Rejected") {
      statusLabel = "❌ Not Selected";
      actionBtnLabel = "Remove from List";
    }

    const dateStr = (app.appliedAt && app.appliedAt.toDate)
      ? app.appliedAt.toDate().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
      : "Recently";

    return `
      <div class="my-club-card">
        <div class="my-club-card-top">
          <div class="my-club-info-group">
            <div class="my-club-icon-circle">
              <i class="fa-solid fa-shapes"></i>
            </div>
            <div class="my-club-titles">
              <h3>${app.clubName || "MITS Club"}</h3>
              <div class="my-club-meta-tags">
                <span class="my-club-cat-tag">Applied: ${dateStr}</span>
              </div>
            </div>
          </div>
          <span class="my-club-status-badge ${badgeClass}">${statusLabel}</span>
        </div>

        <div class="my-club-card-details">
          <div>Roll No: <strong>${app.rollNo || "N/A"}</strong></div>
          <div>Branch: <strong>${app.branch || "N/A"}</strong></div>
          <div>WhatsApp: <strong>${app.phone || "N/A"}</strong></div>
        </div>

        <div class="my-club-card-actions">
          <button type="button" class="btn-leave-club-sm" data-app-id="${app.id}" data-club-name="${app.clubName || 'Club'}" data-status="${status}">
            <i class="fa-solid ${actionBtnIcon}"></i> ${actionBtnLabel}
          </button>
          <button type="button" class="btn-view-club-sm" data-club-id="${app.clubId}">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> View Club
          </button>
        </div>
      </div>
    `;
  }).join("");

  // Attach Leave / Withdraw event handlers
  myClubsListContainer.querySelectorAll(".btn-leave-club-sm").forEach(btn => {
    btn.addEventListener("click", async () => {
      const appId = btn.getAttribute("data-app-id");
      const cName = btn.getAttribute("data-club-name");
      const st = btn.getAttribute("data-status");
      const actionText = (st === "Approved") ? `leave "${cName}"` : `withdraw your application from "${cName}"`;
      if (!confirm(`Are you sure you want to ${actionText}? Your membership data will be removed.`)) return;

      try {
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing...`;
        await db.collection("clubApplications").doc(appId).delete();
        showToast(`Successfully removed from ${cName}.`, "info");
      } catch (err) {
        showToast("Action failed: " + err.message, "error");
        btn.disabled = false;
      }
    });
  });

  // Attach View Club handlers
  myClubsListContainer.querySelectorAll(".btn-view-club-sm").forEach(btn => {
    btn.addEventListener("click", () => {
      const clubId = btn.getAttribute("data-club-id");
      if (myClubsModal) myClubsModal.classList.add("hidden");
      window.location.hash = `#club/${clubId}`;
    });
  });
}

// Nav Button for My Clubs
if (myClubsNavBtn) {
  myClubsNavBtn.addEventListener("click", () => {
    if (!currentUser) {
      showToast("Please login first to view your clubs!", "error");
      return;
    }
    renderMyClubsList(currentMyClubsFilter);
    if (myClubsModal) myClubsModal.classList.remove("hidden");
  });
}

if (closeMyClubsModalBtn) {
  closeMyClubsModalBtn.addEventListener("click", () => {
    if (myClubsModal) myClubsModal.classList.add("hidden");
  });
}

// Tab filters for My Clubs
document.querySelectorAll(".my-clubs-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".my-clubs-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    const filter = tab.getAttribute("data-filter") || "all";
    renderMyClubsList(filter);
  });
});

/* =========================================================
   12. MITS AI SMART CLUB ADVISOR & MATCHMAKER ENGINE
   ========================================================= */

if (aiAdvisorNavBtn) {
  aiAdvisorNavBtn.addEventListener("click", () => {
    if (aiAdvisorModal) aiAdvisorModal.classList.remove("hidden");
    if (aiUserInput) aiUserInput.focus();
  });
}

if (closeAiModalBtn) {
  closeAiModalBtn.addEventListener("click", () => {
    if (aiAdvisorModal) aiAdvisorModal.classList.add("hidden");
  });
}

// Quick AI tags
document.querySelectorAll(".ai-quick-tag").forEach(tagBtn => {
  tagBtn.addEventListener("click", () => {
    const query = tagBtn.getAttribute("data-query");
    if (aiUserInput) {
      aiUserInput.value = query;
      runAiClubMatcher(query);
    }
  });
});

if (aiRunMatchBtn) {
  aiRunMatchBtn.addEventListener("click", () => {
    const query = aiUserInput ? aiUserInput.value.trim() : "";
    if (!query) {
      showToast("Please write something about your interests or select a tag!", "info");
      return;
    }
    runAiClubMatcher(query);
  });
}

function runAiClubMatcher(queryText) {
  if (!allApprovedClubs || allApprovedClubs.length === 0) {
    showToast("No approved clubs found in portal to match.", "info");
    return;
  }

  aiRunMatchBtn.disabled = true;
  aiRunMatchBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Neural AI Analyzing MITS Clubs...`;

  setTimeout(() => {
    aiRunMatchBtn.disabled = false;
    aiRunMatchBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> ✨ Run AI Club Match Analysis`;

    const tokens = queryText.toLowerCase().split(/[\s,.;!?]+/).filter(w => w.length > 2);
    
    const scoredClubs = allApprovedClubs.map(club => {
      let score = 0;
      const searchableText = `${club.name} ${club.category} ${club.tagline} ${club.description} ${club.whyJoin}`.toLowerCase();
      
      tokens.forEach(tok => {
        if (searchableText.includes(tok)) score += 15;
        if ((club.category || "").toLowerCase().includes(tok)) score += 25;
        if ((club.name || "").toLowerCase().includes(tok)) score += 30;
      });

      // Normalize match percentage
      let baseMatch = 78 + Math.min(20, score);
      if (score === 0) baseMatch = 65 + Math.floor(Math.random() * 10);
      else if (baseMatch > 99) baseMatch = 99;

      return {
        club,
        score,
        matchPct: baseMatch
      };
    });

    scoredClubs.sort((a, b) => b.score - a.score || b.matchPct - a.matchPct);
    const topClubs = scoredClubs.slice(0, 3);

    renderAiResults(topClubs, queryText);
  }, 400);
}

function renderAiResults(scoredClubs, userQuery) {
  if (!aiMatchResults || !aiClubCardsList) return;
  aiMatchResults.classList.remove("hidden");
  aiClubCardsList.innerHTML = "";

  scoredClubs.forEach(({ club, matchPct }, idx) => {
    const card = document.createElement("div");
    card.className = "ai-match-card-item";
    
    let reasonText = `Strongly aligns with your interest in "${userQuery.slice(0, 30)}". Offers active mentorship, live projects, and regular MITS workshops.`;
    if (club.category === "Technical") reasonText = `Premier technical recommendation for coding, hackathons, open source, and full-stack engineering at MITS.`;
    else if (club.category === "Cultural") reasonText = `Top platform for stage presence, arts, cultural fest organization, and creative leadership.`;
    else if (club.category === "Sports") reasonText = `Active tournament preparation, inter-college meets, and athletic fitness training.`;
    else if (club.category === "Social") reasonText = `High impact community service, social leadership, and government-recognized NSS credentials.`;
    else if (club.category === "Literary") reasonText = `Excels in parliamentary debate, oratory contests, content writing, and public speaking.`;
    else if (club.category === "Innovation") reasonText = `E-Cell startup incubation, pitch decks, business competitions, and founder mentorship.`;

    card.innerHTML = `
      <div class="ai-match-top-row">
        <div class="ai-match-club-title">
          <span class="ai-rank-badge">#${idx + 1} Best Match</span>
          <h4>${club.name}</h4>
        </div>
        <div class="ai-match-score-pill">
          <i class="fa-solid fa-bolt"></i> ${matchPct}% Match
        </div>
      </div>
      <p class="ai-match-tagline">${club.tagline || ""}</p>
      <div class="ai-match-reason">
        <i class="fa-solid fa-sparkles"></i> <strong>AI Reason:</strong> ${reasonText}
      </div>
      <div class="ai-match-actions">
        <button type="button" class="btn-ai-explore-club" data-clubid="${club.id}">
          <i class="fa-solid fa-eye"></i> View Full Club
        </button>
      </div>
    `;

    card.querySelector(".btn-ai-explore-club").addEventListener("click", () => {
      aiAdvisorModal.classList.add("hidden");
      window.location.hash = `#club/${club.id}`;
    });

    aiClubCardsList.appendChild(card);
  });
}

// AI Notice Generator for President
if (aiNoticeGenBtn) {
  aiNoticeGenBtn.addEventListener("click", () => {
    const editAnnouncement = document.getElementById("editAnnouncement");
    const clubHeading = document.getElementById("editModalHeading").textContent.replace("Edit — ", "").trim();

    const templates = [
      `🚀 ${clubHeading} Alert! Registrations are now LIVE for our flagship upcoming workshop & hands-on contest in SAC Hall. Open for 1st-4th Year. Limited seats!`,
      `🔥 Official Notice: ${clubHeading} is hosting an exclusive orientation & recruitment drive this week! Join the official WhatsApp group for venue & timings.`,
      `✨ Get ready MITSians! ${clubHeading} brings you an action-packed hands-on session with industry mentors and certificate perks. Don't miss out!`,
      `📢 Urgent Update: ${clubHeading} core team recruitments closing soon! Fill out the application form on MITS Club Hub today.`
    ];

    const chosen = templates[Math.floor(Math.random() * templates.length)];
    if (editAnnouncement) {
      editAnnouncement.value = chosen;
      showToast("✨ AI drafted a high-impact campus notice for your club!", "success");
    }
  });
}

// Close modals when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === createClubModal) createClubModal.classList.add("hidden");
  if (e.target === editClubModal) editClubModal.classList.add("hidden");
  if (e.target === aiAdvisorModal) aiAdvisorModal.classList.add("hidden");
  if (e.target === myClubsModal) myClubsModal.classList.add("hidden");
  if (e.target === handoverGmailModal) handoverGmailModal.classList.add("hidden");
  if (e.target === viewApplicantsModal) {
    if (unsubApplicants) {
      unsubApplicants();
      unsubApplicants = null;
    }
    viewApplicantsModal.classList.add("hidden");
  }
  if (e.target === applyMembershipModal) applyMembershipModal.classList.add("hidden");
});

/* =========================================================
   13. SAMPLE MITS CLUBS (DISABLED IN PRODUCTION)
   ========================================================= */
// Production Mode: Sample seeding is disabled so real clubs can be registered and verified directly.
if (seedDataBtn) {
  seedDataBtn.addEventListener("click", async () => {
    showToast("Production mode active: Please register real clubs using '+ New Club'.", "info");
  });
}


