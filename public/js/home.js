function animateText(pageElement) {
    let children = pageElement.children;
    let childIndex = 0;
    let text = children[childIndex].textContent;
    children[childIndex].textContent = "";

    for (let ch of children) {
        ch.style.display = "none";
        ch.style.margin = "0px";
        ch.style.fontSize = "20px";
        ch.style.paddingLeft = "10px";
    }
    children[childIndex].style.display = "block";

    setTimeout(function () {
        updateText(text.split(" "), 0, children, childIndex);
    }, 333);
}

function updateText(wordArray, index, children, childIndex) {

    if (index >= wordArray.length) {
        index = 0;
        childIndex++;
        if (childIndex < children.length) {
            wordArray = children[childIndex].textContent.split(" ");
            children[childIndex].textContent = " ";
            children[childIndex].style.display = "block";
        }
    }

    if (childIndex >= children.length)
        return;

    children[childIndex].textContent = children[childIndex].textContent + " " + wordArray[index];

    setTimeout(function () {
        updateText(wordArray, index + 1, children, childIndex)
    }, 333);
}