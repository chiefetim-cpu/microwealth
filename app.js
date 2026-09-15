/* =========================================================
   MICROWEALTH SCALE
   Main application logic
========================================================= */

const defaultUserData = {
  points: 0,
  streak: 0,
  completedChallenges: 0,
  currentDay: 1,
  currentChallenge: "7-Day Money Starter",
  joinedChallenges: [],
  lastCompletedDate: null
};

let userData = loadUserData();

/* -----------------------------
   DATA
----------------------------- */

function loadUserData() {
  try {
    const saved = localStorage.getItem("microWealthScaleUser");

    if (saved) {
      return {
        ...defaultUserData,
        ...JSON.parse(saved)
      };
    }
  } catch (error) {
    console.error("Load error:", error);
  }

  return { ...defaultUserData };
}

function saveUserData() {
  try {
    localStorage.setItem(
      "microWealthScaleUser",
      JSON.stringify(userData)
    );
  } catch (error) {
    console.error("Save error:", error);
  }
}

/* -----------------------------
   PAGE NAVIGATION
----------------------------- */

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const page = document.getElementById(pageId);

  if (page) {
    page.classList.add("active");
  }

  const nav = document.getElementById("mainNav");

  if (nav) {
    nav.classList.remove("open");
  }

  updateDashboard();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* -----------------------------
   MOBILE MENU
----------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  const menuButton = document.getElementById("menuButton");
  const mainNav = document.getElementById("mainNav");

  if (menuButton && mainNav) {
    menuButton.addEventListener("click", () => {
      mainNav.classList.toggle("open");
    });
  }

  updateDashboard();

  /* Reliable Complete Challenge button */
  const completeButton =
    document.getElementById("completeChallengeButton");

  if (completeButton) {
    completeButton.addEventListener(
      "click",
      completeCurrentChallenge
    );
  }

});

/* -----------------------------
   DASHBOARD
----------------------------- */

function updateDashboard() {

  const pointsElements = [
    document.getElementById("pointsValue"),
    document.getElementById("profilePoints")
  ];

  pointsElements.forEach(element => {
    if (element) {
      element.textContent = userData.points;
    }
  });

  const streakElements = [
    document.getElementById("streakValue"),
    document.getElementById("profileStreak")
  ];

  streakElements.forEach(element => {
    if (element) {
      element.textContent = userData.streak;
    }
  });

  const completedElements = [
    document.getElementById("completedValue"),
    document.getElementById("profileCompleted")
  ];

  completedElements.forEach(element => {
    if (element) {
      element.textContent =
        userData.completedChallenges;
    }
  });

  updateChallengeProgress();
}

/* -----------------------------
   CHALLENGE PROGRESS
----------------------------- */

function updateChallengeProgress() {

  const currentDayElement =
    document.getElementById("currentDay");

  const progressPercentElement =
    document.getElementById("progressPercent");

  const progressFill =
    document.getElementById("progressFill");

  if (!currentDayElement) return;

  const totalDays = 7;

  const currentDay =
    Math.min(userData.currentDay, totalDays);

  const completedDays =
    Math.max(currentDay - 1, 0);

  const percentage =
    Math.round(
      (completedDays / totalDays) * 100
    );

  currentDayElement.textContent =
    currentDay;

  if (progressPercentElement) {
    progressPercentElement.textContent =
      `${percentage}%`;
  }

  if (progressFill) {
    progressFill.style.width =
      `${percentage}%`;
  }
}

/* -----------------------------
   COMPLETE TODAY'S CHALLENGE
----------------------------- */

function completeCurrentChallenge() {

  console.log("Complete Challenge button clicked");

  const today =
    getLocalDate();

  /* Prevent duplicate completion */
  if (userData.lastCompletedDate === today) {

    showNotification(
      "You've already completed today's challenge! 🔥"
    );

    return;
  }

  /* Award points */
  userData.points += 50;

  /* Count completion */
  userData.completedChallenges += 1;

  /* Update streak */
  updateStreak(today);

  /* Move to next day */
  if (userData.currentDay < 7) {

    userData.currentDay += 1;

  } else {

    /* Completed the 7-day challenge */

    userData.points += 100;

    userData.currentDay = 1;

    userData.currentChallenge =
      "7-Day Money Starter";

    userData.lastCompletedDate = today;

    saveUserData();
    updateDashboard();

    showNotification(
      "🎉 7-Day Challenge completed! +150 points!"
    );

    return;
  }

  userData.lastCompletedDate = today;

  saveUserData();

  updateDashboard();

  showNotification(
    "Challenge completed! +50 points 🎉"
  );
}

/* -----------------------------
   LOCAL DATE
----------------------------- */

