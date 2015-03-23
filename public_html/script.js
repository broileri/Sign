var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var index = -1; // alphabet index ^
var success = document.getElementById("successAnimation"); // html element where the animation is played
var animInterval; // interval used in animation


// ---------------- Game/general stuff --------------------
function init() {    
    var textArea = document.getElementById("answer");
    textArea.addEventListener('keyup', checkAnswer, false);
    success.style.opacity = 0;
    displayLetter(randomIndex());
    checkAnswer();
}

function checkAnswer() {
    var textArea = document.getElementById("answer");
    if (textArea.value.toUpperCase() === alphabet[index]) {
        successAnimationStart();
        textArea.value = "";
        displayLetter(randomIndex());
    }
}

function displayLetter(index) {
    var letterArea = document.getElementById("letterArea");
    letterArea.innerHTML = alphabet[index];
}

function randomIndex() {
    index = Math.floor(Math.random() * 26) + 0;
    return index;
}


// ----------------- Animation stuff --------------------
function successAnimationStart() {
    clearInterval(animInterval);
    success.style.opacity = 1;
    animInterval = setInterval(fading, 5);

}

function fading() {
    if (success.style.opacity <= 0) {
        clearInterval(animInterval);
    } else {
        success.style.opacity -= 0.01;
    }
}