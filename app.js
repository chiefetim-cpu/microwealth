/* =========================================================
   MICROWEALTH SCALE
   Stable application logic
========================================================= */

const defaultUserData = {
  points: 0,
  streak: 0,
  completedChallenges: 0,
  currentDay: 1,
  currentChallenge: "7-Day Starter",
  joinedChallenges: [],
  lastCompletedDate: null,
  profileName: "",
  profileCountry: "",
  currency: "" 
};

const challengeLibrary = {
  "7-Day Starter": {
    duration: 7,
    reward: 300,
    tasks: [
      "Save ₹20 today.",
      "Write down everything you spent today.",
      "Avoid one unnecessary purchase.",
      "Set aside ₹30 for your savings goal.",
      "Review your spending from the last 4 days.",
      "Save ₹50 today.",
      "Create one money goal for the next 30 days."
    ]
  },

  "30-Day Wealth": {
    duration: 30,
    reward: 1000,
    tasks: [
      "Save a small amount today.",
      "Track every expense today.",
      "Avoid one unnecessary purchase.",
      "Review your spending.",
      "Set a savings target.",
      "Save a little more than yesterday.",
      "Check your subscriptions.",
      "Plan tomorrow's spending.",
      "Put money aside before spending.",
      "Review your financial goal.",
      "Avoid an impulse purchase.",
      "Track your progress.",
      "Save something today.",
      "Review your biggest expense.",
      "Plan a no-spend day.",
      "Add to your savings.",
      "Check your weekly progress.",
      "Identify one money leak.",
      "Save again today.",
      "Review your financial habits.",
      "Plan your next savings target.",
      "Avoid unnecessary spending.",
      "Track today's expenses.",
      "Add money to your savings.",
      "Review your progress.",
      "Set a new small financial goal.",
      "Save something today.",
      "Plan tomorrow's budget.",
      "Review your month.",
      "Celebrate your consistency."
    ]
  },

  "52-Week Savings": {
  duration: 52,
  reward: 2500,
  tasks: [
    "Set aside a small amount this week."
  ]
},

"No-Spend Challenge": {
  duration: 7,
  reward: 500,
  tasks: [
    "Avoid one unnecessary purchase today.",
    "Track every expense you make today.",
    "Avoid buying food or drinks you don't need.",
    "Have a no-spend day and use what you already have.",
    "Avoid impulse purchases today.",
    "Review what you almost bought and decide whether you really need it.",
    "Complete your final no-spend day and review what you saved."
  ]
}
};

let userData = loadUserData();


/* -----------------------------
   DATA
----------------------------- */

function loadUserData() {

  try {

    const saved =
      localStorage.getItem(
        "microWealthScaleUser"
      );

    if (saved) {

      const savedData = JSON.parse(saved);

      return {
        ...defaultUserData,
        ...savedData,

        // Add achievement reward tracking
        // without changing existing saved data.
        achievementRewards:
          Array.isArray(savedData.achievementRewards)
            ? savedData.achievementRewards
            : []
      };

    }

  } catch (error) {

    console.error(
      "Unable to load user data:",
      error
    );

  }

  return {
    ...defaultUserData,
    achievementRewards: []
  };
}


function saveUserData() {

  try {

    localStorage.setItem(
      "microWealthScaleUser",
      JSON.stringify(userData)
    );

  } catch (error) {

    console.error(
      "Unable to save user data:",
      error
    );

  }
}


/* -----------------------------
   NAVIGATION
----------------------------- */

function showPage(pageId) {

  document
    .querySelectorAll(".page")
    .forEach(page => {

      page.classList.remove("active");

    });

  const selectedPage =
    document.getElementById(pageId);

  if (selectedPage) {

    selectedPage.classList.add("active");

  }

  const nav =
    document.getElementById("mainNav");

  if (nav) {

    nav.classList.remove("open");

  }

  updateDashboard();

  updateProfileDisplay();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* -----------------------------
   MOBILE MENU
----------------------------- */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const menuButton =
      document.getElementById(
        "menuButton"
      );

    const mainNav =
      document.getElementById(
        "mainNav"
      );

    if (
      menuButton &&
      mainNav
    ) {

      menuButton.addEventListener(
        "click",
        () => {

          mainNav.classList.toggle(
            "open"
          );

        }
      );

    }

    updateDashboard();

    updateProfileDisplay();

  }
);


/* -----------------------------
   DASHBOARD
----------------------------- */

