/**
 * An explosion
 * @constructor
 * @param {integer} x - X-coordinate of the item
 * @param {integer} y - Y-cooridnate of the item
 * @param {string} color - RGB color of the explosion
 */
function Explosion(x, y, color) {

  this.x = x;
  this.y = y;

  this.height = 10;
  this.width = 10;

  this.size = 1;
  this.maxSize = 40;

  this.color = color.replace('rgb', 'rgba').replace(')', ', x)');

  this.isPlayerExplosion = false;

}

/**
 * Renders the item
 * @param {CanvasRenderingContext2D} context - 2D rendering context to use when rendering the item
 * @param {integer} mapCenterX - X-coordinate of the map's center
 * @param {integer} mapCenterY - Y-coordinate of the map's center
 */
Explosion.prototype.draw = function(context, mapCenterX, mapCenterY) {

  var opacity = (this.maxSize - this.size)/this.maxSize;

  if(Math.floor(opacity * 10)%2 == 0)
  {
    opacity = 0;
  }

  context.beginPath();
  context.lineWidth = 5;
  context.strokeStyle = this.color.replace('x', opacity);
  context.arc(this.x + mapCenterX, this.y + mapCenterY, this.size, 0, 2 * Math.PI);
  context.stroke();
  context.closePath();

  this.size++;

};

/**
 * Whether or not the explosion is finished
 */
Explosion.prototype.isFinished = function() {

  return (this.size > this.maxSize);

};
