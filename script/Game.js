/**
 * The game
 * @constructor
 * @param {HTMLCanvasElement} canvas  - Canvas for displaying the game
 */
function Game(canvas, messageLogElement, replyButtonElement)
{
  this.canvas = canvas;
  this.context = canvas.getContext("2d");

  this.player = new Ship(100, 100);
}

/**
 * Updates the game's state
 */
Game.prototype.update = function()
{
}

/**
 * Draws the game
 */
Game.prototype.draw = function()
{
  this.player.draw(this.context);
}

/**
 * Starts the game
 */
Game.prototype.start = function()
{
  var self = this;

  function loop()
  {
    self.update();
    self.draw();
  }

  window.setInterval(loop, 50);
  loop();
}
