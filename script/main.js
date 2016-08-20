var gameElement = document.getElementById("game");
gameElement.focus();

var game = new Game(gameElement);
game.start();
