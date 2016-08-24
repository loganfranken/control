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
  this.rotationSpeed = 1;
  this.drift = 0.01;
  this.acceleration = 0.01;

  this.currentSpeed = 0;

  this.height = 30;
  this.width = 20;
  this.halfWidth = (this.width/2);

  this.color = 'rgb(255, 255, 255)';

  // Initialize the ship
  this.updateMovement(0);

}

/**
 * Renders the ship
 * @param {CanvasRenderingContext2D}  context - 2D rendering context to use when rendering the ship
 */
Ship.prototype.draw = function(context) {

  context.save();

  context.fillStyle = this.color;

  context.translate(this.x, this.y);
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

  // Apply drift
  this.y += this.currentDriftY;
  this.x += this.currentDriftX;

  // Normalize speed
  if(this.currentSpeed >= this.maxSpeed)
  {
    this.currentSpeed = this.maxSpeed;
  }

  if(this.currentSpeed <= 0)
  {
    this.currentSpeed = 0;
  }

};

/**
 * Moves the ship forward
 */
Ship.prototype.moveForward = function() {

  // Move the ship forward
  this.y -= this.currentVelocityY;
  this.x += this.currentVelocityX;
  this.currentSpeed += this.acceleration;

  // Update drift
  this.currentDriftY -= (this.currentVelocityY * this.drift);
  this.currentDriftX += (this.currentVelocityX * this.drift);

  // Cap drift
  this.currentDriftY = (this.currentDriftY > this.maxSpeed) ? this.maxSpeed : this.currentDriftY;
  this.currentDriftX = (this.currentDriftX > this.maxSpeed) ? this.maxSpeed : this.currentDriftX;

  this.updateMovement(0);

};

/**
 * Moves the ship backward
 */
Ship.prototype.moveBackward = function() {

  // Move the ship backward
  this.y += this.currentVelocityY;
  this.x -= this.currentVelocityX;
  this.currentSpeed += this.acceleration;

  // Update drift
  this.currentDriftY += (this.currentVelocityY * this.drift);
  this.currentDriftX -= (this.currentVelocityX * this.drift);

  // Cap drift
  this.currentDriftY = (this.currentDriftY > this.maxSpeed) ? this.maxSpeed : this.currentDriftY;
  this.currentDriftX = (this.currentDriftX > this.maxSpeed) ? this.maxSpeed : this.currentDriftX;

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
