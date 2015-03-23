var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var index = -1; // alphabet index ^
var success = document.getElementById("successAnimation"); // html element where the animation is played
var animInterval; // interval used in animation
var dictionary;



// ---------------- Game/general stuff --------------------
function init() {    
    var textArea = document.getElementById("answer");
    textArea.addEventListener('keyup', checkAnswer, false);
    success.style.opacity = 0;
    loadDictionary(function () {
        displayWord(randomIndex());    
    });
    checkAnswer();
}

function checkAnswer() {
    var textArea = document.getElementById("answer");
    if (textArea.value.toUpperCase() === alphabet[index]) {
        successAnimationStart();
        textArea.value = "";
        displayWord(randomIndex());
    }
}

function loadDictionary(callback) {
    var xmlhttp;

    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else
    {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                dictionary = xmlhttp.responseText;
                dictionary = dictionary.split("\n");
            }
            else {
                alert("Something went wrong in getting the dictionary file");
            }
        }
    }

    xmlhttp.open("GET", "words.txt", false);
    xmlhttp.send();
    callback();
}

function displayWord(index) {
    var word = dictionary[index];
    word = WordHtml(word);

    var letterArea = document.getElementById("letterArea");
    letterArea.innerHTML = word;
}

function WordHtml(word) {
    var result = "";
    var i = 0;
    while(i < word.length - 1) {
        result += "<span id='" + i + "'>" + word.charAt(i) + "</span>";
        i++
    }
    

    return result;
}

function randomIndex() {
    index = Math.floor(Math.random() * dictionary.length) + 0;
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