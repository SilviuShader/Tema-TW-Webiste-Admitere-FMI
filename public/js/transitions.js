const PagesEnum = {
    "Home": 0,
    "Exam": 1,
    "Prepare": 2,
    "Continue": 3,
    "Edit": 4,
    "EditEntry": 5,
    "Minigame": 6
};

let currentPage = null;

function saveExam() {
    if (exam) {
        localStorage.setItem("exam", JSON.stringify(exam));
        localStorage.setItem("examTime", examTime.toString());
    }
}

function loadExam() {
    let ex = localStorage.getItem("exam");
    if (ex) {
        exam = JSON.parse(ex);
        let exTime = Number(localStorage.getItem("examTime"));
        clearTimer();
        if (exTime != totalExamTime) {
            startTimer(exTime);
        }
    }
}

function switchPage(page) {

    if (currentPage == PagesEnum.Exam || currentPage == PagesEnum.Continue || currentPage == PagesEnum.Prepare) {
        saveExam();
    }

    currentPage = page;
    let home = document.getElementsByClassName("home")[0];
    let examP = document.getElementsByClassName("exam-page")[0];
    let edit = document.getElementsByClassName("edit-list-page")[0];
    let editEntry = document.getElementsByClassName("edit-entry-page")[0];
    let minigamePage = document.getElementsByClassName("minigame-page")[0];

    home.style.display = "none";
    examP.style.display = "none";
    edit.style.display = "none";
    editEntry.style.display = "none";
    minigamePage.style.display = "none";

    //endGame();

    let homeTopButtons = document.getElementById("home-top-buttons");
    let examTopButtons = document.getElementById("exam-top-buttons");
    let editTopButtons = document.getElementById("edit-top-buttons");

    homeTopButtons.style.display = "none";
    examTopButtons.style.display = "none";
    editTopButtons.style.display = "none";

    switch (currentPage) {
        case PagesEnum.Home:
            home.style.display = "grid";
            homeTopButtons.style.display = "block";
            break;
        case PagesEnum.Exam:
            logEvent("exam button", `a pornit simularea`);
            examP.style.display = "block";
            examTopButtons.style.display = "block";
            getExam().then(function () {
                examMode = "subject";
                updateExamContent();
                updateSolutionButton();
                clearTimer();
                startTimer(totalExamTime);
                showTimer();
            });
            break;
        case PagesEnum.Prepare:
            logEvent("learn button", `a pornit pregatirea`);
            examP.style.display = "block";
            examTopButtons.style.display = "block";
            getExam().then(function () {
                examMode = "subject";
                updateExamContent();
                updateSolutionButton();
                clearTimer();
                hideTimer();
            });
            break;
        case PagesEnum.Continue:
            logEvent("continue button", `se continua examenul`);
            loadExam();
            if (exam) {
                examP.style.display = "block";
                examTopButtons.style.display = "block";
                examMode = "subject";
                updateExamContent();
                updateSolutionButton();
            } else {
                alert("Nu poți continua ceva ce nu ai început.");
                switchPage(PagesEnum.Home);
            }
            break;
        case PagesEnum.Edit:
            logEvent("edit button", `se vizualizeaza lista de subiecte`);
            edit.style.display = "flex";
            editTopButtons.style.display = "block";
            updateEditList();
            break;
        case PagesEnum.EditEntry:
            logEvent("edit subject", `se editeaza un subiect`);
            editEntry.style.display = "grid";
            autofillEntry();
            break;
        case PagesEnum.Minigame:
            minigamePage.style.display = "flex";
            startGame();
            break;
    }
}

let ravaseStrings = ["Priveste aceasta sectiune cu text animat. Tare, nu?",
    "O sa pici la admitere, fraiere.", "O sa iei admiterea cu brio si o sa ajungi in grupa de olimpici.",
    "Vine bacu baaaa... si dupa urmeaza admiterea.", "Admiterea la FMI Unibuc din 2020 e pe BAC deci nu prea ai nevoie de site-ul asta acum.",
    "Plot twist, platforma asta e de fapt o tema."
];

let homeTutorial = document.getElementById("dialogue");
let conceptSection = document.getElementById("concept-section");

let murphy = document.createElement("p");
conceptSection.appendChild(murphy);

murphy.textContent = ravaseStrings[Math.floor((Math.random() * ravaseStrings.length))];

animateText(homeTutorial);
animateText(conceptSection);
switchPage(PagesEnum.Home);

let translationX = 0;
let translationY = 0;

setInterval(function () {
    document.body.style.backgroundPosition = `${translationX}px ${translationY}px`;
    translationX += 2;
    translationY -= 1;
}, 20);