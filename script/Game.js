/**
 * The game
 * @constructor
 * @param {HTMLCanvasElement} canvas  - Canvas for displaying the game
 */
function Game(canvas)
{
  this.canvas = canvas;
  this.context = canvas.getContext("2d");

  this.canvasWidth = this.canvas.width;
  this.canvasHeight = this.canvas.height;

  this.mapCenterX = 250;
  this.mapCenterY = 250;

  this.isUpPressed = false;
  this.isLeftPressed = false;
  this.isRightPressed = false;
  this.isDownPressed = false;
  this.isShootPressed = false;
  this.isGlitchPressed = false;

  this.hasGlitched = false;

  this.player = new Ship(0, 0);
  this.bullets = [];
  this.enemies = [];
}

/**
 * Updates the game's state
 */
Game.prototype.update = function()
{
  // Handle player input
  this.handlePlayerInput();

  // Update entities
  this.player.update();
  this.updateEntitites(this.enemies);
  this.updateEntitites(this.bullets);

  // Update player/enemy interactions
  for(var i=0; i<this.enemies.length; i++)
  {
    var enemy = this.enemies[i];

    if(enemy === null)
    {
      continue;
    }

    if(!this.hasGlitched && this.isGlitchPressed && enemy.contains(this.player.x, this.player.y))
    {
      this.enemies.push(this.player);
      this.player = enemy;
      this.hasGlitched = true;
    }
  }

  // Update bullet/enemy interactions
  for(var i=0; i<this.enemies.length; i++)
  {
    var enemy = this.enemies[i];

    if(enemy === null)
    {
      continue;
    }

    enemy.lookAt(this.player.x, this.player.y);
    enemy.moveForward();

    for(var j=0; j<this.bullets.length; j++)
    {
      var bullet = this.bullets[j];

      if(bullet === null)
      {
        continue;
      }

      if(enemy.contains(bullet.x, bullet.y))
      {
        this.enemies[i] = null;
        this.bullets[j] = null;
      }
    }
  }

  // Update bullet death
  for(var i=0; i<this.bullets.length; i++)
  {
    var bullet = this.bullets[i];

    if(bullet === null)
    {
      continue;
    }

    if(bullet.range <= 0)
    {
      this.bullets[i] = null;
    }
  }

}

/**
 * Updates a game's state based on a player's input
 */
Game.prototype.handlePlayerInput = function() {

  if(this.isUpPressed)
  {
    this.player.moveForward();
    this.mapCenterY += this.player.currentVelocityY;
    this.mapCenterX -= this.player.currentVelocityX;
  }

  if(this.isDownPressed)
  {
    this.player.moveBackward();
    this.mapCenterY -= this.player.currentVelocityY;
    this.mapCenterX += this.player.currentVelocityX;
  }

  if(!this.isUpPressed && !this.isDownPressed)
  {
    //this.player.currentSpeed = 0;
  }

  if(this.isRightPressed)
  {
    this.player.rotateClockwise();
  }

  if(this.isLeftPressed)
  {
    this.player.rotateCounterClockwise();
  }

  if(this.isShootPressed && this.player.canShoot())
  {
    this.bullets.push(new Bullet(this.player.x, this.player.y, this.player.rotationDegree, this.player.bulletSpeed, this.player.bulletRange));
    this.player.shoot();
  }

};

/**
 * Draws a collection of entities
 * @param {object[]} - Collection of entities to update
 */
Game.prototype.updateEntitites = function(entities)
{
  entities.forEach(function(entity) {

    if(entity == null)
    {
      return;
    }

    entity.update();
  });
}

/**
 * Draws the game
 */
Game.prototype.draw = function()
{
  var self = this;

  // Clear the canvas
  self.context.clearRect(0, 0, self.canvasWidth, self.canvasHeight);

  // Draw the player
  self.player.draw(self.context, self.mapCenterX, self.mapCenterY);

  // Draw remaining game entities
  self.drawEntitites(self.bullets);
  self.drawEntitites(self.enemies);
}

/**
 * Draws a collection of entities
 * @param {object[]} - Collection of entities to draw
 */
Game.prototype.drawEntitites = function(entities)
{
  var self = this;

  entities.forEach(function(entity) {

    if(entity == null)
    {
      return;
    }

    entity.draw(self.context, self.mapCenterX, self.mapCenterY);
  });
}

/**
 * Starts the game
 */
Game.prototype.start = function()
{
  var self = this;

  self.canvas.addEventListener('keydown', function(event) { toggleKeys(event.keyCode, true); }, false);
  self.canvas.addEventListener('keyup', function(event) { toggleKeys(event.keyCode, false); }, false);

  function toggleKeys(keyCode, isPressed)
  {
    switch(keyCode)
    {
      // Up Arrow
      case 38:
        self.isUpPressed = isPressed;
        break;

      // Right Arrow
      case 39:
        self.isRightPressed = isPressed;
        break;

      // Left Arrow
      case 37:
        self.isLeftPressed = isPressed;
        break;

      // Down Arrow
      case 40:
        self.isDownPressed = isPressed;
        break;

      // X
      case 88:
        self.isShootPressed = isPressed;
        break;

      // Z
      case 90:
        self.isGlitchPressed = isPressed;
        break;
    }
  }

  function loop()
  {
    self.update();
    self.draw();
  }

  // Add mock enemies for testing
  this.enemies.push(new Ship(150, 150));
  this.enemies.push(new Ship(200, 200));

  window.setInterval(loop, 10);
  loop();
}