function updateDashboard() {

  const pointsElements = [

    document.getElementById(
      "pointsValue"
    ),

    document.getElementById(
      "profilePoints"
    )

  ];

  pointsElements.forEach(
    element => {

      if (element) {

        element.textContent =
          userData.points;

      }

    }
  );


  const streakElements = [

    document.getElementById(
      "streakValue"
    ),

    document.getElementById(
      "profileStreak"
    )

  ];

  streakElements.forEach(
    element => {

      if (element) {

        element.textContent =
          userData.streak;

      }

    }
  );


  const completedElements = [

    document.getElementById(
      "completedValue"
    ),

    document.getElementById(
      "profileCompleted"
    )

  ];

  completedElements.forEach(
    element => {

      if (element) {

        element.textContent =
          userData.completedChallenges;

      }

    }
  );


  updateActiveChallengeDisplay();
 }

/* -----------------------------
   CHALLENGE PROGRESS
----------------------------- */

function updateChallengeProgress() {
  const currentDayElement = document.getElementById("currentDay");
  const progressPercentElement =
    document.getElementById("progressPercent");
  const progressFill =
    document.getElementById("progressFill");
  const challengeTotalDays =
    document.getElementById("challengeTotalDays");

  const challengeName =
    userData.currentChallenge || "7-Day Starter";

  const challenge =
    challengeLibrary[challengeName] ||
    challengeLibrary["7-Day Starter"];

  const totalDays = challenge.duration;
  const currentDay = Math.min(
    userData.currentDay || 1,
    totalDays
  );

  const completedDays = Math.max(currentDay - 1, 0);
  const percentage = Math.round(
    (completedDays / totalDays) * 100
  );

  if (currentDayElement) {
    currentDayElement.textContent = currentDay;
  }

  if (challengeTotalDays) {
    challengeTotalDays.textContent = totalDays;
  }

  if (progressPercentElement) {
    progressPercentElement.textContent = `${percentage}%`;
  }

  if (progressFill) {
    progressFill.style.width = `${percentage}%`;
  }
}

function updateActiveChallengeDisplay() {
  const challengeName =
    userData.currentChallenge || "7-Day Starter";

  const challenge =
    challengeLibrary[challengeName] ||
    challengeLibrary["7-Day Starter"];

  const nameElement =
    document.getElementById("activeChallengeName");

  const titleElement =
    document.getElementById("activeChallengeTitle");

  const descriptionElement =
    document.getElementById("activeChallengeDescription");

   const challengeButtons =
  document.querySelectorAll(".challenge-join-button");

   const taskElement =
    document.getElementById("dailyTask");

  if (nameElement) {
    nameElement.textContent = challengeName;
  }

  if (titleElement) {
    titleElement.textContent =
      challengeName === "7-Day Starter"
        ? "Build Your First Money Habit"
        : challengeName;
  }

  if (descriptionElement) {
    descriptionElement.textContent =
      `Complete one money action every day for ${challenge.duration} days.`;
  }

  if (taskElement) {
   const taskIndex = Math.min(
    Math.max((userData.currentDay || 1) - 1, 0),
    challenge.tasks.length - 1
  );

  taskElement.textContent =
    `Today's Task: ${challenge.tasks[taskIndex]}`;
}

   challengeButtons.forEach(button => {
  const buttonChallenge = button.getAttribute("onclick");

  if (!buttonChallenge) return;

  const isThisChallenge =
    buttonChallenge.includes(`'${challengeName}'`);

  const joinedChallenge = userData.joinedChallenges.find(
    item => buttonChallenge.includes(`'${item.name}'`)
  );

  // Currently active challenge
  if (isThisChallenge && joinedChallenge && !joinedChallenge.completed) {
    button.textContent = "✓ Active Challenge";
    button.classList.add("active-challenge-button");
    button.classList.remove("restart-challenge-button");
    return;
  }

  // Previously completed challenge
  if (joinedChallenge && joinedChallenge.completed) {
    button.textContent = "↻ Restart Challenge";
    button.classList.remove("active-challenge-button");
    button.classList.add("restart-challenge-button");
    return;
  }

  // Challenge not joined yet
  button.textContent = "Join Challenge";
  button.classList.remove("active-challenge-button");
  button.classList.remove("restart-challenge-button");
});
   
  updateChallengeProgress();
}

/* -----------------------------
   COMPLETE CHALLENGE
----------------------------- */

