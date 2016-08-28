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

  this.isUpPressed = false;
  this.isLeftPressed = false;
  this.isRightPressed = false;
  this.isDownPressed = false;
  this.isShootPressed = false;
  this.isGlitchPressed = false;

  this.hasGlitched = false;

  this.player = new Ship(300, 300);
  this.bullets = [];
  this.enemies = [];
}

/**
 * Updates the game's state
 */
Game.prototype.update = function()
{
  // Handle player input

  if(this.isUpPressed)
  {
    this.player.moveForward();
  }

  if(this.isDownPressed)
  {
    this.player.moveBackward();
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

  this.player.update();

  // Update enemies
  this.enemies.forEach(function(enemy) {

    if(enemy === null)
    {
      return;
    }

    enemy.update();

  });

  // Update bullets
  this.bullets.forEach(function(bullet) {

    if(bullet === null)
    {
      return;
    }

    bullet.update();

  });

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
 * Draws the game
 */
Game.prototype.draw = function()
{
  var self = this;

  // Clear the canvas
  self.context.clearRect(0, 0, self.canvasWidth, self.canvasHeight);

  // Draw the player
  self.player.draw(self.context);

  // Draw the bullets
  self.bullets.forEach(function(bullet) {

    if(bullet == null)
    {
      return;
    }

    bullet.draw(self.context);
  });

  // Draw the enemies
  self.enemies.forEach(function(enemy) {

    if(enemy == null)
    {
      return;
    }

    enemy.draw(self.context);
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
  this.enemies.push(new Ship(50, 50));
  this.enemies.push(new Ship(100, 100));

  window.setInterval(loop, 10);
  loop();
}
