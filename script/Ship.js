/**
 * A ship
 * @constructor
 * @param {integer} x - X-coordinate of the ship
 * @param {integer} y - Y-cooridnate of the ship
 */
function Ship(x, y) {

  this.x = x;
  this.y = y;

  this.rotationDegree = 0;
  this.currentRadians = 0;

  this.currentVelocityY = 0;
  this.currentVelocityX = 0;

  this.currentDriftY = 0;
  this.currentDriftX = 0;

  this.maxSpeed = 3;
  this.currentSpeed = 2;
  this.rotationSpeed = 1;

  this.drift = 0.01;
  this.acceleration = 0.01;

  this.bulletDelay = 30;
  this.currentBulletDelay = 0;
  this.bulletSpeed = 2.5;
  this.bulletRange = 100;

  this.height = 30;
  this.width = 20;
  this.halfWidth = (this.width/2);

  this.color = 'rgb(255, 255, 255)';

  this.target = null;

  // Initialize the ship
  this.updateMovement(0);

}

/**
 * Renders the ship
 * @param {CanvasRenderingContext2D}  context     - 2D rendering context to use when rendering the ship
 * @param {integer}                   mapCenterX  - X-coordinate of the map's center
 * @param {integer}                   mapCenterY  - Y-coordinate of the map's center
 */
Ship.prototype.draw = function(context, mapCenterX, mapCenterY) {

  context.save();

  context.fillStyle = this.color;

  context.translate(this.x + mapCenterX, this.y + mapCenterY);
  context.rotate(this.currentRadians);

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(-this.halfWidth, 0);
  context.lineTo(-this.halfWidth, -this.height);
  context.lineTo(this.halfWidth, -this.height);
  context.lineTo(this.halfWidth, 0);

  context.fill();
  context.restore();

};

/**
 * Updates the ship's state
 */
Ship.prototype.update = function() {

  // Reduce bullet delay
  if(this.currentBulletDelay > 0)
  {
    this.currentBulletDelay--;
  }

  // If this ship has an assigned target, move it towards the target
  if(this.target)
  {
    if(Utility.within(this.x, this.target.x, 10) && Utility.within(this.y, this.target.y, 10))
    {
      this.target = null;
    }
    else
    {
      this.lookAt(this.target.x, this.target.y);
      this.moveForward();
    }
  }

  // Apply drift
  //this.y += this.currentDriftY;
  //this.x += this.currentDriftX;

  // Normalize speed
  //if(this.currentSpeed >= this.maxSpeed)
  //{
  //  this.currentSpeed = this.maxSpeed;
  //}

  //if(this.currentSpeed <= 0)
  //{
  //  this.currentSpeed = 0;
  //}

};

/**
 * Moves the ship forward
 */
Ship.prototype.moveForward = function() {

  // Move the ship forward
  this.y -= this.currentVelocityY;
  this.x += this.currentVelocityX;
  //this.currentSpeed += this.acceleration;

  // Update drift
  //this.currentDriftY -= (this.currentVelocityY * this.drift);
  //this.currentDriftX += (this.currentVelocityX * this.drift);

  // Cap drift
  //this.currentDriftY = (this.currentDriftY > this.maxSpeed) ? this.maxSpeed : this.currentDriftY;
  //this.currentDriftX = (this.currentDriftX > this.maxSpeed) ? this.maxSpeed : this.currentDriftX;

  this.updateMovement(0);

};

/**
 * Moves the ship backward
 */
Ship.prototype.moveBackward = function() {

  // Move the ship backward
  this.y += this.currentVelocityY;
  this.x -= this.currentVelocityX;
  //this.currentSpeed += this.acceleration;

  // Update drift
  //this.currentDriftY += (this.currentVelocityY * this.drift);
  //this.currentDriftX -= (this.currentVelocityX * this.drift);

  // Cap drift
  //this.currentDriftY = (this.currentDriftY > this.maxSpeed) ? this.maxSpeed : this.currentDriftY;
  //this.currentDriftX = (this.currentDriftX > this.maxSpeed) ? this.maxSpeed : this.currentDriftX;

  this.updateMovement(0);

};

/**
 * Rotates the ship clockwise
 */
Ship.prototype.rotateClockwise = function() {
  this.updateMovement(1);
};

/**
 * Moves the ship counterclockwise
 */
Ship.prototype.rotateCounterClockwise = function() {
  this.updateMovement(-1);
};

/**
 * Updates the ship's movement
 * @param {integer} direction - Direction of the rotation (0 = no rotation, 1 = clockwise, -1 = counterclockwise)
 */
Ship.prototype.updateMovement = function(direction) {

  this.rotationDegree += (direction * this.rotationSpeed);

  this.currentRadians = Utility.toRadians(this.rotationDegree);
  this.currentVelocityY = this.currentSpeed * Math.cos(this.currentRadians);
  this.currentVelocityX = this.currentSpeed * Math.sin(this.currentRadians);

};

/**
 * Determines whether or not the ship contains the given point
 * @param {integer} x - X-coordinate to test
 * @param {integer} y - Y-coordinate to test
 */
Ship.prototype.contains = function(x, y) {
  return (x > this.x - this.width) && (x < this.x + this.width) && (y > this.y - this.height) && (y < this.y + this.height);
};

/**
 * Whether or not the ship can shoot a bullet
 */
Ship.prototype.canShoot = function() {
  return (this.currentBulletDelay === 0);
};

/**
 * Updates the ship's status to reflect a bullet being shot
 */
Ship.prototype.shoot = function() {
  this.currentBulletDelay = this.bulletDelay;
};

/**
 * Rotates the ship to face the specified point
 * @param {integer} x - X-coordinate to look at
 * @param {integer} y - Y-coordinate to look at
 */
Ship.prototype.lookAt = function(x, y) {

  var targetX = this.x - x;
  var targetY = this.y - y;

  this.rotationDegree = -Math.atan2(targetX, targetY) * (180/Math.PI);

  this.updateMovement(0);

}
