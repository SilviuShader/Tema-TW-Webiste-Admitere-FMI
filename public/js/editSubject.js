let subjectImageSrc = null;
let solutionImageSrc = null;

let completedEditData = null;
let editEntryId = null;
let saveEntryAction = "POST";

function autofillEntry() {
    document.getElementById("subject-image-field").value = "";
    document.getElementById("solution-image-field").value = "";
    if (completedEditData != null) {
        document.getElementById("subject-name-field").value = completedEditData.name;
        document.getElementById("subject-exercise-field").value = completedEditData.exercise;
        saveEntryAction = "UPDATE";
        editEntryId = completedEditData.id;
    } else {
        document.getElementById("subject-name-field").value = "";
        document.getElementById("subject-exercise-field").value = "algebra";
        saveEntryAction = "POST";
        editEntryId = null;
    }

    subjectImageSrc = null;
    solutionImageSrc = null;

    completedEditData = null;
}

function onSubjectFileSelected(event, typ) {
    let selectedFile = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function (event) {
        if (typ == "subject")
            subjectImageSrc = event.target.result;
        else
            solutionImageSrc = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
}