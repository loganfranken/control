var gameElement = document.getElementById("game");
gameElement.focus();

var instructionsElement = document.getElementById("instructions");
var narrativeElement = document.getElementById("narrative");

var game = new Game(gameElement, instructionsElement, narrativeElement);
game.start();
