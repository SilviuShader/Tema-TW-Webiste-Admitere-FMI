const minigameItemWidthPerc = 7.5;
const minigameItemHeightPerc = 10.0;
const minigameBaseWidth = 768.0;
const minigameBaseHeight = 576.0;
const playerSpeed = 10.0;
const collisionRadius = 70.0;

let spawnTimer = null;
let playerTimer = null;
let gameScore = 0;

let minigameDiv = document.getElementsByClassName("game-div")[0];
minigameDiv.onclick = gameDivClicked;
minigameDiv.addEventListener('mousemove', onMouseMovedGame);

let finalScoreDiv = document.getElementById("final-score-label");

let minigamePlayer = null;

let gameItems = [];

let playerPosition;
let targetPlayerPosition;
let startedMovePosition;

let invalidMoveLabel = null;
let mousePosition = { x: 0, y: 0 };

function startGame() {

    gameScore = 0;
    updateScoreLabel();

    minigameDiv.style.display = "block";
    finalScoreDiv.style.display = "none";

    minigamePlayer = createItemDOMElement();
    minigamePlayer.setAttribute("src", "assets/Player.png");

    playerPosition = { x: minigameBaseWidth / 2.0, y: minigameBaseHeight / 2.0 };
    targetPlayerPosition = { ...playerPosition };
    startedMovePosition = { ...playerPosition };

    setObjectPosition(minigamePlayer, playerPosition);

    minigameDiv.appendChild(minigamePlayer);

    spawnTimer = setInterval(spawnItem, 1000);
    playerTimer = setInterval(movePlayer, 10);
}

function createItemDOMElement() {
    let elem = document.createElement("img");
    elem.style.position = "absolute";
    elem.style.transformOrigin = "center";
    elem.style.width = `calc(${minigameItemWidthPerc}%)`;
    elem.style.height = `calc(${minigameItemHeightPerc}%)`;

    return elem;
}

function vectorDiff(vec1, vec2) {
    return { x: vec1.x - vec2.x, y: vec1.y - vec2.y };
}

function vecLength(vec) {
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

function movePlayer() {
    let diff = vectorDiff(targetPlayerPosition, startedMovePosition);
    let targetDistance = vecLength(diff);
    if (targetDistance != 0) {
        let directionVec = vectorDiff(playerPosition, startedMovePosition);
        let distanceSoFar = vecLength(directionVec);

        if (distanceSoFar < targetDistance) {
            let normalizedVec = { ...diff };
            normalizedVec.x /= targetDistance;
            normalizedVec.y /= targetDistance;

            playerPosition.x += normalizedVec.x * playerSpeed;
            playerPosition.y += normalizedVec.y * playerSpeed;
            setObjectPosition(minigamePlayer, playerPosition);
        }
    }

    let dead = false;

    gameItems.forEach(element => {
        if (element.validItem) {
            let diff = vectorDiff(element.position, playerPosition);
            let dist = vecLength(diff);

            if (dist < collisionRadius && element.visible) {
                element.validItem = false;
                if (element.isGood) {
                    gameScore += 1;
                    updateScoreLabel();
                }
                else
                    dead = true;
            }
        }
    });

    gameItems.forEach(element => {
        if (!element.validItem) {
            element.domObj.remove();
        }
    });

    gameItems = gameItems.filter(obj => obj.validItem);

    if (dead)
        endGame();
}

function updateScoreLabel() {
    let scoreLabel = document.getElementById("game-score-label");
    scoreLabel.textContent = `Scor: ${gameScore}`;
    console.log(scoreLabel.textContent);
}

function spawnItem() {

    let domElement = createItemDOMElement();

    let good = true;
    if (Math.random() > 0.5)
        good = false;

    domElement.setAttribute("src", good ? "assets/LogoFMI.png" : "assets/Poli.png");

    let pos = { x: Math.random() * minigameBaseWidth, y: Math.random() * minigameBaseHeight };

    setObjectPosition(domElement, pos);

    minigameDiv.appendChild(domElement);

    let gameItem = {
        position: pos,
        isGood: good,
        validItem: true,
        domObj: domElement,
        visible: true
    };

    gameItems.push(gameItem);

    setTimeout(function () {
        onItemDisappear(gameItem);
    }, 5000);
}

function onItemDisappear(item) {
    if (!item.validItem)
        return;

    item.domObj.style.display = "none";
    item.visible = false;

    setTimeout(function () {
        onItemReAppear(item);
    }, 2000);
}

function onItemReAppear(item) {
    if (!item.validItem)
        return;

    item.domObj.style.display = "block";
    item.visible = true;

    setTimeout(function () {
        onItemDisappear(item);
    }, 5000);
}

function setObjectPosition(obj, position) {
    let positionPercX = position.x / minigameBaseWidth;
    let positionPercY = position.y / minigameBaseHeight;

    obj.style.left = `calc(${positionPercX * 100 - minigameItemHeightPerc / 2.0}%)`;
    obj.style.top = `calc(${positionPercY * 100 - minigameItemHeightPerc / 2.0}%)`;
}

function onMouseMovedGame(e) {
    let rect = minigameDiv.getBoundingClientRect();

    mousePosition.x = e.clientX - rect.left;
    mousePosition.y = e.clientY - rect.top;

    if (invalidMoveLabel != null) {
        invalidMoveLabel.remove();
        invalidMoveLabel = null;
    }
}

function gameDivClicked(e) {
    if (e.target.tagName == "IMG") {
        if (gameScore > 0) {
            gameScore -= 1;
            updateScoreLabel();
            gameItems.forEach(element => {
                if (element.domObj == e.target) {
                    element.validItem = false;
                }
            });
        }
        else if (invalidMoveLabel == null) {
            invalidMoveLabel = document.createElement("p");
            invalidMoveLabel.textContent = "Nu aveti voie";
            invalidMoveLabel.style.position = "absolute";
            invalidMoveLabel.style.transformOrigin = "center";
            invalidMoveLabel.style.left = `${mousePosition.x}px`;
            invalidMoveLabel.style.top = `${mousePosition.y}px`;

            console.log(mousePosition);

            minigameDiv.appendChild(invalidMoveLabel);
        }
        return;
    }

    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    let percX = x / rect.width;
    let percY = y / rect.height;

    let spacePosition = { x: percX * minigameBaseWidth, y: percY * minigameBaseHeight };

    targetPlayerPosition = { ...spacePosition };
    startedMovePosition = { ...playerPosition };
}

function endGame() {
    gameItems.forEach(element => {
        if (element.validItem)
            element.domObj.remove();
    });

    gameItems = [];

    if (spawnItem != null)
        clearInterval(spawnTimer);
    if (playerTimer != null)
        clearInterval(playerTimer);

    if (minigamePlayer != null)
        minigamePlayer.remove();

    minigameDiv.style.display = "none";
    finalScoreDiv.style.display = "block";

    finalScoreDiv.textContent = `Scorul final este: ${gameScore}`;
}