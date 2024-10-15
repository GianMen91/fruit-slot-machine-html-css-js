const fruitImagePaths = [];
const fruitNames = [];
let imageRotationTimer;
const backgroundMusic = new Audio('sound/background.mp3');
const winAudio = new Audio('sound/win.mp3');
const loseAudio = new Audio('sound/lose.mp3');
let selectedFruit;
let previouslySelectedElement = null;

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
    document.getElementById("startButtonEnabled").classList.add("rotating");
    rotateFruitImages();
    setTimeout(stopGame, 3000);
}

function stopGame() {
   document.getElementById("startButtonEnabled").classList.remove("rotating");
    clearTimeout(imageRotationTimer);
    const randomIndex = Math.floor(Math.random() * fruitNames.length);
    const imageElement = document.getElementById("fruitDisplay");
    imageElement.src = fruitImagePaths[randomIndex];
    const resultMessage = `<h3>You got: ${fruitNames[randomIndex].toUpperCase()}</h3>`;
    backgroundMusic.pause();

    const resultElement = (selectedFruit === fruitNames[randomIndex].toUpperCase()) ? document.getElementById("winDisplay") : document.getElementById("loseDisplay");
    (selectedFruit === fruitNames[randomIndex].toUpperCase() ? winAudio : loseAudio).play();

    resultElement.style.visibility = "visible";


    document.getElementById("startButtonDisabled").style.visibility = "visible";
    document.getElementById("startButtonEnabled").style.visibility = "hidden";

}

function restartGame(elementId) {
    // Reset the selected fruit
    selectedFruit = null;

    // Remove any visual highlight from the selected fruit
    const fruitImages = document.querySelectorAll(".fruitImage");
    fruitImages.forEach(image => {
        image.classList.remove("selectedFruit");
    });
    document.getElementById("fruitDisplay").style.opacity = 1;

    // Hide the game result and any visible game elements
    document.getElementById("gameResult").style.visibility = "hidden";
    document.getElementById(elementId).style.visibility = "hidden";

    document.getElementById("fruitDisplay").style.visibility = "visible";


    // Reset the start button visibility
    document.getElementById("startButtonEnabled").style.visibility = "hidden";
    document.getElementById("startButtonDisabled").style.visibility = "visible";

    // Optionally, reset the selection prompt or any other elements
    document.getElementById("selectionPrompt").innerHTML = "";
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

function selectFruit(fruitName) {
    document.getElementById("gameResult").innerHTML = "";
    selectedFruit = fruitName;

    // Highlight the selected fruit by adding a class
    const fruitImages = document.querySelectorAll(".fruitImage");
    fruitImages.forEach(image => {
        image.classList.remove("selectedFruit"); // Remove highlight from all fruits
    });

    // Find the clicked image and highlight it
    const clickedFruit = Array.from(fruitImages).find(img => img.alt === fruitName);
    clickedFruit.classList.add("selectedFruit");

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
