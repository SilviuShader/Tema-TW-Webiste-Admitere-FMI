const PagesEnum = {
    "Home": 0,
    "Exam": 1,
    "Prepare": 2,
    "Continue": 3,
    "Edit": 4,
    "EditEntry": 5
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

    home.style.display = "none";
    examP.style.display = "none";
    edit.style.display = "none";
    editEntry.style.display = "none";

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
            edit.style.display = "flex";
            editTopButtons.style.display = "block";
            updateEditList();
            break;
        case PagesEnum.EditEntry:
            editEntry.style.display = "grid";
            autofillEntry();
            break;
    }
}

switchPage(PagesEnum.Home);