function completeCurrentChallenge() {
  const today = getLocalDate();

  const challengeName = userData.currentChallenge || "7-Day Starter";
  const challenge = challengeLibrary[challengeName];

  if (!challenge) {
    showNotification("Challenge not found.");
    return;
  }

  // Find the user's saved progress for the active challenge
  const activeChallenge = userData.joinedChallenges.find(
    item => item.name === challengeName
  );

  if (!activeChallenge) {
    showNotification("Please join this challenge first.");
    return;
  }

  // Prevent completing the same challenge twice on the same day
  if (activeChallenge.lastCompletedDate === today) {
    showNotification("You've already completed today's challenge! 🔥");
    return;
  }

  const totalDays = challenge.duration;
  const currentDay = activeChallenge.currentDay || 1;

  // Daily reward
  userData.points += 50;
  userData.completedChallenges += 1;

  // Update streak
  updateStreak(today);

  // Save completion date specifically for this challenge
  activeChallenge.lastCompletedDate = today;
  
   // Check if the challenge is completed
  if (currentDay >= totalDays) {
  userData.points += challenge.reward;

  // Mark this challenge as completed
  activeChallenge.completed = true;
  activeChallenge.completedAt = new Date().toISOString();

    saveUserData();
    updateDashboard();
    updateProfileDisplay();

    showNotification(
      `🎉 ${challengeName} completed! +${challenge.reward + 50} points!`
    );

    setTimeout(() => {
      activeChallenge.currentDay = 1;
      activeChallenge.lastCompletedDate = null;

      userData.currentDay = 1;
      userData.lastCompletedDate = null;

      saveUserData();
      updateDashboard();
      updateProfileDisplay();
    }, 1500);

    return;
  }

  // Move this challenge to its next day
  activeChallenge.currentDay = currentDay + 1;

  // Keep the existing global value synchronized for the current display
  userData.currentDay = activeChallenge.currentDay;
  userData.lastCompletedDate = today;

  saveUserData();

checkAchievementRewards();

updateDashboard();
updateProfileDisplay();

  showNotification("Challenge completed! +50 points 🎉");
}

/* -----------------------------
   LOCAL DATE
----------------------------- */