function getLocalDate() {

  const date = new Date();

  const year =
    date.getFullYear();

  const month =
    String(date.getMonth() + 1)
      .padStart(2, "0");

  const day =
    String(date.getDate())
      .padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* -----------------------------
   STREAK
----------------------------- */

function updateStreak(today) {

  if (!userData.lastCompletedDate) {

    userData.streak = 1;

    return;
  }

  const previousDate =
    new Date(
      userData.lastCompletedDate +
      "T00:00:00"
    );

  const currentDate =
    new Date(
      today +
      "T00:00:00"
    );

  const difference =
    Math.round(
      (
        currentDate -
        previousDate
      ) /
      (1000 * 60 * 60 * 24)
    );

  if (difference === 1) {

    userData.streak += 1;

  } else if (difference > 1) {

    userData.streak = 1;
  }
}

/* -----------------------------
   JOIN CHALLENGE
----------------------------- */

function joinChallenge(name, reward) {

  const alreadyJoined =
    userData.joinedChallenges.some(
      challenge =>
        challenge.name === name
    );

  if (alreadyJoined) {

    showNotification(
      `You're already participating in ${name}.`
    );

    showPage("home");

    return;
  }

  userData.joinedChallenges.push({
    name: name,
    reward: reward,
    joinedAt:
      new Date().toISOString()
  });

  saveUserData();

  showNotification(
    `🎯 You joined ${name}!`
  );

  showPage("home");
}

/* -----------------------------
   LIKE POSTS
----------------------------- */

function likePost(button) {

  if (!button) return;

  let likes =
    Number(
      button.dataset.likes || 0
    );

  likes += 1;

  button.dataset.likes =
    likes;

  const counter =
    button.querySelector("span");

  if (counter) {
    counter.textContent =
      likes;
  }

  button.style.transform =
    "scale(1.08)";

  setTimeout(() => {

    button.style.transform =
      "scale(1)";

  }, 150);
}

/* -----------------------------
   CREATE COMMUNITY POST
----------------------------- */

function createPost() {

  const text =
    prompt(
      "Share your progress with the MicroWealth Scale community:"
    );

  if (!text || !text.trim()) {
    return;
  }

  const postsContainer =
    document.getElementById(
      "communityPosts"
    );

  if (!postsContainer) return;

  const post =
    document.createElement("article");

  post.className =
    "post-card";

  post.innerHTML = `
    <div class="post-header">

      <div class="avatar">
        M
      </div>

      <div>
        <strong>
          Money Builder
        </strong>

        <small>
          Your Progress
        </small>
      </div>

    </div>

    <p>
      ${escapeHTML(text.trim())}
    </p>

    <button
      class="like-button"
      onclick="likePost(this)"
      data-likes="0"
    >
      ❤️ <span>0</span>
    </button>
  `;

  postsContainer.prepend(post);

  showNotification(
    "Your progress has been shared! 🎉"
  );
}

/* -----------------------------
   SECURITY
----------------------------- */

function escapeHTML(text) {

  const element =
    document.createElement("div");

  element.textContent =
    text;

  return element.innerHTML;
}

/* -----------------------------
   NOTIFICATIONS
----------------------------- */

function showNotification(message) {

  const existing =
    document.querySelector(
      ".app-notification"
    );

  if (existing) {
    existing.remove();
  }

  const notification =
    document.createElement("div");

  notification.className =
    "app-notification";

  notification.textContent =
    message;

  notification.style.position =
    "fixed";

  notification.style.bottom =
    "25px";

  notification.style.left =
    "50%";

  notification.style.transform =
    "translateX(-50%)";

  notification.style.zIndex =
    "9999";

  notification.style.background =
    "#17211c";

  notification.style.color =
    "#ffffff";

  notification.style.padding =
    "13px 20px";

  notification.style.borderRadius =
    "12px";

  notification.style.fontSize =
    "14px";

  notification.style.fontWeight =
    "700";

  notification.style.boxShadow =
    "0 10px 30px rgba(0,0,0,0.2)";

  document.body.appendChild(
    notification
  );

  setTimeout(() => {

    if (notification) {
      notification.remove();
    }

  }, 3000);
}


```javascript
/* =========================================
   PROFILE INFORMATION
========================================= */

function saveProfile() {

  const nameInput =
    document.getElementById("userName");

  const countryInput =
    document.getElementById("userCountry");

  const currencySelect =
    document.getElementById("currencySelect");

  const name =
    nameInput
      ? nameInput.value.trim()
      : "";

  const country =
    countryInput
      ? countryInput.value.trim()
      : "";

  const currency =
    currencySelect
      ? currencySelect.value
      : "INR";


  /* Save user information */

  userData.profileName =
    name || "Money Builder";

  userData.profileCountry =
    country || "Global Money Builder";

  userData.currency =
    currency;


  saveUserData();

  updateProfileDisplay();

  showNotification(
    "Profile saved successfully! 🎉"
  );
}


/* =========================================
   UPDATE PROFILE DISPLAY
========================================= */

function updateProfileDisplay() {

  const name =
    userData.profileName ||
    "Money Builder";

  const country =
    userData.profileCountry ||
    "Global Money Builder";

  const currency =
    userData.currency ||
    "INR";


  /* Profile name */

  const profileName =
    document.getElementById(
      "profileName"
    );

  if (profileName) {
    profileName.textContent =
      name;
  }


  /* Country */

  const profileCountry =
    document.getElementById(
      "profileCountry"
    );

  if (profileCountry) {

    if (
      country ===
      "Global Money Builder"
    ) {

      profileCountry.textContent =
        "🌍 Global Money Builder";

    } else {

      profileCountry.textContent =
        `🌍 ${country}`;
    }
  }


  /* Input fields */

  const nameInput =
    document.getElementById(
      "userName"
    );

  if (nameInput) {
    nameInput.value =
      userData.profileName || "";
  }


  const countryInput =
    document.getElementById(
      "userCountry"
    );

  if (countryInput) {
    countryInput.value =
      userData.profileCountry || "";
  }


  /* Currency */

  const currencySelect =
    document.getElementById(
      "currencySelect"
    );

  if (currencySelect) {
    currencySelect.value =
      currency;
  }


  /* Profile avatar */

  const avatar =
    document.querySelector(
      ".profile-avatar"
    );

  if (avatar) {

    avatar.textContent =
      name
        .charAt(0)
        .toUpperCase();
  }
}


/* =========================================
   PROFILE INITIALIZATION
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateProfileDisplay();

  }
);



