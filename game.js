const fruitImagePaths = [];
const fruitNames = [];
let currentFruitIndex = 0;
let imageRotationTimer;
let selectedFruitIndex;
const backgroundMusic = new Audio('sound/background.mp3');
const winAudio = new Audio('sound/win.mp3');
const loseAudio = new Audio('sound/lose.mp3');

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
    document.getElementById("startButton").style.visibility = "hidden";
    document.getElementById("stopButton").style.visibility = "visible";
    document.getElementById("stopPrompt").style.visibility = "visible";
    rotateFruitImages();
}

function rotateFruitImages() {
    const imageElement = document.getElementById("fruitDisplay");
    imageElement.src = fruitImagePaths[currentFruitIndex];
    currentFruitIndex = (currentFruitIndex + 1) % fruitImagePaths.length;
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
    document.getElementById("stopButton").style.visibility = "hidden";
}

function stopGame() {
    clearTimeout(imageRotationTimer);
    const randomFruitIndex = Math.floor(Math.random() * fruitImagePaths.length);
    const imageElement = document.getElementById("fruitDisplay");
    imageElement.src = fruitImagePaths[randomFruitIndex];
    const resultMessage = `<h3>You got: ${fruitNames[randomFruitIndex]}</h3>`;
    backgroundMusic.pause();

    const resultElement = (selectedFruitIndex === randomFruitIndex) ? document.getElementById("winDisplay") : document.getElementById("loseDisplay");
    (selectedFruitIndex === randomFruitIndex ? winAudio : loseAudio).play();

    hideGameElements();
    resultElement.style.visibility = "visible";
    document.getElementById("gameResult").innerHTML = resultMessage;
}

function selectFruit(fruitIndex) {
    selectedFruitIndex = fruitIndex;
    document.getElementById("gameResult").innerHTML = "";
    const startButton = document.getElementById("startButton");
    let selectedFruitMessage;

    switch (fruitIndex) {
        case 0: selectedFruitMessage = "You selected WILD"; break;
        case 1: selectedFruitMessage = "You selected STRAWBERRY"; break;
        case 2: selectedFruitMessage = "You selected PINEAPPLE"; break;
        case 3: selectedFruitMessage = "You selected LEMON"; break;
        case 4: selectedFruitMessage = "You selected MELON"; break;
        default: selectedFruitMessage = "You selected GRAPES"; break;
    }

    document.getElementById("selectionPrompt").innerHTML = `<h3>${selectedFruitMessage}</h3><h3>Press the START button to try your luck!</h3>`;
    startButton.style.visibility = "visible";
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
