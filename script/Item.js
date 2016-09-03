/**
 * An item
 * @constructor
 * @param {integer} x - X-coordinate of the item
 * @param {integer} y - Y-cooridnate of the item
 */
function Item(x, y) {

  this.x = x;
  this.y = y;

  this.height = 10;
  this.width = 10;

  this.halfWidth = (this.width/2);
  this.halfHeight = (this.height/2);

}

/**
 * Renders the item
 * @param {CanvasRenderingContext2D} context - 2D rendering context to use when rendering the item
 * @param {integer} mapCenterX - X-coordinate of the map's center
 * @param {integer} mapCenterY - Y-coordinate of the map's center
 */
Item.prototype.draw = function(context, mapCenterX, mapCenterY) {

  context.fillStyle = 'rgb(255, 255, 255)';
  context.fillRect(
    this.x - this.halfWidth + mapCenterX,
    this.y - this.halfHeight + mapCenterY,
    this.width,
    this.height);

};

/**
 * Updates the item's status
 */
Item.prototype.update = function() {};
