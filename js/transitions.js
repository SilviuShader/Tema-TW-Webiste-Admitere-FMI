const PagesEnum = {
    "Home": 0,
    "Exam": 1,
    "Edit": 2,
    "EditEntry": 3
};

let currentPage = null;

function switchPage(page) {
    currentPage = page;
    let home = document.getElementsByClassName("home")[0];
    let exam = document.getElementsByClassName("exam-page")[0];
    let edit = document.getElementsByClassName("edit-list-page")[0];
    let editEntry = document.getElementsByClassName("edit-entry-page")[0];

    home.style.display = "none";
    exam.style.display = "none";
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
            exam.style.display = "block";
            examTopButtons.style.display = "block";
            break;
        case PagesEnum.Edit:
            edit.style.display = "flex";
            editTopButtons.style.display = "block";
            break;
        case PagesEnum.EditEntry:
            editEntry.style.display = "flex";
            break;
    }
}

switchPage(PagesEnum.Home);