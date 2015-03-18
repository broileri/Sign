var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ";
var index = -1; // alphabet index ^
var success = document.getElementById("yay"); // html element where the animation is played
var yayInterval; // interval used in animation


// ---------------- Game/general stuff --------------------
function init() {
    for (var i = 0; i < alphabet.length; i++) {
        var letter = document.createElement("section");
        letter.id = i;
        letter.appendChild(document.createTextNode(alphabet[i]));
        document.getElementById("showLetter").appendChild(letter);
    }
    success.style.opacity = 0;
    displaySection(randomIndex());
    checkAnswer();
}

function checkAnswer() {
    console.log(document.getElementById("answer").value);
    var textArea = document.getElementById("answer");
    if (textArea.value.toUpperCase() === alphabet[index]) {
        omgWow();
        textArea.value = "";
        displaySection(randomIndex());
    }
}

function displaySection(index) {
    var sections = document.getElementsByTagName("section");

    for (var i = 0; i < sections.length; i++) {
        if (index === i) {
            sections[i].className = '';
        } else {
            sections[i].className = 'hidden';
        }
    }
}

function randomIndex() {
    index = Math.floor(Math.random() * 29) + 0;
    return index;
}


// ----------------- Animation stuff --------------------
function omgWow() {
    clearInterval(yayInterval);
    success.style.opacity = 1;
    yayInterval = setInterval(fading, 5);

}

function fading() {
    if (success.style.opacity <= 0) {
        clearInterval(yayInterval);
    } else {
        success.style.opacity -= 0.01;
    }
}