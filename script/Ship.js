/**
 * A ship
 * @constructor
 * @param {integer} x       - X-coordinate of the ship
 * @param {integer} y       - Y-cooridnate of the ship
 */
function Ship(x, y) {

  this.x = x;
  this.y = y;

  this.rotationDegree = 0;
  this.currentRadians = 0;

  this.currentVelocityY = 0;
  this.currentVelocityX = 0;

  this.speed = 2;
  this.rotationSpeed = 1;

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

Ship.prototype.update = function() {

};

Ship.prototype.moveForward = function() {

  this.y -= this.currentVelocityY;
  this.x += this.currentVelocityX;

};

Ship.prototype.moveBackward = function() {

  this.y += this.currentVelocityY;
  this.x -= this.currentVelocityX;

};

Ship.prototype.rotateClockwise = function() {
  this.updateRotation(1);
};

Ship.prototype.rotateCounterClockwise = function() {
  this.updateRotation(-1);
};

Ship.prototype.updateRotation = function(direction) {

  this.rotationDegree += (direction * this.rotationSpeed);

  this.currentRadians = Utility.toRadians(this.rotationDegree);
  this.currentVelocityY = this.speed * Math.cos(this.currentRadians);
  this.currentVelocityX = this.speed * Math.sin(this.currentRadians);

};

Ship.prototype.contains = function(x, y) {
  return (x > this.x - 10) && (x < this.x + 10) && (y > this.y - 10) && (y < this.y + 10);
};
