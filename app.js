// MicroWealth App

// PAGE NAVIGATION
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


// CONTINUE CHALLENGE
function continueChallenge() {
    showPage("challenges");
}


// JOIN CHALLENGE
function joinChallenge(challengeName) {
    alert(
        "🎉 You joined the " +
        challengeName +
        "!"
    );
}


// COMPLETE TASK
function completeTask(button) {

    button.innerText = "✓ Completed";
    button.disabled = true;

    alert("Great job! 🎉 You earned 10 points.");
}


// START LESSON
function startLesson(lessonName) {

    alert(
        "📚 Lesson started: " +
        lessonName +
        "\n\nKeep learning and building your financial knowledge!"
    );
}


// LIKE COMMUNITY POST
function likePost(button) {

    let likes = parseInt(button.dataset.likes || "0");

    likes++;

    button.dataset.likes = likes;

    button.innerText = "♥ " + likes;
}


// CURRENCY BUTTON
function changeCurrency() {

    alert(
        "🌍 Currency selection will be available in the next version of MicroWealth."
    );
}


// WELCOME MESSAGE
console.log("MicroWealth loaded successfully 🚀");
