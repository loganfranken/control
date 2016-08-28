/**
 * A bullet
 * @constructor
 * @param {integer} x               - X-coordinate of the bullet
 * @param {integer} y               - Y-cooridnate of the bullet
 * @param {integer} rotationDegree  - Degree of rotation
 * @param {integer} speed           - Speed of the bullet
 * @param {integer} range           - How far the bullet can travel
 */
function Bullet(x, y, rotationDegree, speed, range) {

  this.x = x;
  this.y = y;
  this.velocityX = speed * Math.sin(Utility.toRadians(rotationDegree));
  this.velocityY = speed * Math.cos(Utility.toRadians(rotationDegree));
  this.range = range;

}

/**
 * Renders the bullet
 * @param {CanvasRenderingContext2D}  context - 2D rendering context to use when rendering the bullet
 * @param {integer}                   mapCenterX  - X-coordinate of the map's center
 * @param {integer}                   mapCenterY  - Y-coordinate of the map's center
 */
Bullet.prototype.draw = function(context, mapCenterX, mapCenterY) {

  context.beginPath();
  context.arc(this.x + mapCenterX, this.y + mapCenterY, 1, 0, 2 * Math.PI);
  context.fillStyle = 'rgb(255, 255, 255)';
  context.fill();

};

/**
 * Updates the bullet's status
 */
Bullet.prototype.update = function() {

  this.y -= this.velocityY;
  this.x += this.velocityX;
  this.range--;

};
