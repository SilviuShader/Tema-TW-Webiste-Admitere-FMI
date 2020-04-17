async function saveSubjectPressed() {
    if ((subjectImageSrc && solutionImageSrc && saveEntryAction == "POST") || saveEntryAction == "UPDATE") {

        let data = {};

        data.name = document.getElementById("subject-name-field").value;
        if (saveEntryAction == "POST") {
            data.img = subjectImageSrc;
            data.solImg = solutionImageSrc;
        } else {
            if (subjectImageSrc)
                data.img = subjectImageSrc;
            if (solutionImageSrc)
                data.solImg = solutionImageSrc;
        }

        data.exercise = document.getElementById("subject-exercise-field").value;

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }

        let response;
        let json;

        switch (saveEntryAction) {
            case "POST":
                response = await fetch("/subjects", options);

                break;
            case "UPDATE":
                let entryId = editEntryId;
                options.method = "PUT";
                response = await fetch("/subjects/" + entryId, options);
                break;
        }

        json = await response.json();
        console.log(json);


        switchPage(PagesEnum.Home);
    }
}

async function deleteSubjectPressed() {
    if (saveEntryAction == "UPDATE") {
        let options = {
            method: "DELETE"
        };
        await fetch("/subjects/" + editEntryId, options);
        switchPage(PagesEnum.Home);
    } else {
        alert("Cum vrei sa stergi un subiect pe care nici nu l-ai adaugat?");
    }
}

async function readAllSubjects() {

    let response = await fetch("/subjects");
    let data = await response.json();

    return data;
}