/**
 * A bullet
 * @constructor
 * @param {object} props - Various properties used in constructing the ship
 */
function Bullet(props) {

  this.x = props.x;
  this.y = props.y;
  this.velocityX = props.speed * Math.sin(Utility.toRadians(props.rotationDegree));
  this.velocityY = props.speed * Math.cos(Utility.toRadians(props.rotationDegree));
  this.range = props.range;
  this.color = props.color;
  this.radius = props.radius;
  this.damage = props.damage;

}

/**
 * Renders the bullet
 * @param {CanvasRenderingContext2D}  context - 2D rendering context to use when rendering the bullet
 * @param {integer}                   mapCenterX  - X-coordinate of the map's center
 * @param {integer}                   mapCenterY  - Y-coordinate of the map's center
 */
Bullet.prototype.draw = function(context, mapCenterX, mapCenterY) {

  context.beginPath();
  context.arc(this.x + mapCenterX, this.y + mapCenterY, this.radius, 0, 2 * Math.PI);
  context.fillStyle = this.color;
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

/**
 * Returns an array of points describing the bullet's bounding circle
 */
Bullet.prototype.getBoundingCircle = function() {

  return {
    x: this.x,
    y: this.y,
    radius: this.radius
  };

};
