// initial setup of game and variables
let sentNum = 0;
let ltrNum = 0;
const  sentences = ['ten ate neite ate nee enet ite ate inet ent eate', 'Too ato too nOt enot one totA not anot tOO aNot', 'oat itain oat tain nate eate tea anne inant nean', 'itant eate anot eat nato inate eat anot tain eat', 'nee ene ate ite tent tiet ent ine ene ete ene ate'];
const numberOfWords = 54;
let currentLtr = sentences[sentNum].charAt(ltrNum);
let sLength = sentences[sentNum].length;
let numberOfMistakes = 0;
$('#sentence').text(sentences[sentNum]);
$('#target-letter').text(currentLtr);
let startTime;
let shifted = false;
startGame();

// starts game by adding key listeners
function startGame() {
    $(document).keydown(checkShift);
    $(document).keyup(checkShift);
    $(document).keypress(checkKey);
}


// toggles keyboard depending on whether 'shift' is pressed
function checkShift(e) {
    if (e.shiftKey !== shifted) {
        $('#keyboard-lower-container').toggle();
        $('#keyboard-upper-container').toggle();
        shifted = e.shiftKey;
    }
}

// handles user pressing a key, including highlighting and accuracy checking
function checkKey(e) {
    if (ltrNum === 0 && sentNum === 0) {
        startTime = new Date();
    }
    let k = e.which;
    highlightKey(k);
    checkAccuracy(k);
    // checks if user has finished last sentence, then gives option to play again
    if (checkSentence()) {
        setTimeout(function () {
            $('#feedback').append('<button class="btn btn-success">Play Again?</button>');
            $('button').click(resetGame);
        }, 3000);
    }
}

// highlights key for 100 milliseconds
function highlightKey(k) {
    $('#' + k).toggleClass("key-press");
    setTimeout(function () {
        $('#' + k).toggleClass("key-press");
    }, 100);
}

// checks accuracy of user's input, and displays check or X based on result
function checkAccuracy(k) {
    if (k === currentLtr.charCodeAt()) {
        $('#feedback').append('<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>');
    } else {
        $('#feedback').append('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>');
        numberOfMistakes++;
    }
}

// checks to see if user has finished current sentence, and if so clears screen for next sentence
function checkSentence() {
    if (ltrNum >= (sLength - 1)) {
        sentNum++;
        ltrNum = 0;
        $('#feedback').empty();
        if (checkForGameOver()) {return true};
        $('#sentence').text(sentences[sentNum]);
        sLength = sentences[sentNum].length;
        $('#yellow-block').css("left", "30px");
        displayLetter();
    } else {
        ltrNum++;
        displayLetter();
        $('#yellow-block').css("left", "+=17.4px");
    }
}

// displays target letter that appears on the screen
function displayLetter() {
    currentLtr = sentences[sentNum].charAt(ltrNum);
    $('#target-letter').text(currentLtr);
}

// checks to see if the game is over (i.e. there are no more sentences to display)
function checkForGameOver() {
    if (sentNum >= sentences.length) {
        let endTime = new Date();
        $(document).off();
        let minutes = (endTime - startTime) / 60000;
        let wpm = Math.round(numberOfWords / minutes - 2 * numberOfMistakes);
        $('#sentence').text("You finished the game! You had " + wpm + " words per minute.");
        $('#yellow-block, #target-letter').hide();
        return true;
    } else {
        return false;
    } 
}


// resets game and all game variables, then starts key listeners
function resetGame() {
    sentNum = 0;
    ltrNum = 0;
    sLength = sentences[sentNum].length;
    numberOfMistakes = 0;
    $('button').remove();
    $('#yellow-block, #target-letter').show();
    $('#yellow-block').css("left", "30px");
    displayLetter();
    $('#sentence').text(sentences[sentNum]);
    shifted = false;
    startGame();
}