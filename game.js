const fruitImagePaths = [];
const fruitNames = [];
let imageRotationTimer;
const backgroundMusic = new Audio('sound/background.mp3');
const winAudio = new Audio('sound/win.mp3');
const loseAudio = new Audio('sound/lose.mp3');
let selectedFruit;

function loadFruitData() {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            populateFruitData(JSON.parse(request.responseText));
        }
    };
    request.open("GET", "symbols.json", true);
    request.send();
}

function populateFruitData(data) {
    const fruits = data.symbols;
    for (let i = 0; i < fruits.length; i++) {
        fruitImagePaths[i] = fruits[i].src;
        fruitNames[i] = fruits[i].name;
    }
}

function startGame() {
    rotateFruitImages();
    setTimeout(stopGame, 3000);
}

function stopGame() {
    clearTimeout(imageRotationTimer);
    const randomIndex = Math.floor(Math.random() * fruitNames.length);
    const imageElement = document.getElementById("fruitDisplay");
    imageElement.src = fruitImagePaths[randomIndex];
    const resultMessage = `<h3>You got: ${fruitNames[randomIndex]}</h3>`;
    backgroundMusic.pause();

    const resultElement = (selectedFruit === fruitNames[randomIndex]) ? document.getElementById("winDisplay") : document.getElementById("loseDisplay");
    (selectedFruit === fruitNames[randomIndex] ? winAudio : loseAudio).play();

    hideGameElements();
    resultElement.style.visibility = "visible";
    document.getElementById("gameResult").innerHTML = resultMessage;
}

function rotateFruitImages() {
    const imageElement = document.getElementById("fruitDisplay");
    const randomIndex = Math.floor(Math.random() * fruitImagePaths.length);
    imageElement.src = fruitImagePaths[randomIndex];
    fadeImage(imageElement, 100, true);
    imageRotationTimer = setTimeout(rotateFruitImages, 300);
}

function fadeImage(element, opacityValue, fading) {
    opacityValue += fading ? -1 : 1;
    if (opacityValue > 0 && opacityValue < 100) {
        element.style.opacity = opacityValue / 100;
        setTimeout(() => fadeImage(element, opacityValue, fading), 10);
    }
}

function hideGameElements() {
    document.getElementById("fruitSelection").style.visibility = "hidden";
    document.getElementById("fruitOptions").style.visibility = "hidden";
    document.getElementById("selectionPrompt").style.visibility = "hidden";
}

function selectFruit(fruitName) {
    document.getElementById("gameResult").innerHTML = "";
    selectedFruit = fruitName;

    document.getElementById("selectionPrompt").innerHTML = `<h3>You selected ${fruitName}</h3><h3>Press the START button to test your luck!</h3>`;
    document.getElementById("startButtonEnabled").style.visibility = "visible";
    document.getElementById("startButtonDisabled").style.visibility = "hidden";
}

function toggleBackgroundMusic() {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        document.getElementById("muteButton").style.visibility = "visible";
        document.getElementById("playButton").style.visibility = "hidden";
    } else {
        backgroundMusic.pause();
        document.getElementById("muteButton").style.visibility = "hidden";
        document.getElementById("playButton").style.visibility = "visible";
    }
}

document.getElementById("muteButton").onclick = function() {
    backgroundMusic.play();
};

// Initial setup
backgroundMusic.currentTime = 0;
loadFruitData();
