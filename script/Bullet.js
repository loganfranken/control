/**
 * A bullet
 * @constructor
 * @param {integer} x       - X-coordinate of the bullet
 * @param {integer} y       - Y-cooridnate of the bullet
 */
function Bullet(x, y, rotationDegree) {

  this.x = x;
  this.y = y;
  this.rotationDegree = rotationDegree;
  this.range = 200;

}

/**
 * Renders the bullet
 * @param {CanvasRenderingContext2D}  context - 2D rendering context to use when rendering the bullet
 */
Bullet.prototype.draw = function(context) {

  context.beginPath();
  context.arc(this.x, this.y, 1, 0, 2 * Math.PI);
  context.fillStyle = 'rgb(255, 255, 255)';
  context.fill();

};

Bullet.prototype.update = function() {

  this.y -= Math.cos(this.rotationDegree * Math.PI / 180);
  this.x += Math.sin(this.rotationDegree * Math.PI / 180);
  this.range--;

};
