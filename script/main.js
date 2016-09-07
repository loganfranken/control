var gameElement = document.getElementById("game");
gameElement.focus();

var instructionsElement = document.getElementById("instructions");
var narrativeElement = document.getElementById("narrative");
var scoreElement = document.getElementById("current-score");
var highScoreElement = document.getElementById("high-score");

var game = new Game(gameElement, instructionsElement, narrativeElement, scoreElement, highScoreElement);
game.start();
