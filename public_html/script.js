var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var index = -1; // alphabet index ^
var success = document.getElementById("successAnimation"); // html element where the animation is played
var animInterval; // interval used in animation
var dictionary; //In-memory dictionary of words found in Ubuntu words.txt
var originalWord; //The randomly chosen word for this round
var nextCharToSign; //Index of the character the user needs to sign



// ---------------- Game/general stuff --------------------
function init() {    
    var textArea = document.getElementById("answer");
    nextCharToSign = 0;
    textArea.addEventListener('keyup', checkAnswer, false);
    success.style.opacity = 0;
    loadDictionary(function () {
        displayWord(randomIndex());    
    });
    checkAnswer();
}

function checkAnswer() {
    var nextChar = document.getElementById(nextCharToSign).innerHTML.toLowerCase();
    var nextAnswer = document.getElementById("answer").value.toLowerCase();
    if (nextAnswer === nextChar) {
        successAnimationStart();
        document.getElementById(nextCharToSign).style.color = "green";
        nextCharToSign += 1;
        if (nextCharToSign === originalWord.length - 1) {
            nextCharToSign = 0;
            displayWord(randomIndex());
        }
    }
    document.getElementById("answer").value = "";
    
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
    originalWord = dictionary[index];
    word = WordHtml(originalWord);

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