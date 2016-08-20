/**
 * A ship
 * @constructor
 * @param {integer} x       - X-coordinate of the ship
 * @param {integer} y       - Y-cooridnate of the ship
 */
function Ship(x, y) {

  this.x = x;
  this.y = y;

}

/**
 * Renders the ship
 * @param {CanvasRenderingContext2D}  context - 2D rendering context to use when rendering the block
 */
Ship.prototype.draw = function(context) {

  context.beginPath();
  context.fillStyle = 'rgb(255, 255, 255)';
  context.moveTo(this.x, this.y);
  context.lineTo(this.x - 10, this.y + 10);
  context.lineTo(this.x + 10, this.y + 10);
  context.fill();

};
