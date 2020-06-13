let loggerDiv = document.getElementById("log-div-id");
let loggerToggle = document.getElementById("logger-toggle");
let loggerUl = document.getElementById("log-ul-id");

let loggerActive = false;
let loggerInversed = false;

function toggleLogger() {
    loggerActive = !loggerActive;

    if (loggerActive) {
        loggerDiv.style.display = "block";
        loggerToggle.textContent = "[Dezactivează logger]";
    } else {
        loggerDiv.style.display = "none";
        loggerToggle.textContent = "[Activează logger]";
    }
}

function logEvent(tipEvent, eventData) {
    let element = document.createElement("li");
    let date = new Date();
    let dateString = date.getFullYear().toString() + "/" +
        (((date.getMonth() + 1) < 10) ? "0" + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString()) + "/" +
        ((date.getDate() < 10) ? "0" + date.getDate().toString() : date.getDate().toString()) + " " +
        ((date.getHours() < 10) ? "0" + date.getHours().toString() : date.getHours().toString()) + ":" +
        ((date.getMinutes() < 10) ? "0" + date.getMinutes().toString() : date.getMinutes().toString()) + ":" +
        ((date.getSeconds() < 10) ? "0" + date.getSeconds().toString() : date.getSeconds().toString()) + " ";

    element.textContent = dateString + tipEvent + ", " + eventData;

    if (!loggerInversed) {
        loggerUl.appendChild(element);
        loggerUl.scrollTop = loggerUl.scrollHeight;
    } else {
        loggerUl.prepend(element);
        loggerUl.scrollTop = 0;
    }
}

function logMouse(e) {
    logEvent("click", `coord ${e.pageX}, ${e.pageY}`);
}

function logDblClick(e) {
    logEvent("dblclick", `coord ${e.pageX}, ${e.pageY}`);
}

function logKeybaord(e) {
    logEvent("keydown", `tasta ${blockSpecialChar(e) ? String.fromCharCode(e.keyCode) : "(cu codul) " + e.keyCode.toString()}`);
}

function logKeybaordUp(e) {
    logEvent("keyup", `tasta ${blockSpecialChar(e) ? String.fromCharCode(e.keyCode) : "(cu codul) " + e.keyCode.toString()}`);
}

function inverseList(e) {
    loggerInversed = !loggerInversed;

    let itemsCount = loggerUl.childNodes.length;
    while (itemsCount--)
        loggerUl.appendChild(loggerUl.childNodes[itemsCount]);
}

document.addEventListener("click", logMouse);
document.addEventListener("dblclick", logDblClick);
document.addEventListener("keydown", logKeybaord);
document.addEventListener("keyup", logKeybaordUp);

loggerUl.addEventListener("dblclick", inverseList);