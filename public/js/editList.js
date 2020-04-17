let editListData = null;

async function updateEditList() {
    editListData = null;

    removeChildren("algebra-list");
    removeChildren("calculus-list");
    removeChildren("geometry-list");
    removeChildren("informatics-list");

    let data = await readAllSubjects();
    editListData = [...data];

    data.forEach(element => {

        let subcontainer;
        switch (element.exercise) {
            case "algebra":
                subcontainer = document.getElementById("algebra-list");
                break;
            case "calculus":
                subcontainer = document.getElementById("calculus-list");
                break;
            case "geometry":
                subcontainer = document.getElementById("geometry-list");
                break;
            case "informatics":
                subcontainer = document.getElementById("informatics-list");
                break;
        }

        var button = document.createElement("button");
        button.textContent = element.name;
        button.setAttribute("onclick", "editSubjectPressed(\"" + element.id + "\")")
        subcontainer.appendChild(button);
    });
}

function removeChildren(element) {
    let obj = document.getElementById(element);
    while (obj.firstChild)
        obj.removeChild(obj.lastChild);
}

function editSubjectPressed(subjectId) {
    if (editListData) {
        let properties = editListData.find(element => element.id == subjectId);

        if (!completedEditData)
            completedEditData = {};

        for (key in properties) {
            completedEditData[key] = properties[key];
        }

        switchPage(PagesEnum.EditEntry);
    }
}