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

let spinning = false;

function startGame() {
    if (!spinning) {
        spinFruits();
    }
    setTimeout(stopGame, 3000); // Stop after 3 seconds
}

function spinFruits() {
    spinning = true;
    // Add spin class to start the animation
    document.getElementById("firstFruitDisplayed").classList.add("spin");
    document.getElementById("secondFruitDisplayed").classList.add("spin");
    document.getElementById("thirdFruitDisplayed").classList.add("spin");

    // Rotate images periodically during the spin
    rotateFruitImage("firstFruitDisplayed");
    rotateFruitImage("secondFruitDisplayed");
    rotateFruitImage("thirdFruitDisplayed");
}

function rotateFruitImage(elementId) {
    const imageElement = document.getElementById(elementId);
    const randomIndex = Math.floor(Math.random() * fruitImagePaths.length);
    imageElement.src = fruitImagePaths[randomIndex];

    if (spinning) {
        setTimeout(() => rotateFruitImage(elementId), 300); // Adjust the speed here
    }
}

function stopGame() {
    spinning = false;

    // Stop the animation and clear the spin class
    document.getElementById("firstFruitDisplayed").classList.remove("spin");
    document.getElementById("secondFruitDisplayed").classList.remove("spin");
    document.getElementById("thirdFruitDisplayed").classList.remove("spin");

    const firstFruit = getRandomFruit();
    const secondFruit = getRandomFruit();
    const thirdFruit = getRandomFruit();

    // Show the final result for each fruit display
    document.getElementById("firstFruitDisplayed").src = fruitImagePaths[firstFruit];
    document.getElementById("secondFruitDisplayed").src = fruitImagePaths[secondFruit];
    document.getElementById("thirdFruitDisplayed").src = fruitImagePaths[thirdFruit];

    // Check for win or lose
    const resultElement = (firstFruit === secondFruit && secondFruit === thirdFruit) ? document.getElementById("winDisplay") : document.getElementById("loseDisplay");
    (firstFruit === secondFruit && secondFruit === thirdFruit ? winAudio : loseAudio).play();

    resultElement.style.visibility = "visible";
}

function getRandomFruit() {
    return Math.floor(Math.random() * fruitImagePaths.length);
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