function getLocalDate() {

  const date =
    new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


/* -----------------------------
   STREAK
----------------------------- */

function updateStreak(today) {

  if (
    !userData.lastCompletedDate
  ) {

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


  if (
    difference === 1
  ) {

    userData.streak += 1;

  } else if (
    difference > 1
  ) {

    userData.streak = 1;

  }
}


/* -----------------------------
   JOIN CHALLENGE
----------------------------- */

function joinChallenge(name, reward) {
  const challenge = challengeLibrary[name];

  if (!challenge) {
    showNotification("Challenge not found.");
    return;
  }

  const existingChallenge = userData.joinedChallenges.find(
  item => item.name === name
);

// If the challenge was already completed,
// start a fresh attempt.
if (existingChallenge && existingChallenge.completed === true) {
  const newAttemptNumber = (existingChallenge.attempt || 1) + 1;

  const newAttempt = {
    name: name,
    reward: challenge.reward,
    duration: challenge.duration,
    attempt: newAttemptNumber,
    currentDay: 1,
    lastCompletedDate: null,
    completed: false,
    completedAt: null,
    joinedAt: new Date().toISOString()
  };

  userData.joinedChallenges.push(newAttempt);

  userData.currentChallenge = name;
  userData.currentDay = 1;
  userData.lastCompletedDate = null;

  saveUserData();
  updateDashboard();
  updateProfileDisplay();

  showNotification(`🔄 ${name} restarted — Attempt ${newAttemptNumber}!`);
  showPage("home");
  return;
}

// If the challenge already exists and is still active,
// restore its saved progress.
if (existingChallenge) {
  userData.currentChallenge = name;
  userData.currentDay = existingChallenge.currentDay || 1;

  saveUserData();
  updateDashboard();
  updateProfileDisplay();

  showNotification(`You're already participating in ${name}.`);
  showPage("home");
  return;
}

  // Create a new challenge
  const newChallenge = {
  name: name,
  reward: challenge.reward,
  duration: challenge.duration,
  attempt: 1,
  currentDay: 1,
  lastCompletedDate: null,
  completed: false,
  completedAt: null,
  joinedAt: new Date().toISOString()
};

  userData.joinedChallenges.push(newChallenge);

  // Make the new challenge active
  userData.currentChallenge = name;
  userData.currentDay = 1;
  userData.lastCompletedDate = null;

  saveUserData();
  updateDashboard();
  updateProfileDisplay();

  showNotification(`🎯 You joined ${name}!`);

  showPage("home");
}
/* -----------------------------
   LIKE POST
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


  setTimeout(
    () => {

      button.style.transform =
        "scale(1)";

    },
    150
  );
}


/* -----------------------------
   CREATE POST
----------------------------- */

function createPost() {

  const text =
    prompt(
      "Share your progress with the MicroWealth Scale community:"
    );


  if (
    !text ||
    !text.trim()
  ) {

    return;

  }


  const postsContainer =
    document.getElementById(
      "communityPosts"
    );


  if (!postsContainer) {

    return;

  }


  const post =
    document.createElement(
      "article"
    );


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
      ${escapeHTML(
        text.trim()
      )}
    </p>

    <button
      class="like-button"
      onclick="likePost(this)"
      data-likes="0"
    >
      ❤️ <span>0</span>
    </button>

  `;


  postsContainer.prepend(
    post
  );


  showNotification(
    "Your progress has been shared! 🎉"
  );
}


/* -----------------------------
   HTML SAFETY
----------------------------- */

function escapeHTML(text) {

  const element =
    document.createElement(
      "div"
    );

  element.textContent =
    text;

  return element.innerHTML;
}


/* -----------------------------
   PROFILE
----------------------------- */

function saveProfile() {
  const nameInput = document.getElementById("userName");
  const countryInput = document.getElementById("userCountry");
  const currencySelect = document.getElementById("currencySelect");

  userData.profileName = nameInput
    ? nameInput.value.trim()
    : "";

  userData.profileCountry = countryInput
    ? countryInput.value.trim()
    : "";

  userData.currency = currencySelect
  ? currencySelect.value
  : "";

  saveUserData();
  updateProfileDisplay();

  showNotification("Profile saved successfully! 🎉");
}


function updateProfileDisplay() {
  const name = userData.profileName || "Money Builder";

  const country =
    userData.profileCountry || "Global Money Builder";

  const currency =
  userData.currency || "";

  const profileName =
    document.getElementById("profileName");

  if (profileName) {
    profileName.textContent = name;
  }


  const profileCountry =
    document.getElementById("profileCountry");

  if (profileCountry) {
    profileCountry.textContent =
      country === "Global Money Builder"
        ? "🌍 Global Money Builder"
        : `🌍 ${country}`;
  }


  const nameInput =
    document.getElementById("userName");

  if (nameInput) {
    nameInput.value =
      userData.profileName || "";
  }


  const countryInput =
    document.getElementById("userCountry");

  if (countryInput) {
    countryInput.value =
      userData.profileCountry || "";
  }


  const currencySelect =
    document.getElementById("currencySelect");

  if (currencySelect) {
    currencySelect.value = currency;
  }


  const avatar =
    document.querySelector(".profile-avatar");

  if (avatar) {
    avatar.textContent =
      name.charAt(0).toUpperCase();
  }

   updateChallengeHistory();
   updateAchievements();
   updateAchievementSummary();
}

function updateChallengeHistory() {
  const historyList = document.getElementById("challengeHistoryList");

  if (!historyList) return;

  if (
    !userData.joinedChallenges ||
    userData.joinedChallenges.length === 0
  ) {
    historyList.innerHTML = `
      <p class="empty-history">
        Your challenge history will appear here.
      </p>
    `;
    return;
  }

  historyList.innerHTML = "";

  userData.joinedChallenges.forEach(item => {
    const challenge = challengeLibrary[item.name];

    if (!challenge) return;

    const currentDay = Math.min(
      item.currentDay || 1,
      challenge.duration
    );

    const isCompleted = item.completed === true;

    const completedDays = isCompleted
      ? challenge.duration
      : Math.max(currentDay - 1, 0);

    let completionDate = "";

    if (isCompleted && item.completedAt) {
      const date = new Date(item.completedAt);

      completionDate = date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    }

    const card = document.createElement("div");
    card.className = "history-card";

    card.innerHTML = `
      <div class="history-card-icon">
        ${isCompleted ? "🏆" : "🔥"}
      </div>

      <div class="history-card-content">
        <h4>${item.name}</h4>

      <p class="history-attempt">
         Attempt ${item.attempt || 1}
      </p>

      <p>
          ${
            isCompleted
              ? `Completed: ${completedDays}/${challenge.duration} days`
              : `In Progress: Day ${currentDay}/${challenge.duration}`
          }
        </p>

        <p class="history-reward">
          💰 Bonus: +${item.reward || challenge.reward} points
        </p>

        ${
          isCompleted && completionDate
            ? `<p class="history-date">📅 Completed on ${completionDate}</p>`
            : ""
        }

        <span class="history-status">
          ${isCompleted ? "Completed" : "In Progress"}
        </span>
      </div>
    `;

    historyList.appendChild(card);
  });
}


function updateAchievements() {
  const achievementsList =
    document.getElementById("achievementsList");

  if (!achievementsList) return;

  const firstStepUnlocked =
    (userData.completedChallenges || 0) >= 1;

  const streakUnlocked =
    (userData.streak || 0) >= 7;

  const pointsUnlocked =
    (userData.points || 0) >= 500;

  const championUnlocked =
    userData.joinedChallenges?.some(
      challenge => challenge.completed === true
    );

  const achievements = [
  {
    icon: "🌱",
    title: "First Step",
    description: "Complete your first challenge day.",
    reward: 25,
    unlocked:
      (userData.completedChallenges || 0) >= 1
  },

  {
    icon: "🔥",
    title: "7-Day Streak",
    description: "Reach a 7-day streak.",
    reward: 100,
    unlocked:
      (userData.streak || 0) >= 7
  },

  {
    icon: "💰",
    title: "Point Builder",
    description: "Earn 500 points.",
    reward: 150,
    unlocked:
      (userData.points || 0) >= 500
  },

  {
    icon: "🏆",
    title: "Challenge Champion",
    description: "Complete an entire challenge.",
    reward: 250,
    unlocked:
      userData.joinedChallenges?.some(
        challenge => challenge.completed === true
      )
  }
];

  achievementsList.innerHTML = achievements
    .map(achievement => `
      <div class="achievement-card ${
        achievement.unlocked ? "unlocked" : "locked"
      }">

        <div class="achievement-icon">
          ${
            achievement.unlocked
              ? achievement.icon
              : "🔒"
          }
        </div>

        <div class="achievement-content">
          <h4>${achievement.title}</h4>

         <p>${achievement.description}</p>

         <p class="achievement-reward">
           🪙 Reward: +${achievement.reward} points
         </p>

         <span class="achievement-status">
            ${
              achievement.unlocked
                ? "Unlocked"
                : "Locked"
            }
          </span>
        </div>

      </div>
    `)
    .join("");
}

function checkAchievementRewards() {

  if (!Array.isArray(userData.achievementRewards)) {
    userData.achievementRewards = [];
  }

  const achievements = [
    {
      title: "First Step",
      reward: 25,
      unlocked:
        (userData.completedChallenges || 0) >= 1
    },

    {
      title: "7-Day Streak",
      reward: 100,
      unlocked:
        (userData.streak || 0) >= 7
    },

    {
      title: "Point Builder",
      reward: 150,
      unlocked:
        (userData.points || 0) >= 500
    },

    {
      title: "Challenge Champion",
      reward: 250,
      unlocked:
        userData.joinedChallenges?.some(
          challenge => challenge.completed === true
        )
    }
  ];

  let totalReward = 0;
  let unlockedNames = [];

  achievements.forEach(achievement => {

    if (
      achievement.unlocked &&
      !userData.achievementRewards.includes(
        achievement.title
      )
    ) {

      userData.points += achievement.reward;

      userData.achievementRewards.push(
        achievement.title
      );

      totalReward += achievement.reward;
      unlockedNames.push(achievement.title);
    }
  });

  if (totalReward > 0) {

    saveUserData();

    showNotification(
      `🏆 Achievement reward: +${totalReward} points!`
    );

    console.log(
      "Achievement rewards added:",
      unlockedNames,
      "Total:",
      totalReward,
      "New points:",
      userData.points
    );

  } else {

    console.log(
      "No new achievement rewards.",
      "Already rewarded:",
      userData.achievementRewards,
      "Current points:",
      userData.points
    );
  }
}

function updateAchievementSummary() {
  const countElement =
    document.getElementById("achievementCount");

  const iconsElement =
    document.getElementById("achievementMiniIcons");

  const progressFill =
    document.getElementById("achievementProgressFill");

  const progressText =
    document.getElementById("achievementProgressText");

  if (
    !countElement ||
    !iconsElement ||
    !progressFill ||
    !progressText
  ) {
    return;
  }

  const achievements = [
    {
      icon: "🌱",
      unlocked:
        (userData.completedChallenges || 0) >= 1
    },
    {
      icon: "🔥",
      unlocked:
        (userData.streak || 0) >= 7
    },
    {
      icon: "💰",
      unlocked:
        (userData.points || 0) >= 500
    },
    {
      icon: "🏆",
      unlocked:
        userData.joinedChallenges?.some(
          challenge => challenge.completed === true
        )
    }
  ];

  const unlockedCount =
    achievements.filter(
      achievement => achievement.unlocked
    ).length;

  const totalAchievements = achievements.length;

  const percentage = Math.round(
    (unlockedCount / totalAchievements) * 100
  );

  countElement.textContent =
    `${unlockedCount} / ${totalAchievements}`;

  iconsElement.textContent =
    achievements
      .map(achievement =>
        achievement.unlocked
          ? achievement.icon
          : "🔒"
      )
      .join(" ");

  progressFill.style.width =
    `${percentage}%`;

  progressText.textContent =
    unlockedCount === totalAchievements
      ? "🎉 All achievements unlocked!"
      : `${unlockedCount} of ${totalAchievements} achievements unlocked.`;
}


/* -----------------------------
   NOTIFICATION
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
    document.createElement(
      "div"
    );


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


  setTimeout(
    () => {

      if (notification) {

        notification.remove();

      }

    },
    3000
  );
}

function saveSavingsGoal() {
  const nameInput = document.getElementById("savingsGoalName");
  const targetInput = document.getElementById("savingsGoalTarget");
  const amountInput = document.getElementById("savingsGoalAmount");
   
   const locationInput =
  document.querySelector('input[name="savingsLocation"]:checked');

  const name = nameInput.value.trim();
  const target = Number(targetInput.value);
  const saved = Number(amountInput.value);
  const location = locationInput ? locationInput.value : "";

  if (!name) {
    showNotification("Please enter a name for your savings goal.");
    return;
  }

  if (!Number.isFinite(target) || target <= 0) {
    showNotification("Please enter a valid savings target.");
    return;
  }

  if (!Number.isFinite(saved) || saved < 0) {
    showNotification("Please enter a valid saved amount.");
    return;
  }

  if (saved > target) {
    showNotification("Your saved amount cannot exceed your target.");
    return;
  }

  if (!location) {
    showNotification("Please select where you are saving.");
    return;
  }

  try {
    const storageKey = "microWealthScaleSavingsGoal";

    const goal = {
      name: name,
      target: target,
      saved: saved,
      location: location,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(storageKey, JSON.stringify(goal));

    renderSavingsGoal(goal);

    showNotification("🎯 Savings goal saved successfully!");
  } catch (error) {
    console.error("Unable to save savings goal:", error);
    showNotification("Unable to save your goal. Please try again.");
  }
}

function renderSavingsGoal(goal) {
  const nameInput = document.getElementById("savingsGoalName");
  const targetInput = document.getElementById("savingsGoalTarget");
  const amountInput = document.getElementById("savingsGoalAmount");
  
   const locationInput =
  document.querySelector('input[name="savingsLocation"]:checked');

  const progressContainer =
    document.getElementById("savingsGoalProgress");

  const percentElement =
    document.getElementById("savingsGoalPercent");

  const progressFill =
    document.getElementById("savingsGoalProgressFill");

  const summary =
    document.getElementById("savingsGoalSummary");

  const displayNameElement =
    document.getElementById("savingsGoalDisplayName");

  const savedAmountElement =
    document.getElementById("savingsGoalSavedAmount");

  if (
    !nameInput ||
    !targetInput ||
    !amountInput ||
    !progressContainer ||
    !percentElement ||
    !progressFill ||
    !summary
  ) {
    console.error("Savings goal display elements are missing.");
    return;
  }

  nameInput.value = goal.name;
  targetInput.value = goal.target;
  amountInput.value = goal.saved;

  if (locationSelect && goal.location) {
    locationSelect.value = goal.location;
  }

  const percentage = Math.min(
    100,
    Math.round((goal.saved / goal.target) * 100)
  );

  if (displayNameElement) {
    displayNameElement.textContent = goal.name;
  }

  if (savedAmountElement) {
    savedAmountElement.textContent =
      `₹${goal.saved.toLocaleString("en-IN")} saved`;
  }

  percentElement.textContent = `${percentage}%`;
  progressFill.style.width = `${percentage}%`;

  const remaining = Math.max(
    0,
    goal.target - goal.saved
  );

  if (remaining === 0) {
    summary.textContent =
      `🎉 Congratulations! You've reached your "${goal.name}" goal.`;
  } else {
    summary.textContent =
      `₹${goal.saved.toLocaleString("en-IN")} saved of ` +
      `₹${goal.target.toLocaleString("en-IN")}. ` +
      `₹${remaining.toLocaleString("en-IN")} left to reach your goal.`;
  }

  progressContainer.style.display = "block";
}

