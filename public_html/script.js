var success = document.getElementById("successAnimation"); // html element where the animation is played
var animInterval; // interval used in animation
var dictionary; //In-memory dictionary of words found in Ubuntu words.txt
var originalWord; //The randomly chosen word for this round
var nextCharToSign; //Index of the character the user needs to sign
var timer;
var perfect; // true if player signs or types every letter correctly
var scoreMultiplier;
var lives;
var difficultySettings = {
    'easy': {
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
    CreateWebSocket(function() {
        ShowStartScreen();        
    })
});

$(window).unload(function () {
    CloseWebSocket();
});

function ShowStartScreen() {
    $('#startScreen button').each(function () {
        $(this).click(function () {

            $('html').css('cursor', 'wait');
            HighlightSelectedButton($('#difficulty button:contains(' + $(this).text() + ')'));
            difficultyConfig = GetDifficultySettings($(this).text());

            setTimeout(function() {
                $('html').css('cursor', 'default');
                $('#startScreen').hide();
                $('#gameWrapper').show();
                StartGame(difficultyConfig);
            }, 2000);
        });
    });
}

function StartGame(difficultySettings) {
    
    $("#sadFrog img").remove();
    
    $(window).resize(function () {
        timer.settings.radius = dynamicSize();
        timer.settings.fontSize = dynamicSize();
    });


    if (!difficultySettings.showSignPictures) {
        $("#cheatsheet").hide();
    }

    var textArea = $('#answer');
    textArea.keyup(checkAnswer);

    loadDictionary(function () {
        displayWord(randomIndex());
    });

    BindClicksToDifficultyButtons();

    changeDifficulty(difficultySettings);
    checkAnswer();
}

function GetDifficultySettings(difficulty) {
    return difficultySettings[difficulty.toLowerCase()];
}

function BindClicksToDifficultyButtons() {
    $("#difficulty").children().each(function () {
        $(this).click(function () {
            HighlightSelectedButton(this);
            changeDifficulty(GetDifficultySettings($(this).text()));
        });
    });
}

function HighlightSelectedButton(button) {
    $('#difficulty button').removeClass('selected');
    $(button).addClass('selected');
}

function changeDifficulty(difficultySettings) {
    startClock(difficultySettings['clock']);
    scoreMultiplier = difficultySettings['multiplier'];
    if (difficultySettings['showSignPictures']) {
        $("#cheatsheet").show();
    }
    else {
        $("#cheatsheet").hide();
    }
    perfect = true;
    loadLives();
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
        seconds: 0,
        label: false,
        strokeWidth: 8,
        fontSize: dynamicSize(),
        fontColor: "#FFFFFF",
        fillStyle: "#0276FD",
        strokeStyle: "#003F87",
        startOverAfterAdding: true,
        autostart: false,
        onComplete: function () {
            if (lives > 0) {
                failedCharacter();    
            }
        }
    });
    timer.settings.seconds = numberOfSecondsOnClock;
    timer.start();
}

function loadLives() {
    $("#lifeDiv img").remove();
    lives = 3;
    for (var life = 0; life < lives; life++) {
        var img = $('<img>');
        img.attr('src', 'Pics/heart.png');
        img.appendTo('#lifeDiv');
    }
}


function killOneLife() {
    lives--;
    $("#lifeDiv img")[0].remove();
    if (lives === 0) {
        GameOver();
    }
}

function GameOver() {
    points = $('#points').text();

    $('#gameWrapper').hide();
    $('#startScreen #welcomeHeader').hide();

    $('#startScreen #gameOverHeader').show();
        
    var img = $('<img>');
    img.attr('src', 'Pics/frog.png');
    img.appendTo('#sadFrog');
    
    $('#startScreen').show();
    
    $('#startScreen #scored').text(points);

    timer.stop();
}

function failedCharacter() {
    perfect = false;
    document.getElementById(nextCharToSign).style.color = "red";
    killOneLife();
    if (lives > 0) {
        addToNextCharToSign();
        timer.start();
    }
}

function succeededCharacter() {
    document.getElementById(nextCharToSign).style.color = "green";
    addToNextCharToSign();
    increaseScore();
    timer.start();
}

function addToNextCharToSign() {
    //console.log(nextCharToSign);
    nextCharToSign += 1;
    if (nextCharToSign === originalWord.length - 1) {
        if (perfect) {
            successAnimationStart();
        }
        perfect = true;
        nextCharToSign = 0;
        displayWord(randomIndex());
        return;
    }
    showCheatPic();
}

function checkAnswer() {
    var nextChar = document.getElementById(nextCharToSign).innerHTML.toLowerCase();
    var nextAnswer = document.getElementById("answer").value.toLowerCase();
    if (nextAnswer === nextChar) {
        succeededCharacter();
    }
    document.getElementById("answer").value = "";

}

function checkSignedAnswer(data) {
    nextAnswer = document.getElementById("answer").value.toLowerCase();
    if (data === nextAnswer) {
        succeededCharacter();
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

    $("#successAnimation img").remove();
    var img = $('<img>');
    img.attr('src', 'Pics/strong.png');
    img.appendTo('#successAnimation');

    if (success.style.opacity <= 0) {
        clearInterval(animInterval);
    } else {
        success.style.opacity -= 0.008;
    }
}