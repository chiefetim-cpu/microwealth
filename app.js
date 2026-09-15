/* =========================================================
   MICROWEALTH SCALE
   Main application logic
========================================================= */


/* =========================================================
   USER DATA
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


/* =========================================================
   LOAD USER DATA
========================================================= */

let userData = loadUserData();


function loadUserData() {
  try {
    const savedData = localStorage.getItem("microWealthScaleUser");

    if (savedData) {
      return {
        ...defaultUserData,
        ...JSON.parse(savedData)
      };
    }
  } catch (error) {
    console.error("Unable to load saved user data:", error);
  }

  return { ...defaultUserData };
}


/* =========================================================
   SAVE USER DATA
========================================================= */

function saveUserData() {
  try {
    localStorage.setItem(
      "microWealthScaleUser",
      JSON.stringify(userData)
    );
  } catch (error) {
    console.error("Unable to save user data:", error);
  }
}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(pageId) {

  const pages = document.querySelectorAll(".page");

  pages.forEach(page => {
    page.classList.remove("active");
  });


  const selectedPage = document.getElementById(pageId);

  if (selectedPage) {
    selectedPage.classList.add("active");
  }


  /* Close mobile menu */

  const nav = document.getElementById("mainNav");

  if (nav) {
    nav.classList.remove("open");
  }


  /* Scroll to top */

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  updateDashboard();
}


/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton = document.getElementById("menuButton");
const mainNav = document.getElementById("mainNav");


if (menuButton && mainNav) {

  menuButton.addEventListener("click", () => {

    mainNav.classList.toggle("open");

  });

}


/* =========================================================
   UPDATE DASHBOARD
========================================================= */

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
      element.textContent = userData.completedChallenges;
    }

  });


  updateChallengeProgress();
}


/* =========================================================
   CHALLENGE PROGRESS
========================================================= */

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
    Math.round((completedDays / totalDays) * 100);


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


/* =========================================================
   COMPLETE TODAY'S CHALLENGE
========================================================= */

function completeCurrentChallenge() {

  const today =
    new Date().toISOString().split("T")[0];


  /* Prevent multiple completions in one day */

  if (userData.lastCompletedDate === today) {

    showNotification(
      "You've already completed today's challenge! 🔥"
    );

    return;
  }


  /* Award points */

  userData.points += 50;

  userData.completedChallenges += 1;


  /* Update streak */

  updateStreak(today);


  /* Move challenge forward */

  if (userData.currentDay < 7) {

    userData.currentDay += 1;

  } else {

    userData.currentDay = 1;

    showNotification(
      "🎉 Challenge completed! You earned a bonus!"
    );

    userData.points += 100;
  }


  userData.lastCompletedDate = today;


  saveUserData();

  updateDashboard();


  showNotification(
    "Challenge completed! +50 points 🎉"
  );
}


/* =========================================================
   STREAK SYSTEM
========================================================= */

function updateStreak(today) {

  if (!userData.lastCompletedDate) {

    userData.streak = 1;

    return;
  }


  const previousDate =
    new Date(userData.lastCompletedDate);


  const currentDate =
    new Date(today);


  const difference =
    Math.floor(
      (currentDate - previousDate) /
      (1000 * 60 * 60 * 24)
    );


  if (difference === 1) {

    userData.streak += 1;

  } else if (difference > 1) {

    userData.streak = 1;
  }
}


/* =========================================================
   JOIN CHALLENGE
========================================================= */

function joinChallenge(name, reward) {

  const alreadyJoined =
    userData.joinedChallenges.some(
      challenge => challenge.name === name
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
    joinedAt: new Date().toISOString()
  });


  saveUserData();


  showNotification(
    `🎯 You joined ${name}!`
  );


  showPage("home");
}


/* =========================================================
   COMMUNITY LIKE
========================================================= */

function likePost(button) {

  if (!button) return;


  let likes =
    Number(button.dataset.likes || 0);


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


/* =========================================================
   CREATE COMMUNITY POST
========================================================= */

function createPost() {

  const text =
    prompt(
      "Share your progress with the MicroWealth Scale community:"
    );


  if (!text || !text.trim()) {
    return;
  }


  const postsContainer =
    document.getElementById("communityPosts");


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


/* =========================================================
   SECURITY HELPER
========================================================= */

function escapeHTML(text) {

  const element =
    document.createElement("div");


  element.textContent =
    text;


  return element.innerHTML;
}


/* =========================================================
   NOTIFICATION
========================================================= */

function showNotification(message) {

  const existing =
    document.querySelector(".app-notification");


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

    notification.remove();

  }, 3000);
}


/* =========================================================
   INITIALIZE APP
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateDashboard();

  }
);
