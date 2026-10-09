
// Screens
const homeScreen = document.getElementById("home");
const quizScreen = document.getElementById("quiz");
const resultsScreen = document.getElementById("results");
const scoresScreen = document.getElementById("previous-scores");

// Buttons
const startButton = document.getElementById("start-btn");
const scoresButton = document.getElementById("score-btn");
const homeButton = document.getElementById("home-btn");

// Quiz elements
const questionNumber = document.getElementById("question-number");
const questionText = document.getElementById("question");
const answerButtons = document.getElementById("answers");
const nextButton = document.querySelector(".next-btn");
const rightMessage = document.getElementById("right");
const wrongMessage = document.getElementById("wrong");

// Timer
const timerCard = document.getElementById("time-card");
const showTimer = document.getElementById("timer");

// Results
const scoreCount = document.getElementById("score-count");
const initialForm = document.getElementById("initial-form");
const initialText = document.getElementById("initial-text");
const scoreList = document.getElementById("score-list");

// Quiz state
let timeRemaining = 75;
let timer = null;
let shuffledQuestions = [];
let currentQuestionIndex = 0;
let answered = false;

// Questions
const questions = [
    {
        question: "Commonly used data types DO NOT include:",
        answers: [
            { text: "1. strings", correct: false },
            { text: "2. boolean", correct: false },
            { text: "3. alerts", correct: true },
            { text: "4. numbers", correct: false }
        ]
    },
    {
        question: "The condition in an if / else statement is enclosed within ________.",
        answers: [
            { text: "1. quotes", correct: false },
            { text: "2. curly brackets", correct: false },
            { text: "3. parentheses", correct: true },
            { text: "4. square brackets", correct: false }
        ]
    },
    {
        question: "Arrays in JavaScript can be used to store ______.",
        answers: [
            { text: "1. numbers and strings", correct: false },
            { text: "2. other arrays", correct: false },
            { text: "3. booleans", correct: false },
            { text: "4. all of the above", correct: true }
        ]
    },
    {
        question: "String values must be enclosed within _____ when being assigned to variables.",
        answers: [
            { text: "1. commas", correct: false },
            { text: "2. curly brackets", correct: false },
            { text: "3. quotes", correct: true },
            { text: "4. parentheses", correct: false }
        ]
    },
    {
        question: "A useful tool for printing debugging information is:",
        answers: [
            { text: "1. JavaScript", correct: false },
            { text: "2. terminal/bash", correct: false },
            { text: "3. for loops", correct: false },
            { text: "4. console.log", correct: true }
        ]
    }
];

// Show only the requested screen
function showScreen(screen) {
    [homeScreen, quizScreen, resultsScreen, scoresScreen]
        .forEach(section => section.classList.add("hide"));

    screen.classList.remove("hide");
}

// Start quiz
function startQuiz() {
    clearInterval(timer);

    timeRemaining = 75;
    currentQuestionIndex = 0;
    answered = false;

    shuffledQuestions = [...questions].sort(
        () => Math.random() - 0.5
    );

    showScreen(quizScreen);
    timerCard.classList.remove("hide");
    showTimer.textContent = timeRemaining;

    startTimer();
    setNextQuestion();
}

// Start timer
function startTimer() {
    clearInterval(timer);

    timer = setInterval(() => {
        timeRemaining--;

        if (timeRemaining <= 0) {
            timeRemaining = 0;
            showTimer.textContent = 0;
            endQuiz();
            return;
        }

        showTimer.textContent = timeRemaining;
    }, 1000);
}

// Display next question
function setNextQuestion() {
    answered = false;

    rightMessage.classList.add("hide");
    wrongMessage.classList.add("hide");
    nextButton.classList.add("hide");

    answerButtons.innerHTML = "";

    const question = shuffledQuestions[currentQuestionIndex];

    questionNumber.textContent = currentQuestionIndex + 1;
    questionText.textContent = question.question;

    question.answers.forEach(answer => {
        const button = document.createElement("button");

        button.textContent = answer.text;
        button.classList.add("answer-btn", "btn");
        button.dataset.correct = String(answer.correct);

        button.addEventListener("click", selectAnswer);

        answerButtons.appendChild(button);
    });
}

// Handle selected answer
function selectAnswer(event) {
    if (answered) return;

    answered = true;

    const selectedButton = event.target;
    const correct = selectedButton.dataset.correct === "true";

    if (correct) {
        rightMessage.classList.remove("hide");
    } else {
        wrongMessage.classList.remove("hide");

        timeRemaining = Math.max(0, timeRemaining - 10);
        showTimer.textContent = timeRemaining;
    }

    // Disable answers and highlight the correct one
    Array.from(answerButtons.children).forEach(button => {
        button.disabled = true;

        if (button.dataset.correct === "true") {
            button.style.backgroundColor = "green";
            button.style.color = "white";
        } else if (button === selectedButton && !correct) {
            button.style.backgroundColor = "red";
            button.style.color = "white";
        }
    });

    if (timeRemaining === 0) {
        endQuiz();
        return;
    }

    nextButton.classList.remove("hide");
}

// Next question
function nextQuestion() {
    if (!answered) return;

    currentQuestionIndex++;

    if (currentQuestionIndex < shuffledQuestions.length) {
        setNextQuestion();
    } else {
        endQuiz();
    }
}

// End quiz
function endQuiz() {
    clearInterval(timer);
    timer = null;

    scoreCount.textContent = timeRemaining;

    timerCard.classList.add("hide");
    showScreen(resultsScreen);
}

// Save score
function saveScore(event) {
    event.preventDefault();

    const initials = initialText.value.trim();

    if (!initials) {
        alert("Please enter your initials.");
        return;
    }

    const scores = JSON.parse(
        localStorage.getItem("quizScores") || "[]"
    );

    scores.push({
        initials: initials,
        score: timeRemaining
    });

    scores.sort((a, b) => b.score - a.score);

    localStorage.setItem("quizScores", JSON.stringify(scores));

    initialForm.reset();
    previousScores();
}

// Display previous scores
function previousScores() {
    clearInterval(timer);
    timer = null;

    timerCard.classList.add("hide");
    showScreen(scoresScreen);

    const scores = JSON.parse(
        localStorage.getItem("quizScores") || "[]"
    );

    scoreList.innerHTML = "";

    if (scores.length === 0) {
        const item = document.createElement("li");
        item.textContent = "No previous scores yet.";
        scoreList.appendChild(item);
        return;
    }

    scores.forEach(score => {
        const item = document.createElement("li");

        item.textContent = `${score.initials} - ${score.score}`;

        scoreList.appendChild(item);
    });
}

// Return home
function HomePage() {
    clearInterval(timer);
    timer = null;

    timerCard.classList.add("hide");
    showScreen(homeScreen);
}

// Event listeners
startButton.addEventListener("click", startQuiz);
nextButton.addEventListener("click", nextQuestion);
scoresButton.addEventListener("click", previousScores);
homeButton.addEventListener("click", HomePage);
initialForm.addEventListener("submit", saveScore);

// Initial state
showTimer.textContent = timeRemaining;
timerCard.classList.add("hide");
showScreen(homeScreen);