function loadSavingsGoal() {
  try {
    const savedGoal = localStorage.getItem(
      "microWealthScaleSavingsGoal"
    );

    if (!savedGoal) return;

    const goal = JSON.parse(savedGoal);

    if (
      !goal ||
      typeof goal.name !== "string" ||
      !Number.isFinite(goal.target) ||
      goal.target <= 0 ||
      !Number.isFinite(goal.saved) ||
      goal.saved < 0 ||
      goal.saved > goal.target
    ) {
      return;
    }

    renderSavingsGoal(goal);
  } catch (error) {
    console.error("Unable to load savings goal:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadSavingsGoal);
document.addEventListener("DOMContentLoaded", loadSavingsHistory);


function addSavingsContribution() {
  const amountInput = document.getElementById(
    "additionalSavingsAmount"
  );

  if (!amountInput) {
    showNotification("Savings input could not be found.");
    return;
  }

  const contribution = Number(amountInput.value);

  if (
    amountInput.value.trim() === "" ||
    !Number.isFinite(contribution) ||
    contribution <= 0
  ) {
    showNotification("Please enter a valid savings amount.");
    return;
  }

  try {
    const storageKey = "microWealthScaleSavingsGoal";
    const savedGoal = localStorage.getItem(storageKey);

    if (!savedGoal) {
      showNotification("Please create a savings goal first.");
      return;
    }

    const goal = JSON.parse(savedGoal);

    if (
      !goal ||
      !Number.isFinite(goal.target) ||
      !Number.isFinite(goal.saved) ||
      goal.target <= 0 ||
      goal.saved < 0 ||
      goal.saved > goal.target
    ) {
      showNotification("Your saved goal data is invalid.");
      return;
    }

    if (goal.saved >= goal.target) {
      showNotification("🎉 You've already reached your goal!");
      return;
    }

    const remaining = goal.target - goal.saved;

    if (contribution > remaining) {
      showNotification(
        `You can add up to ₹${remaining.toLocaleString("en-IN")} to reach your goal.`
      );
      return;
    }

    goal.saved += contribution;


    // Record this contribution in a separate history list.
    const historyKey = "microWealthScaleSavingsHistory";
    const existingHistory = localStorage.getItem(historyKey);
    const history = existingHistory
      ? JSON.parse(existingHistory)
      : [];

    if (!Array.isArray(history)) {
      showNotification("Savings history data is invalid. No changes made.");
      return;
    }

    history.push({
      amount: contribution,
      date: new Date().toISOString()
    });

    localStorage.setItem(historyKey, JSON.stringify(history));
     
    goal.updatedAt = new Date().toISOString();

    localStorage.setItem(
      storageKey,
      JSON.stringify(goal)
    );

    renderSavingsGoal(goal);
   loadSavingsHistory();
   amountInput.value = "";

    showNotification(
      `💰 ₹${contribution.toLocaleString("en-IN")} added to your savings!`
    );
  } catch (error) {
    console.error("Unable to add savings contribution:", error);
    showNotification(
      "Unable to update your savings. Please try again."
    );
  }
}


function loadSavingsHistory() {
  const historyList = document.getElementById("savingsHistoryList");
  const historySummary = document.getElementById("savingsHistorySummary");

  if (!historyList || !historySummary) return;

  try {
    const historyKey = "microWealthScaleSavingsHistory";
    const goalKey = "microWealthScaleSavingsGoal";

    const savedHistory = localStorage.getItem(historyKey);
    const history = savedHistory ? JSON.parse(savedHistory) : [];

   let recordedTotal = 0;

    history.forEach((entry) => {
      if (
        entry &&
        Number.isFinite(entry.amount) &&
        entry.amount > 0
      ) {
        recordedTotal += entry.amount;
      }
    });
     
    const savedGoal = localStorage.getItem(goalKey);
    const goal = savedGoal ? JSON.parse(savedGoal) : null;

    if (!Array.isArray(history)) {
      throw new Error("Savings history is not a valid list.");
    }

    historyList.replaceChildren();

    // Show the original balance separately from new contributions.
    const currentBalance =
     goal && Number.isFinite(goal.saved) && goal.saved >= 0
    ? goal.saved
    : 0;

   const openingBalance = Math.max(
     0,
  currentBalance - recordedTotal
);
     
    const openingItem = document.createElement("div");
    openingItem.className = "savings-history-item";

    const openingDetails = document.createElement("div");
    openingDetails.className = "savings-history-details";

    const openingLabel = document.createElement("strong");
    openingLabel.textContent =
      `₹${openingBalance.toLocaleString("en-IN")} opening balance`;

    const openingDate = document.createElement("span");
    openingDate.textContent = "Savings accumulated before history tracking";

    openingDetails.append(openingLabel, openingDate);
    openingItem.append(openingDetails);
    historyList.append(openingItem); 

    history.slice().reverse().forEach((entry) => {
      if (
        !entry ||
        !Number.isFinite(entry.amount) ||
        entry.amount <= 0
      ) {
        return;
      }

      const item = document.createElement("div");
      item.className = "savings-history-item";

      const details = document.createElement("div");
      details.className = "savings-history-details";

      const amount = document.createElement("strong");
      amount.textContent =
        `+₹${entry.amount.toLocaleString("en-IN")}`;

      const date = document.createElement("span");
      const parsedDate = new Date(entry.date);

      date.textContent = Number.isNaN(parsedDate.getTime())
        ? "Date unavailable"
        : parsedDate.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });

      details.append(amount, date);
      item.append(details);
      historyList.append(item);
    });

    historySummary.textContent =
      `Opening balance: ₹${openingBalance.toLocaleString("en-IN")} · ` +
      `Recorded contributions: ₹${recordedTotal.toLocaleString("en-IN")} · ` +
      `Total represented: ₹${(openingBalance + recordedTotal).toLocaleString("en-IN")}`;

    // Do not change the goal or its saved balance here.
    if (
      goal &&
      Number.isFinite(goal.saved) &&
      goal.saved !== openingBalance + recordedTotal
    ) {
      console.warn(
        "Savings history and current balance differ. No saved data was changed."
      );
    }
  } catch (error) {
    console.error("Unable to load savings history:", error);
    historySummary.textContent =
      "Unable to display savings history. Your saved goal has not been changed.";
  }
}

function editSavingsGoal() {
  const storageKey = "microWealthScaleSavingsGoal";

  try {
    const savedGoal = localStorage.getItem(storageKey);

    if (!savedGoal) {
      showNotification("Please create a savings goal first.");
      return;
    }

    const goal = JSON.parse(savedGoal);

    if (
      !goal ||
      typeof goal.name !== "string" ||
      !Number.isFinite(goal.target) ||
      !Number.isFinite(goal.saved) ||
      goal.target <= 0 ||
      goal.saved < 0 ||
      goal.saved > goal.target
    ) {
      showNotification("Your saved goal data is invalid.");
      return;
    }

    const nameInput = document.getElementById("savingsGoalName");
    const targetInput = document.getElementById("savingsGoalTarget");
    const amountInput = document.getElementById("savingsGoalAmount");

    if (!nameInput || !targetInput || !amountInput) {
      showNotification("Savings goal form could not be found.");
      return;
    }

    nameInput.value = goal.name;
    targetInput.value = goal.target;
    amountInput.value = goal.saved;

    nameInput.focus();

    showNotification("✏️ Your savings goal is ready to edit.");
  } catch (error) {
    console.error("Unable to load savings goal for editing:", error);
    showNotification(
      "Unable to load your savings goal. Please try again."
    );
  }
}


function initializeOnboardingWelcome() {
  const welcome = document.getElementById("onboardingWelcome");

  if (!welcome) return;

  try {
    const existingUser = localStorage.getItem("microWealthScaleUser");
    const existingGoal = localStorage.getItem(
      "microWealthScaleSavingsGoal"
    );
    const onboardingCompleted = localStorage.getItem(
      "microWealthScaleOnboardingCompleted"
    );

    // Preserve the normal experience for existing users.
    if (existingUser || existingGoal || onboardingCompleted === "true") {
      welcome.style.display = "none";
      return;
    }

    // Show the welcome screen only for a new user.
    welcome.style.display = "block";
  } catch (error) {
    console.error("Unable to initialize onboarding:", error);
    welcome.style.display = "none";
  }
}

function startOnboarding() {
  const welcome = document.getElementById("onboardingWelcome");
  const goalCard = document.querySelector(".savings-goal-card");

  if (welcome) {
    welcome.style.display = "none";
  }

  if (goalCard) {
    goalCard.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    const goalNameInput = document.getElementById("savingsGoalName");

    if (goalNameInput) {
      goalNameInput.focus({ preventScroll: true });
    }
  } else {
    showNotification(
      "Welcome to MicroWealth Scale! Start by setting your first savings goal."
    );
  }
}

document.addEventListener(
  "DOMContentLoaded",
  initializeOnboardingWelcome
);
