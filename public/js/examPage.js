let exam = null;
let examMode = "subject";
const totalExamTime = 3 * 3600;
let examTime = totalExamTime;
let timerInterval = null;

function startTimer() {
    examTime = totalExamTime;
    updateTimerLabel();
    timerInterval = setInterval(timerUpdate, 1000);
}

function showTimer() {
    document.getElementById("exam-time").style.display = "inline";
}

function hideTimer() {
    document.getElementById("exam-time").style.display = "none";
}

function timerUpdate() {
    examTime -= 1;
    updateTimerLabel();
    if (examTime <= 0) {
        clearTimer()
    }
}

function clearTimer() {
    if (timerInterval != null) {
        examTime = 0;
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerLabel() {
    let h = Math.floor(examTime / 3600);
    let m = Math.floor(examTime % 3600 / 60);
    let s = Math.floor(examTime % 3600 % 60);

    document.getElementById("exam-time").textContent = "Timp rămas: " + h + ":" + m + ":" + s;
}

async function getExam() {
    exam = null;
    let response = await fetch("/exam");
    let data = await response.json();

    exam = [...data.images];

    console.log(data);
}

function updateExamContent() {
    removeChildren("subjects-container");
    let containter = document.getElementById("subjects-container");

    exam.forEach(element => {
        if (element.type == examMode) {
            let img = document.createElement("img");
            img.setAttribute("src", element.data);
            img.setAttribute("class", "subject-image");

            containter.appendChild(img);
        }
    });
}

function updateSolutionButton() {
    let button = document.getElementById("solution-button");
    let examMd = document.getElementById("exam-mode");

    switch (examMode) {
        case "subject":
            button.textContent = "[Soluții]";
            examMd.textContent = "Mod: subiecte";
            break;
        case "solution":
            button.textContent = "[Subiecte]";
            examMd.textContent = "Mod: soluții";
            break;
    }

    updateExamContent();
}

function solutionButtonPressed() {

    if (exam) {
        if (!timerInterval) {

            if (examMode == "subject")
                examMode = "solution";
            else
                examMode = "subject";

            updateSolutionButton();

        } else {
            alert("Poți vedea soluțiile doar după ce se scurge timpul alocat examenului.");
        }
    }
}