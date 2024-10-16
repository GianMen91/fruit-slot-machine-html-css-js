// Array to store the image paths of the fruits
const fruitImagePaths = [];

// Array to store the names of the fruits
const fruitNames = [];

// Timer for rotating fruit images
let imageRotationTimer;

// Audio elements for win and lose sounds
const winAudio = new Audio('sound/win.mp3');
const loseAudio = new Audio('sound/lose.mp3');

// Variable to store the currently selected fruit by the player
let selectedFruit;

// To store the previously selected fruit element (for CSS styling)
let previouslySelectedElement = null;

// Variable to track whether the music is on or off
let isMusicOn = true;

/**
 * Function to load fruit data from a JSON file (symbols.json).
 * It sends an HTTP request to retrieve the data and calls the function to populate it.
 */
function loadFruitData() {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        // Check if the request is completed and successful
        if (request.readyState === 4 && request.status === 200) {
            // Populate the fruit data into the arrays
            populateFruitData(JSON.parse(request.responseText));
        }
    };
    // Send GET request to retrieve the symbols.json file
    request.open("GET", "symbols.json", true);
    request.send();
}

/**
 * Function to populate fruit image paths and names into respective arrays.
 * @param {Object} data - The JSON data containing fruit symbols.
 */
function populateFruitData(data) {
    const fruits = data.symbols;
    for (let i = 0; i < fruits.length; i++) {
        // Store fruit image paths and names
        fruitImagePaths[i] = fruits[i].src;
        fruitNames[i] = fruits[i].name;
    }
}

/**
 * Function to start the game. It starts the rotation of fruit images
 * and sets a timer to stop the game after 3 seconds.
 */
function startGame() {
    // Add rotation animation to the start button
    document.getElementById("startButtonEnabled").classList.add("rotating");
    // Begin rotating fruit images
    rotateFruitImages();
    // Stop the game after 3 seconds
    setTimeout(stopGame, 3000);
    // Make the fruit display visible
    document.getElementById("fruitDisplay").style.opacity = 1;
}

/**
 * Function to stop the game. It stops the rotation, selects a random fruit, and displays the result (win or lose).
 */
function stopGame() {
    // Remove the rotation animation from the start button
    document.getElementById("startButtonEnabled").classList.remove("rotating");
    // Stop the fruit image rotation
    clearTimeout(imageRotationTimer);

    // Select a random fruit and display it
    const randomIndex = Math.floor(Math.random() * fruitNames.length);
    const imageElement = document.getElementById("fruitDisplay");
    imageElement.src = fruitImagePaths[randomIndex];

    // Check if the player won (if the selected fruit matches the random fruit)
    const isWin = selectedFruit === fruitNames[randomIndex].toUpperCase();

    // Play the win or lose sound if music is on
    if (isMusicOn) {
        (isWin ? winAudio : loseAudio).play().catch(error => {
            console.error("Audio playback failed:", error);
        });
    }

    // Display the win or lose message
    const resultText = document.getElementById("resultText");
    resultText.innerHTML = isWin ? "You Won!" : "You Lose!";
    resultText.style.visibility = "visible";

    // Hide the enabled start button and show the disabled one
    document.getElementById("startButtonEnabled").style.visibility = "hidden";
    document.getElementById("startButtonDisabled").style.visibility = "visible";
}

/**
 * Function to fade the opacity of an image element. The opacity value decreases or increases
 * depending on the 'fading' parameter.
 * @param {HTMLElement} element - The image element to apply the fade effect.
 * @param {number} opacityValue - The current opacity value.
 * @param {boolean} fading - Whether to fade out (true) or fade in (false).
 */
function fadeImage(element, opacityValue, fading) {
    if (fading) {
        opacityValue -= 1; // Decrease opacity if fading out
    } else {
        opacityValue += 1; // Increase opacity if fading in
    }

    // Ensure opacity doesn't go out of bounds
    if (opacityValue <= 0) {
        opacityValue = 0;
        return;
    }
    if (opacityValue >= 100) {
        opacityValue = 100;
        return;
    }

    // Apply the new opacity to the element
    element.style.opacity = opacityValue / 100;

    // Continuously apply fade effect until it stops
    setTimeout(() => fadeImage(element, opacityValue, fading), 10);
}

/**
 * Function to rotate and change fruit images every 300 milliseconds, creating a slot-machine effect.
 */
function rotateFruitImages() {
    const imageElement = document.getElementById("fruitDisplay");
    // Pick a random fruit image and display it
    const randomIndex = Math.floor(Math.random() * fruitImagePaths.length);
    imageElement.src = fruitImagePaths[randomIndex];
    // Fade in the newly displayed fruit image
    fadeImage(imageElement, 100, false);
    // Repeat the rotation every 300 milliseconds
    imageRotationTimer = setTimeout(rotateFruitImages, 300);
}

/**
 * Function to handle the player's selection of a fruit.
 * Highlights the selected fruit and enables the start button.
 * @param {string} fruitName - The name of the selected fruit.
 */
function selectFruit(fruitName) {
    selectedFruit = fruitName;

    // Remove the selected styling from any previously selected fruit
    const fruitImages = document.querySelectorAll(".fruitImage");
    fruitImages.forEach(image => {
        image.classList.remove("selectedFruit");
    });

    // Find the clicked fruit image and apply the selected styling
    const clickedFruit = Array.from(fruitImages).find(img => img.alt === fruitName);
    clickedFruit.classList.add("selectedFruit");

    // Hide the result text and enable the start button
    document.getElementById("resultText").style.visibility = "hidden";
    document.getElementById("startButtonEnabled").style.visibility = "visible";
    document.getElementById("startButtonDisabled").style.visibility = "hidden";
}

/**
 * Function to toggle background music on or off. It switches between the play and mute buttons.
 */
function toggleBackgroundMusic() {
    // Switch between play and mute button display
    if (isMusicOn) {
        document.getElementById("playButton").style.display = "none";
        document.getElementById("muteButton").style.display = "block";
    } else {
        document.getElementById("muteButton").style.display = "none";
        document.getElementById("playButton").style.display = "block";
    }
    // Toggle the music state
    isMusicOn = !isMusicOn;
}

// Load the fruit data when the page is loaded
loadFruitData();
