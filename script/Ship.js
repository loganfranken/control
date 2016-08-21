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

  this.speed = 2;
  this.rotationSpeed = 1;

  this.acceleration = 0.01;

  this.height = 30;
  this.width = 20;
  this.halfWidth = (this.width/2);

  this.color = 'rgb(255, 255, 255)';

  // Initialize the ship
  this.updateRotation(0);

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

  this.y += this.currentDriftY;
  this.x += this.currentDriftX;

};

/**
 * Moves the ship forward
 */
Ship.prototype.moveForward = function() {

  // Move the ship forward
  this.y -= this.currentVelocityY;
  this.x += this.currentVelocityX;

  // Apply drift
  this.currentDriftY -= (this.currentVelocityY * this.acceleration);
  this.currentDriftX += (this.currentVelocityX * this.acceleration);

  // Normalize drift
  if(this.currentDriftY > this.speed)
  {
    this.currentDriftY = this.speed;
  }

  if(this.currentDriftX > this.speed)
  {
    this.currentDriftX = this.speed;
  }

};

/**
 * Moves the ship backward
 */
Ship.prototype.moveBackward = function() {

  // Move the ship backward
  this.y += this.currentVelocityY;
  this.x -= this.currentVelocityX;

  // Apply drift
  this.currentDriftY += (this.currentVelocityY * this.acceleration);
  this.currentDriftX -= (this.currentVelocityX * this.acceleration);

  // Normalize drift
  if(this.currentDriftY > this.speed)
  {
    this.currentDriftY = this.speed;
  }

  if(this.currentDriftX > this.speed)
  {
    this.currentDriftX = this.speed;
  }

};

/**
 * Rotates the ship clockwise
 */
Ship.prototype.rotateClockwise = function() {
  this.updateRotation(1);
};

/**
 * Moves the ship counterclockwise
 */
Ship.prototype.rotateCounterClockwise = function() {
  this.updateRotation(-1);
};

/**
 * Updates the ship's rotation
 * @param {integer} direction - Direction of the rotation (0 = no rotation, 1 = clockwise, -1 = counterclockwise)
 */
Ship.prototype.updateRotation = function(direction) {

  this.rotationDegree += (direction * this.rotationSpeed);

  this.currentRadians = Utility.toRadians(this.rotationDegree);
  this.currentVelocityY = this.speed * Math.cos(this.currentRadians);
  this.currentVelocityX = this.speed * Math.sin(this.currentRadians);

};

/**
 * Determines whether or not the ship contains the given point
 * @param {integer} x - X-coordinate to test
 * @param {integer} y - Y-coordinate to test
 */
Ship.prototype.contains = function(x, y) {
  return (x > this.x - this.width) && (x < this.x + this.width) && (y > this.y - this.height) && (y < this.y + this.height);
};
