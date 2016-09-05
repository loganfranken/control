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

  this.player = ShipFactory.generateRandomShip(0, 0);
  this.bullets = [];
  this.enemies = [];
  this.items = [];
}

/**
 * Updates the game's state
 */
Game.prototype.update = function()
{
  var self = this;

  // Handle player input
  self.handlePlayerInput();

  // Handle player glitching
  if(self.isGlitchPressed)
  {
    self.player.startGlitching();
  }
  else if(self.player.isGlitching)
  {
    self.player.stopGlitching();
  }

  // Update player
  self.player.update();

  // Update enemies
  self.eachEntity(self.enemies, function(enemy, enemyIndex) {

    enemy.update();

    var enemyBoundingCircle = enemy.getBoundingCircle();

    // Update enemy/glitch interaction
    if(self.player.isGlitching
        && enemy.canBeGlitched()
        && self.player.isInGlitchRange(enemyBoundingCircle))
    {
      self.player = enemy;
      return;
    }

    // Update enemy/player interaction
    if(false && self.player.intersects(enemyBoundingCircle))
    {
      var enemySpeed = enemy.currentSpeed;
      var playerSpeed = self.player.currentSpeed;

      var collisionDamage = Math.abs(enemySpeed - playerSpeed);

      // Damage both the player and enemy ship w/ the difference in their speeds
      self.player.damage(collisionDamage);
      enemy.damage(collisionDamage);

      // Push both the enemy and player ship backwards
      self.player.pushBackward(collisionDamage);
      enemy.pushBackward(collisionDamage);
    }

    // Update enemy movement
    if(enemy.target === null)
    {
      enemy.stop();
      enemy.target = Utility.getRandomPoint(self.player.x, self.player.y, 300);
    }

    // Update enemy/bullet interaction
    self.eachEntity(self.bullets, function(bullet, bulletIndex) {

      if(enemy.intersects(bullet.getBoundingCircle()))
      {
        enemy.damage(bullet.damage);

        if(enemy.isDestroyed())
        {
          // Destroy enemy
          self.enemies[enemyIndex] = null;
        }

        self.bullets[bulletIndex] = null;
      }
    });

  });

  // Update bullets
  self.eachEntity(self.bullets, function(bullet, bulletIndex) {

    bullet.update();

    // Update bullet death
    if(bullet.range <= 0)
    {
      self.bullets[bulletIndex] = null;
    }

  });

  // Update items
  self.eachEntity(self.items, function(item, itemIndex) {

    item.update();

    // Update player/item interaction
    if(self.player.contains(item.x, item.y))
    {
      self.items[itemIndex] = null;
    }

  });

  // Condense the entity arrays, removing the nulls
  self.bullets = Utility.condense(self.bullets);
  self.enemies = Utility.condense(self.enemies);
  self.items = Utility.condense(self.items);

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
    this.player.stop();
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
    this.bullets.push(this.player.getBullet());
    this.player.shoot();
  }

};

/**
 * Loops through each entity and calls a function on each entity
 * @param {object[]} entities - Collection of entities to update
 * @param {function} callback - Function to call on each entity
 */
Game.prototype.eachEntity = function(entities, callback)
{
  var entitiesLength = entities.length;

  for(var i=0; i<entitiesLength; i++)
  {
    var entity = entities[i];

    if(entity == null)
    {
      return;
    }

    callback(entity, i);
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

  // Draw bullets
  self.drawEntitites(self.bullets);

  // Draw items
  self.drawEntitites(self.items);

  // Draw enemies
  self.drawEntitites(self.enemies);

  // Draw the player
  self.player.draw(self.context, self.mapCenterX, self.mapCenterY);
}

/**
 * Draws a collection of entities
 * @param {object[]} - Collection of entities to draw
 */
Game.prototype.drawEntitites = function(entities)
{
  var self = this;

  self.eachEntity(entities, function(entity) {

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
  this.enemies.push(ShipFactory.generateRandomShip(150, 150));
  this.enemies.push(ShipFactory.generateRandomShip(200, 200));

  // Add mock items for testing
  this.items.push(new Item(300, 300));
  this.items.push(new Item(50, 50));

  window.setInterval(loop, 10);
  loop();
}
