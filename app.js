// ================================
// MicroWealth App
// ================================

// USER DATA
let points = 1250;
let streak = 8;
let completedDays = 8;


// ================================
// PAGE NAVIGATION
// ================================

function showPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ================================
// CONTINUE CHALLENGE
// ================================

function continueChallenge() {

    showPage("challenges");

}


// ================================
// JOIN CHALLENGE
// ================================

function joinChallenge(challengeName) {

    alert(
        "🎉 You joined the " +
        challengeName +
        " challenge!\n\n" +
        "Your journey starts today."
    );

}


// ================================
// COMPLETE TODAY'S TASK
// ================================

function completeTask(button) {

    if (button.disabled) {
        return;
    }

    button.innerText = "✓ Completed";
    button.disabled = true;

    points += 10;
    streak += 1;
    completedDays += 1;

    updateStats();

    alert(
        "🎉 Great job!\n\n" +
        "+10 points earned.\n" +
        "Your streak is now " + streak + " days!"
    );

}


// ================================
// UPDATE STATS
// ================================

function updateStats() {

    const statElements = document.querySelectorAll(".stat strong");

    if (statElements.length >= 3) {

        statElements[0].innerText = "🔥 " + streak;

        statElements[1].innerText = points.toLocaleString();

        statElements[2].innerText = "3";
    }


    // Update challenge progress

    const progressBar = document.querySelector(".progress-bar");

    const progressText = document.querySelector(
        ".challenge-card p:nth-of-type(3)"
    );

    const percentage = Math.round(
        (completedDays / 30) * 100
    );

    if (progressBar) {

        progressBar.style.width =
            percentage + "%";
    }

}


// ================================
// START LESSON
// ================================

function startLesson(lessonName) {

    points += 5;

    updateStats();

    alert(
        "📚 " +
        lessonName +
        " started!\n\n" +
        "+5 learning points."
    );

}


// ================================
// LIKE COMMUNITY POST
// ================================

function likePost(button) {

    let likes =
        parseInt(button.dataset.likes || "0");

    likes++;

    button.dataset.likes = likes;

    button.innerText =
        "♥ " + likes;

}


// ================================
// CURRENCY
// ================================

function changeCurrency() {

    alert(
        "🌍 Currency selection will be available soon."
    );

}


// ================================
// APP START
// ================================

console.log(
    "MicroWealth loaded successfully 🚀"
);
