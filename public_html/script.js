var success = document.getElementById("successAnimation"); // html element where the animation is played
var animInterval; // interval used in animation
var dictionary; //In-memory dictionary of words found in Ubuntu words.txt
var originalWord; //The randomly chosen word for this round
var nextCharToSign; //Index of the character the user needs to sign
var timer;
var perfect; // true if player signs or types every letter correctly
var scoreMultiplier = 1;

// ---------------- Game/general stuff --------------------
$(document).ready(function () {
    perfect = true;
    var textArea = document.getElementById("answer");
    nextCharToSign = 0;
    textArea.addEventListener('keyup', checkAnswer, false);
    loadDictionary(function () {
        displayWord(randomIndex());
    });
    $(window).resize(function () {
        timer.settings.radius = dynamicSize();
        timer.settings.fontSize = dynamicSize();
    });
    $("#difficulty").children().each(function () {
        $(this).click(function () {
            HighlightSelectedButton(this);
            if ($(this).attr('id') === 'hard') {
                changeDifficulty(3, false);
                scoreMultiplier = 3;
            }
            else if ($(this).attr('id') === 'medium') {
                changeDifficulty(5, true);
                scoreMultiplier = 1.5;
            }
            else if ($(this).attr('id') === 'easy') { 
                changeDifficulty(8, true);
                scoreMultiplier = 1;
            }
        });

    });

    //start the game
    startClock();
    checkAnswer();
});

function HighlightSelectedButton(button) {
    $('#difficulty button').removeClass('selected');
    $(button).addClass('selected');
}

function changeDifficulty(time, showCheatSheet) {
    timer.settings.seconds = time;
    if (showCheatSheet) {
        $("#cheatsheet").show();
    }
    else {
        $("#cheatsheet").hide();
    }
    nextCharToSign = 0;
    displayWord(randomIndex());
    timer.start();
}

function getCurrentScore() {
    return parseFloat($("#points").text());
}

function setCurrentScore(score) {
    $("#points").text(score);
}

function increaseScore() {
    score = getCurrentScore();
    score += (1 * scoreMultiplier);
    setCurrentScore(score);
}

function showCheatPic() {
    $("#cheatsheet img").remove();
    var img = $('<img>');
    img.attr('src', 'Pics/' + originalWord.charAt(nextCharToSign).toLowerCase() + '.jpg');
    img.appendTo('#cheatsheet');
}

function dynamicSize() {
    return $(window).height() * 0.02;
}

function startClock() {
    timer = $("#clock").countdown360({
        radius: dynamicSize(), 
        seconds: 5,
        label: false,
        strokeWidth: 8,
        fontSize: dynamicSize(),
        fontColor: "#FFFFFF",
        fillStyle: "#0276FD",
        strokeStyle: "#003F87",
        startOverAfterAdding: true,
        autostart: false,
        onComplete: function () {
            failedCharacter();
        }
    });
    timer.start();
}

function failedCharacter() {
    perfect = false;
    document.getElementById(nextCharToSign).style.color = "red";
    addToNextCharToSign();
    timer.start();
}

function succeededCharacter() {
    document.getElementById(nextCharToSign).style.color = "green";
    addToNextCharToSign();
    increaseScore();
    timer.start();
}

function addToNextCharToSign() {
    console.log(nextCharToSign);
    nextCharToSign += 1;
    if (nextCharToSign === originalWord.length - 1) {
        if (perfect) {
            successAnimationStart();
        }
        if (FailedWord()) {
            LoseLife();
        }
        perfect = true;
        nextCharToSign = 0;
        displayWord(randomIndex());
        return;
    }
    showCheatPic();
}

function FailedWord() {
    numberOfLetters = $('#letterArea span').length;
    numberOfFailedLetters = 0;

    $('#letterArea span').each(function() {
        if ($(this).attr('style').indexOf('red') > -1) {
            numberOfFailedLetters += 1;
        }
    });

    return numberOfFailedLetters > numberOfLetters / 2;
}

function LoseLife() {
    alert('failed');
}

function checkAnswer() {
    var nextChar = document.getElementById(nextCharToSign).innerHTML.toLowerCase();
    var nextAnswer = document.getElementById("answer").value.toLowerCase();
    if (nextAnswer === nextChar) {
        succeededCharacter();
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

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 200) {
                dictionary = xmlhttp.responseText;
                dictionary = dictionary.split("\n");
            }
            else {
                alert("Something went wrong in getting the dictionary file");
            }
        }
    };

    xmlhttp.open("GET", "words.txt", false);
    xmlhttp.send();
    callback();
}

function displayWord(index) {
    originalWord = dictionary[index];
    word = WordHtml(originalWord);

    var letterArea = document.getElementById("letterArea");
    letterArea.innerHTML = word;
    showCheatPic();
}

function WordHtml(word) {
    var result = "";
    var i = 0;
    while (i < word.length - 1) {
        result += "<span id='" + i + "'>" + word.charAt(i) + "</span>";
        i++;
    }
    return result;
}

function randomIndex() {
    return Math.floor(Math.random() * dictionary.length) + 0;
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
        success.style.opacity -= 0.008;
    }
}