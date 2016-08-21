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

  this.speed = 2;
  this.rotationSpeed = 1;

}

/**
 * Renders the ship
 * @param {CanvasRenderingContext2D}  context - 2D rendering context to use when rendering the ship
 */
Ship.prototype.draw = function(context) {

  context.save();

  context.translate(this.x, this.y + 10);
  context.rotate(this.rotationDegree * Math.PI / 180);

  context.beginPath();
  context.moveTo(0, 0);
  context.fillStyle = 'rgb(255, 255, 255)';
  context.lineTo(-10, 20);
  context.lineTo(10, 20);

  context.fill();
  context.restore();

};

Ship.prototype.update = function() {

};

Ship.prototype.moveForward = function() {

  this.y -= this.speed * Math.cos(this.rotationDegree * Math.PI / 180);
  this.x += this.speed * Math.sin(this.rotationDegree * Math.PI / 180);

};

Ship.prototype.moveBackward = function() {

  this.y += this.speed * Math.cos(this.rotationDegree * Math.PI / 180);
  this.x -= this.speed * Math.sin(this.rotationDegree * Math.PI / 180);

};

Ship.prototype.rotateClockwise = function() {
  this.rotationDegree += this.rotationSpeed;
};

Ship.prototype.rotateCounterClockwise = function() {
  this.rotationDegree -= this.rotationSpeed;
};

Ship.prototype.contains = function(x, y) {
  return (x > this.x - 10) && (x < this.x + 10) && (y > this.y - 10) && (y < this.y + 10);
};
