const fruitImagePaths = [];
const fruitNames = [];
let imageRotationTimer;
const winAudio = new Audio('sound/win.mp3');
const loseAudio = new Audio('sound/lose.mp3');
let selectedFruit;
let previouslySelectedElement = null;
let isMusicOn = true; // Track whether the music is on or off

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
    document.getElementById("fruitDisplay").style.opacity = 1;
}

function stopGame() {
    document.getElementById("startButtonEnabled").classList.remove("rotating");
    clearTimeout(imageRotationTimer);
    const randomIndex = Math.floor(Math.random() * fruitNames.length);
    const imageElement = document.getElementById("fruitDisplay");
    imageElement.src = fruitImagePaths[randomIndex];

    // Determine if the user won or lost
    const isWin = selectedFruit === fruitNames[randomIndex].toUpperCase();

    // Play audio only if the music is on
    if (isMusicOn) {
        (isWin ? winAudio : loseAudio).play().catch(error => {
            console.error("Audio playback failed:", error);
        });
    }

    // Set the result text and button visibility
    const resultText = document.getElementById("resultText");
    resultText.innerHTML = isWin ? "You Won!" : "You Lose!";
    resultText.style.visibility = "visible";

    // Handle button visibility
    document.getElementById("startButtonEnabled").style.visibility = "hidden";
    document.getElementById("startButtonDisabled").style.visibility = "visible";
}

function fadeImage(element, opacityValue, fading) {
    // Adjust the opacity value based on whether it's fading in or out
    if (fading) {
        opacityValue -= 1;
    } else {
        opacityValue += 1;
    }

    // Clamp opacity values between 0 and 100
    if (opacityValue <= 0) {
        opacityValue = 0;
        return; // Stop further fading if it's fully transparent
    }

    if (opacityValue >= 100) {
        opacityValue = 100;
        return; // Stop further fading if it's fully opaque
    }

    element.style.opacity = opacityValue / 100;

    // Continue fading after a short delay
    setTimeout(() => fadeImage(element, opacityValue, fading), 10);
}

function rotateFruitImages() {
    const imageElement = document.getElementById("fruitDisplay");
    const randomIndex = Math.floor(Math.random() * fruitImagePaths.length);
    imageElement.src = fruitImagePaths[randomIndex];

    // Don't fade the image completely out, just display it
    fadeImage(imageElement, 100, false);  // Ensure it's fully visible

    imageRotationTimer = setTimeout(rotateFruitImages, 300);
}

function selectFruit(fruitName) {
    selectedFruit = fruitName;

    // Highlight the selected fruit by adding a class
    const fruitImages = document.querySelectorAll(".fruitImage");
    fruitImages.forEach(image => {
        image.classList.remove("selectedFruit"); // Remove highlight from all fruits
    });

    // Find the clicked image and highlight it
    const clickedFruit = Array.from(fruitImages).find(img => img.alt === fruitName);
    clickedFruit.classList.add("selectedFruit");

    document.getElementById("resultText").style.visibility = "hidden";
    document.getElementById("startButtonEnabled").style.visibility = "visible";
    document.getElementById("startButtonDisabled").style.visibility = "hidden";
}

function toggleBackgroundMusic() {

    if (isMusicOn) {
        document.getElementById("playButton").style.display = "none"; // Hide play button
        document.getElementById("muteButton").style.display = "block"; // Show mute button
    } else {
        document.getElementById("muteButton").style.display = "none"; // Hide mute button
        document.getElementById("playButton").style.display = "block"; // Show play button
    }
    isMusicOn = !isMusicOn; // Toggle the music state
}

// Initial setup
loadFruitData();
