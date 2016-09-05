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

  this.mapCenterX = 400;
  this.mapCenterY = 300;

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
  this.explosions = [];
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

  // Cache player coordinates to re-center the map
  var oldPlayerX = self.player.x;
  var oldPlayerY = self.player.y;

  // Update player
  self.player.update();

  // Re-center the map
  self.mapCenterX -= (self.player.x - oldPlayerX);
  self.mapCenterY -= (self.player.y - oldPlayerY);

  // Update enemies
  self.eachEntity(self.enemies, function(enemy, enemyIndex) {

    enemy.update();

    var enemyBoundingCircle = enemy.getBoundingCircle();

    // Update enemy/glitch interaction
    if(self.player.isGlitching
        && enemy.canBeGlitched()
        && self.player.isInGlitchRange(enemyBoundingCircle))
    {
      // Cache player coordinates to re-center the map
      var oldPlayerX = self.player.x;
      var oldPlayerY = self.player.y;

      // Trigger an explosion where the old ship was located
      self.explosions.push(new Explosion(self.player.x, self.player.y, self.player.bodyColor));

      // Remove the player's old ship and swap the player with the enemy
      self.player = enemy;
      self.enemies[enemyIndex] = null;

      // Reset the player's health
      self.player.health = self.player.maxHealth;

      // Re-center the map
      self.mapCenterX -= (self.player.x - oldPlayerX);
      self.mapCenterY -= (self.player.y - oldPlayerY);

      return;
    }

    // Update enemy/player collisions
    if(self.player.intersects(enemyBoundingCircle))
    {
      self.handleCollision(self.player, enemy);
    }

    // Update enemy/enemy collisions
    self.eachEntity(self.enemies, function(otherEnemy) {

      if(enemy.id === otherEnemy.id)
      {
        return;
      }

      if(enemy.intersects(otherEnemy.getBoundingCircle()))
      {
        self.handleCollision(otherEnemy, enemy);
      }

    });

    // Update enemy movement
    if(enemy.behavior === ShipBehavior.Lazy)
    {
      enemy.moveForward();
    }

    if(enemy.behavior === ShipBehavior.Aggressive)
    {
      enemy.lookTowards(self.player.x, self.player.y);
      enemy.moveForward();

      if(enemy.canShoot())
      {
        self.bullets.push(enemy.getBullet());
        enemy.shoot();
      }
    }

    if(enemy.behavior === ShipBehavior.Fearful)
    {
      enemy.lookAwayFrom(self.player.x, self.player.y);
      enemy.moveForward();
    }

    // Update enemy/bullet interaction
    self.eachEntity(self.bullets, function(bullet, bulletIndex) {

      // No friendly fire
      if(bullet.sourceId === enemy.id)
      {
        return;
      }

      if(enemy.intersects(bullet.getBoundingCircle()))
      {
        enemy.damage(bullet.damage);

        if(enemy.isDestroyed())
        {
          // Destroy enemy
          self.enemies[enemyIndex] = null;
          self.explosions.push(new Explosion(enemy.x, enemy.y, enemy.bodyColor));
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

  // Update explosions
  self.eachEntity(self.explosions, function(explosion, explosionIndex) {

    if(explosion.isFinished())
    {
      self.explosions[explosionIndex] = null;
    }

  });

  // Condense the entity arrays, removing the nulls
  self.bullets = Utility.condense(self.bullets);
  self.enemies = Utility.condense(self.enemies);
  self.items = Utility.condense(self.items);
  self.explosions = Utility.condense(self.explosions);

}

/**
 * Handle a collision between two ships
 * @param {object} entityA - First entity involved in the collision
 * @param {object} entityB - Second entity involved in the collision
 */
Game.prototype.handleCollision = function(entityA, entityB) {

  var entityASpeed = entityA.speed;
  var entityBSpeed = entityB.speed;

  var collisionDamage = Math.abs(entityASpeed - entityBSpeed);

  // Damage both the player and enemy ship w/ the difference in their speeds
  entityA.damage(collisionDamage);
  entityB.damage(collisionDamage);

  // Push both the enemy and player ship backwards
  var pushBackSpeed = (entityASpeed > entityBSpeed ? entityASpeed : entityBSpeed) * 1.5;
  entityA.pushBackward(pushBackSpeed);
  entityB.pushBackward(pushBackSpeed);

}

/**
 * Updates a game's state based on a player's input
 */
Game.prototype.handlePlayerInput = function() {

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

  // Draw explosions
  self.drawEntitites(self.explosions);

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
