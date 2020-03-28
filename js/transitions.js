const PagesEnum = {"Home" : 0, "Exam" : 1, "Edit" : 2, "EditEntry" : 3};

var currentPage = null;

function switchPage(page)
{
    currentPage = page;
    var home      = document.getElementsByClassName("home")[0];
    var exam      = document.getElementsByClassName("exam-page")[0];
    var edit      = document.getElementsByClassName("edit-list-page")[0];
    var editEntry = document.getElementsByClassName("edit-entry-page")[0];

    home.style.display      = "none";
    exam.style.display      = "none";
    edit.style.display      = "none";
    editEntry.style.display = "none";

    switch (currentPage)
    {
        case PagesEnum.Home:
            home.style.display      = "grid";
        break;
        case PagesEnum.Exam:
            exam.style.display      = "block";
            break;
        case PagesEnum.Edit:
            edit.style.display      = "flex";
            break;
        case PagesEnum.EditEntry:
            editEntry.style.display = "flex";
            break;
    }
}

switchPage(PagesEnum.Home);
