var success = document.getElementById("successAnimation"); // html element where the animation is played
var animInterval; // interval used in animation
var dictionary; //In-memory dictionary of words found in Ubuntu words.txt
var originalWord; //The randomly chosen word for this round
var nextCharToSign; //Index of the character the user needs to sign
var timer;
var perfect; // true if player signs or types every letter correctly
var scoreMultiplier;
var difficultySettings = {
                            'easy':{
                                'multiplier': 1,
                                'clock': 8,
                                'showSignPictures': true
                            },
                              'medium': {
                                'multiplier': 1.5,
                                'clock': 5,
                                'showSignPictures': true
                              },
                              'hard': {
                                'multiplier': 3,
                                'clock': 3,
                                'showSignPictures': false
                              }
                          };

$(document).ready(function () {
    ShowStartScreen();
});

function ShowStartScreen() {
    $('#startScreen button').each(function (){
        $(this).click(function() {
            $('#startScreen').hide();
            $('#gameWrapper').show();
            StartGame(GetDifficultySettings($(this).text()));
        });
    });
}

function StartGame(difficultySettings) {
    $(window).resize(function () {
        timer.settings.radius = dynamicSize();
        timer.settings.fontSize = dynamicSize();
    });

    var textArea = $('#answer');
    textArea.keyup(checkAnswer);

    loadDictionary(function () {
        displayWord(randomIndex());
    });

    BindClicksToDifficultyButtons();

    startClock(difficultySettings['clock']);
    scoreMultiplier = difficultySettings['multiplier'];
    nextCharToSign = 0;
    perfect = true;
    checkAnswer();
}

function GetDifficultySettings(difficulty) {
    return difficultySettings[difficulty.toLowerCase()];
}

function BindClicksToDifficultyButtons() {
    $("#difficulty").children().each(function () {
        $(this).click(function () {
            HighlightSelectedButton(this);
            changeDifficulty(GetDifficultySettings($(this).attr('id')));
        });
    });
}

function HighlightSelectedButton(button) {
    $('#difficulty button').removeClass('selected');
    $(button).addClass('selected');
}

function changeDifficulty(difficultySettings) {
    timer.settings.seconds = difficultySettings['clock'];
    scoreMultiplier = difficultySettings['multiplier'];
    if (difficultySettings['showSignPictures']) {
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

function startClock(numberOfSecondsOnClock) {
    timer = $("#clock").countdown360({
        radius: dynamicSize(), 
        seconds: numberOfSecondsOnClock,
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
    return;
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
                alert("Something went wrong in getting the dictionary file. Please refresh.");
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