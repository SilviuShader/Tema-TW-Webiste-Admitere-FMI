let subjectImageSrc = null;
let solutionImageSrc = null;

let completedEditData = null;
let editEntryId = null;
let saveEntryAction = "POST";

let subjNameField = document.getElementById("subject-name-field");

function blockSpecialChar(e) {
    let k = e.keyCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57) || k == 190 || k == 188);
}

subjNameField.addEventListener("keydown", (event) => {
    if (!blockSpecialChar(event)) {
        event.preventDefault();
        alert("Vă rugăm să nu intorduceți caractere speciale în câmpul \"Denumire\".");
    }
});

function autofillEntry() {
    document.getElementById("subject-image-field").value = "";
    document.getElementById("solution-image-field").value = "";
    if (completedEditData != null) {
        document.getElementById("subject-name-field").value = completedEditData.name;
        document.getElementById("subject-exercise-field").value = completedEditData.exercise;
        saveEntryAction = "UPDATE";
        editEntryId = completedEditData.id;

        console.log(editEntryId);

        fetch("/subjects/" + editEntryId).then(response => {
            response.json().then(data => {
                document.getElementById("subject-edit-image").src = data.img;
                document.getElementById("solution-edit-image").src = data.solImg;
            });
        });

    } else {
        document.getElementById("subject-name-field").value = "";
        document.getElementById("subject-exercise-field").value = "algebra";
        saveEntryAction = "POST";
        editEntryId = null;

        document.getElementById("subject-edit-image").src = "";
        document.getElementById("solution-edit-image").src = "";
    }

    subjectImageSrc = null;
    solutionImageSrc = null;

    completedEditData = null;
}

function onSubjectFileSelected(event, typ) {
    let selectedFile = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function (event) {
        if (typ == "subject") {
            subjectImageSrc = event.target.result;
            document.getElementById("subject-edit-image").src = subjectImageSrc;
        } else {
            solutionImageSrc = event.target.result;
            document.getElementById("solution-edit-image").src = solutionImageSrc;
        }
    };

    reader.readAsDataURL(selectedFile);
}