let state = "start";
let questions = [];
let current = 0;
let score = 0;
let timer;
let timeLeft = 15;

// 🔊 sounds
const correctSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");
const wrongSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3");

// INIT
function initTerminal() {
    typeLine("System Ready...", 30, () => {
        typeLine("Type START to begin\n");
    });

}

// INPUT
function handleKey(e) {
    if (e.key === "Enter") {
        let val = input.value.toUpperCase();
        typeLine("> " + val);
        input.value = "";
        process(val);
    }
}

// PROCESS
async function process(cmd) {
    if (state === "start") {
        if (cmd === "START") {
            await startDirect();
        } else {
            typeLine("❌ Type START\n");
        }
    }
}

// START
async function startDirect() {
    state = "loading";
    terminal.innerHTML = "";

    typeLine("Loading questions...\n", 20, async () => {
        await fetchQuestions();
        state = "quiz";
        nextQuestion();
    });
}

// QUESTIONS
async function fetchQuestions() {
    questions = [
        {
            q: "Which tag is used to create a button in HTML?",
            options: ["<btn>", "<button>", "<click>", "<input>"],
            answer: "<button>"
        },
        {
            q: "Which CSS property changes text color?",
            options: ["font-color", "color", "bgcolor", "text-style"],
            answer: "color"
        },
        {
            q: "Which function shows an alert in JavaScript?",
            options: ["alert()", "msg()", "popup()", "show()"],
            answer: "alert()"
        },
        {
            q: "Which tag is used to display images?",
            options: ["<img>", "<image>", "<src>", "<pic>"],
            answer: "<img>"
        },
        {
            q: "Which CSS property centers text?",
            options: ["align", "center", "text-align", "position"],
            answer: "text-align"
        },
        {
            q: "Which keyword declares variables in JS?",
            options: ["var", "let", "const", "All of these"],
            answer: "All of these"
        }
    ];

    questions = questions.sort(() => Math.random() - 0.5).slice(0, 5);
}

// QUESTION
function nextQuestion() {

    if (current >= 5) {
        endQuiz();
        return;
    }

    let q = questions[current];
    terminal.innerHTML = "";

    typeLine(`Q${current + 1}: ${q.q}\n`, 25, () => {
        showOptions(q);
        startTimer();
    });
}

// OPTIONS
function showOptions(q) {
    options.innerHTML = "";

    ["A", "B", "C", "D"].forEach((l, i) => {
        let btn = document.createElement("button");
        btn.innerText = `${l}) ${q.options[i]}`;

        btn.onclick = () => {
            typeAnswer(q.options[i], () => {
                checkAnswer(q.options[i]);
            });
        };

        options.appendChild(btn);
    });
}

// TYPE ANSWER
function typeAnswer(text, cb) {
    typeLine("> ", 10, () => {
        let i = 0;
        let div = terminal.lastChild;

        let interval = setInterval(() => {
            div.innerHTML += text[i];
            i++;

            if (i >= text.length) {
                clearInterval(interval);
                cb();
            }
        }, 25);
    });
}

// ⏱ TIMER
function startTimer() {
    timeLeft = 15;
    updateTimer();

    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        updateTimer();

        if (timeLeft === 0) {
            clearInterval(timer);
            typeLine("\n⏰ Time Up\n");
            current++;
            setTimeout(nextQuestion, 800);
        }
    }, 1000);
}

function updateTimer() {
    document.getElementById("timer").innerText = "⏱ " + timeLeft;
}

// CHECK
function checkAnswer(ans) {
    clearInterval(timer);

    let correct = questions[current].answer;

    if (ans === correct) {
        correctSound.currentTime = 0;
        correctSound.play();
        typeLine("\n✅ Correct\n");
        score++;
    } else {
        wrongSound.currentTime = 0;
        wrongSound.play();
        typeLine(`\n❌ Wrong\n✔ ${correct}\n`);
    }

    current++;
    setTimeout(nextQuestion, 800);
}

// END
function endQuiz() {
    terminal.innerHTML = "";

    typeLine(`🔥 Final Score: ${score}/5\n`, 30, () => {
        typeLine("👉 Click Restart\n");
        document.getElementById("restartBtn").style.display = "block";
    });
}

// RESET
function resetQuiz() {
    current = 0;
    score = 0;
    questions = [];

    terminal.innerHTML = "";
    options.innerHTML = "";
    document.getElementById("restartBtn").style.display = "none";

    startDirect();
}

// ✨ TYPEWRITER
function typeLine(text, speed = 30, callback) {
    let div = document.createElement("div");
    terminal.appendChild(div);

    let i = 0;

    let interval = setInterval(() => {
        div.innerHTML += text[i];
        i++;

        if (i >= text.length) {
            clearInterval(interval);
            if (callback) callback();
        }
    }, speed);

    terminal.scrollTop = terminal.scrollHeight;
}