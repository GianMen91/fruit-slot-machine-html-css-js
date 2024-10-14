const fruitPaths = [];
const fruitNames = [];
let currentFruitIndex = 0;
let timerId;
let selectedFruitIndex;
const audio = new Audio('sound/background.mp3');
const winSound = new Audio('sound/win.mp3');
const loseSound = new Audio('sound/lose.mp3');

function loadJSONDoc() {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            parseJSON(JSON.parse(xmlhttp.responseText));
        }
    };
    xmlhttp.open("GET", "symbols.json", true);
    xmlhttp.send();
}

function parseJSON(jsonDoc) {
    const fruits = jsonDoc.symbols; // Accessing the symbols array
    for (let i = 0; i < fruits.length; i++) {
        fruitPaths[i] = fruits[i].src; // Get image source
        fruitNames[i] = fruits[i].name; // Get fruit name
    }
}

function change() {
    document.getElementById("push").style.visibility = "hidden";
    const stopButton = document.getElementById("stop");
    stopButton.style.visibility = "visible";
    document.getElementById("stoppete").style.visibility = "visible";
    changeImage();
}

function changeImage() {
    const img = document.getElementById("begin");
    img.src = fruitPaths[currentFruitIndex];
    currentFruitIndex = (currentFruitIndex + 1) % fruitPaths.length;
    fadeImg(img, 100, true);
    timerId = setTimeout(changeImage, 300);
}

function fadeImg(el, val, fading) {
    val += fading ? -1 : 1;
    if (val > 0 && val < 100) {
        el.style.opacity = val / 100;
        setTimeout(() => fadeImg(el, val, fading), 10);
    }
}

function hideElements() {
    document.getElementById("seleziona").style.visibility = "hidden";
    document.getElementById("groups").style.visibility = "hidden";
    document.getElementById("selectiontext").style.visibility = "hidden";
    document.getElementById("stop").style.visibility = "hidden";
}

function stopGame() {
    clearTimeout(timerId);
    const randomIndex = Math.floor(Math.random() * fruitPaths.length);
    const img = document.getElementById("begin");
    img.src = fruitPaths[randomIndex];
    const resultText = `<h3>The Lady Luck gave you: ${fruitNames[randomIndex]}</h3>`;
    audio.pause();

    const resultElement = (selectedFruitIndex === randomIndex) ? document.getElementById("win") : document.getElementById("lose");
    (selectedFruitIndex === randomIndex ? winSound : loseSound).play();

    hideElements();
    resultElement.style.visibility = "visible";
    document.getElementById("result").innerHTML = resultText;
}

function selectFruit(n) {
    selectedFruitIndex = n;
    document.getElementById("result").innerHTML = "";
    const button = document.getElementById("push");
    let text;

    switch (n) {
        case 0: text = "You selected WILD"; break;
        case 1: text = "You selected STRAWBERRY"; break;
        case 2: text = "You selected PINEAPPLE"; break;
        case 3: text = "You selected LEMON"; break;
        case 4: text = "You selected MELON"; break;
        default: text = "You selected GRAPES"; break;
    }

    document.getElementById("selectiontext").innerHTML = `<h3>${text}</h3><h3>Push the RED BUTTON to take our chances</h3>`;
    button.style.visibility = "visible";
}

function toggleMusic() {
    if (audio.paused) {
        audio.play();
        document.getElementById("sound").style.visibility = "visible";
        document.getElementById("sound1").style.visibility = "hidden";
    } else {
        audio.pause();
        document.getElementById("sound").style.visibility = "hidden";
        document.getElementById("sound1").style.visibility = "visible";
    }
}

document.getElementById("sound").onclick = function() {
    audio.play();
};

// Initial setup
audio.currentTime = 0;
loadJSONDoc(); // Call the function to load JSON
