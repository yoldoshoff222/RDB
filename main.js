// GLOBAL
let questions = [];
let current = 0;
let score = 0;

// 🚀 START
function startTest(fanName) {

    let text = window[fanName];

    if (typeof text !== "string") {
        alert("❌ Fan yuklanmagan yoki xato!");
        console.log("Xato fan:", fanName, text);
        return;
    }

    questions = parseText(text);

    if (!questions.length) {
        alert("❌ Savollar topilmadi!");
        return;
    }

    current = 0;
    score = 0;

    document.getElementById("menu").classList.add("hidden");
    document.getElementById("quiz").classList.remove("hidden");

    showQuestion();
}

// 🔥 KUCHLI PARSER
function parseText(text) {

    let lines = text.split("\n")
        .map(l => l.trim())
        .filter(l => l.length > 0);

    let result = [];
    let q = null;

    for (let line of lines) {

        if (line.startsWith("*")) {

            if (q && q.options.length >= 2) {
                result.push(q);
            }

            q = {
                question: line.substring(1).trim(),
                options: [],
                correct: ""
            };
        }

        else if (line.startsWith("+")) {
            let val = line.substring(1).trim();

            if (val && q) {
                q.options.push(val);
                q.correct = val;
            }
        }

        else if (line.startsWith("=")) {
            let val = line.substring(1).trim();

            if (val && q) {
                q.options.push(val);

                // 🔥 AUTO FIX (agar + yo‘q bo‘lsa)
                if (!q.correct) {
                    q.correct = val;
                }
            }
        }
    }

    if (q && q.options.length >= 2) {
        result.push(q);
    }

    return shuffle(result).slice(0, 30);
}

// 📄 SAVOL CHIQARISH
function showQuestion() {

    let q = questions[current];

    document.getElementById("question").innerText = q.question;

    let box = document.getElementById("answers");
    box.innerHTML = "";

    shuffle([...q.options]).forEach(opt => {

        let btn = document.createElement("button");
        btn.innerText = opt;

        btn.onclick = () => selectAnswer(btn, q.correct);

        box.appendChild(btn);
    });

    document.getElementById("progress").innerText =
        `${current + 1} / ${questions.length}`;
}

// ✅ JAVOB TEKSHIRISH
function selectAnswer(btn, correct) {

    let all = document.querySelectorAll("#answers button");

    all.forEach(b => {
        b.disabled = true;

        if (b.innerText === correct) {
            b.classList.add("correct");
        }
    });

    if (btn.innerText === correct) {
        score++;
    } else {
        btn.classList.add("wrong");
    }

    setTimeout(nextQuestion, 500);
}

// ➡️ KEYINGI SAVOL
function nextQuestion() {

    current++;

    if (current < questions.length) {
        showQuestion();
    } else {
        finishTest();
    }
}

// 🏁 NATIJA
function finishTest() {

    document.getElementById("quiz").classList.add("hidden");
    document.getElementById("result").classList.remove("hidden");

    let percent = Math.round((score / questions.length) * 100);

    document.getElementById("score").innerText =
        `Natija: ${score} / ${questions.length} (${percent}%)`;
}

// 🔀 RANDOM
function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}