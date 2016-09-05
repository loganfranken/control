/**
 * A ship
 * @constructor
 * @param {object} props - Various properties used in constructing the ship
 */
function Ship(props) {

  // Coordinates
  this.x = props.x;
  this.y = props.y;

  // Rotation
  this.rotationDegree = 0;
  this.currentRadians = 0;

  // Velocity
  this.currentVelocityY = 0;
  this.currentVelocityX = 0;

  // Speed
  this.maxSpeed = 4;
  this.currentSpeed = 0;
  this.currentDriftSpeed = 0;
  this.rotationSpeed = 1;

  // Acceleration
  this.acceleration = 0.01;

  // Dimensions
  this.height = props.height;
  this.width = props.width;
  this.halfWidth = (this.width/2);
  this.halfHeight = (this.height/2);

  // Wing Dimensions
  this.wingColor = props.wingColor;
  this.wingWidth = props.wingWidth;
  this.wingHeight = props.wingHeight;

  // Body Dimensions
  this.bodyColor = props.bodyColor;
  this.bodyWidth = props.bodyWidth;
  this.bodyHeight = props.bodyHeight;
  this.halfBodyWidth = (this.bodyWidth/2);
  this.halfBodyHeight = (this.bodyHeight/2);

  // Cockpit Dimensions
  this.hasCockpit = props.hasCockpit;
  this.cockpitColor = props.cockpitColor;
  this.cockpitWidth = props.cockpitWidth;
  this.cockpitHeight = props.cockpitHeight;
  this.halfCockpitWidth = (this.cockpitWidth/2);
  this.halfCockpitHeight = (this.cockpitHeight/2);

  // Shuttle Dimensions
  this.hasShuttleDesign = props.hasShuttleDesign;
  this.shuttleDesignColor = props.shuttleDesignColor;
  this.shuttleDesignWidth = props.shuttleDesignWidth;
  this.shuttleDesignHeight = props.shuttleDesignHeight;
  this.halfShuttleDesignWidth = (this.shuttleDesignWidth/2);
  this.halfShuttleDesignHeight = (this.shuttleDesignHeight/2);

  // Movement
  this.isMoving = false;
  this.isMovingForward = false;
  this.isMovingBackward = false;

  // Glitching
  this.isGlitching = false;

  // Bullets
  this.bulletDelay = props.bulletDelay;
  this.bulletSpeed = props.bulletSpeed;
  this.bulletRange = props.bulletRange;
  this.bulletColor = props.bulletColor;
  this.bulletRadius = props.bulletRadius;
  this.bulletDamage = props.bulletDamage;
  this.currentBulletDelay = 0;

  // Health
  this.maxHealth = props.health;
  this.health = props.health;

  // Weak
  this.isWeak = false;
  this.animMaxWeakCounter = 20;
  this.animWeakCounter = 0;

  // Hit
  this.animMaxHitCounter = 5;
  this.animHitCounter = 0;

  // Target
  this.target = null;

}

/**
 * Renders the ship
 * @param {CanvasRenderingContext2D} context - 2D rendering context to use when rendering the ship
 * @param {integer} mapCenterX - X-coordinate of the map's center
 * @param {integer} mapCenterY - Y-coordinate of the map's center
 */
Ship.prototype.draw = function(context, mapCenterX, mapCenterY) {

  var damageColor = 'rgb(255, 255, 255)';

  context.save();

  context.translate(this.x + mapCenterX, this.y + mapCenterY);
  context.rotate(this.currentRadians);

  context.beginPath();
  context.moveTo(0, 0);

  // Draw the glitch sphere
  if(this.isGlitching)
  {
    context.fillStyle = 'rgba(255, 255, 255, 0.1)';
    context.beginPath();
    context.arc(0, 0, 75, 0, 2 * Math.PI);
    context.fill();

    context.lineWidth = 3;
    context.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    context.stroke();
  }

  var showHit =  (this.animHitCounter > 0);

  if(this.isWeak)
  {
    showHit = (this.isWeak && this.animWeakCounter > (this.animMaxWeakCounter/2));
  }

  // Draw the body
  context.fillStyle = showHit ? damageColor : this.bodyColor;
  context.fillRect(-this.halfBodyWidth, -this.halfHeight, this.bodyWidth, this.bodyHeight);

  // Draw the wings
  context.fillStyle = showHit ? damageColor : this.wingColor;
  context.fillRect(-this.halfBodyWidth - this.wingWidth, 0, this.wingWidth, this.wingHeight);
  context.fillRect(this.halfBodyWidth, 0, this.wingWidth, this.wingHeight);

  // Draw the cockpit
  if(this.hasCockpit)
  {
    context.fillStyle = showHit ? damageColor : this.cockpitColor;
    context.fillRect(-this.halfCockpitWidth, 0, this.cockpitWidth, this.cockpitHeight);
  }

  // Draw the shuttle design
  if(this.hasShuttleDesign)
  {
    context.fillStyle = showHit ? damageColor : this.shuttleDesignColor;
    context.fillRect(-this.halfShuttleDesignWidth, -this.halfHeight, this.shuttleDesignWidth, this.shuttleDesignHeight);
  }

  context.restore();

  if(this.isWeak)
  {
    this.animWeakCounter--;

    if(this.animWeakCounter <= 0)
    {
      this.animWeakCounter = this.animMaxWeakCounter;
    }
  }
  else if(showHit)
  {
    this.animHitCounter--;
  }

};

/**
 * Updates the ship's state
 */
Ship.prototype.update = function() {

  // Reduce bullet delay
  if(this.currentBulletDelay > 0)
  {
    this.currentBulletDelay--;
  }

  // If this ship has an assigned target, move it towards the target
  if(this.target)
  {
    if(Utility.within(this.x, this.target.x, 10) && Utility.within(this.y, this.target.y, 10))
    {
      this.target = null;
    }
    else
    {
      this.lookAt(this.target.x, this.target.y);
      this.moveForward();
    }
  }

  // Update ship movement
  this.currentRadians = Utility.toRadians(this.rotationDegree);
  this.currentVelocityY = this.currentSpeed * Math.cos(this.currentRadians);
  this.currentVelocityX = this.currentSpeed * Math.sin(this.currentRadians);

  // Move forward
  if(this.isMovingForward)
  {
    // Move the ship forward
    this.y -= this.currentVelocityY;
    this.x += this.currentVelocityX;
  }

  // Move backward
  if(this.isMovingBackward)
  {
    // Move the ship backward
    this.y += this.currentVelocityY;
    this.x -= this.currentVelocityX;
  }

  // Update acceleration
  if(this.isMoving)
  {
    this.currentSpeed += this.acceleration;

    if(this.currentSpeed > this.maxSpeed)
    {
      this.currentSpeed = this.maxSpeed;
    }
  }

  // Update weak status
  this.isWeak = (this.health/this.maxHealth <= 0.3);

};

/**
 * Moves the ship forward
 */
Ship.prototype.moveForward = function() {
  this.isMoving = true;
  this.isMovingForward = true;
};

/**
 * Moves the ship backward
 */
Ship.prototype.moveBackward = function() {
  this.isMoving = true;
  this.isMovingBackward = true;
};

/**
 * Stop the ship's movement
 */
Ship.prototype.stop = function() {
  this.isMoving = false;
  this.isMovingForward = false;
  this.isMovingBackward = false;
  this.currentSpeed = 0;
};

/**
 * Rotates the ship clockwise
 */
Ship.prototype.rotateClockwise = function() {
  this.rotationDegree += this.rotationSpeed;
};

/**
 * Moves the ship counterclockwise
 */
Ship.prototype.rotateCounterClockwise = function() {
  this.rotationDegree -= this.rotationSpeed;
};

/**
 * Determines whether or not the ship contains the given point
 * @param {integer} x - X-coordinate to test
 * @param {integer} y - Y-coordinate to test
 */
Ship.prototype.contains = function(x, y) {
  return (x > this.x - this.width) && (x < this.x + this.width) && (y > this.y - this.height) && (y < this.y + this.height);
};

/**
 * Whether or not the ship intersects a given polygon
 * @param {object} boundingCircle - Bounding circle to test intersection
 */
Ship.prototype.intersects = function(boundingCircle)
{
  return Utility.doCirclesIntersect(boundingCircle, this.getBoundingCircle());
};

/**
 * Whether or not the ship can shoot a bullet
 */
Ship.prototype.canShoot = function() {
  return (this.currentBulletDelay === 0);
};

/**
 * Updates the ship's status to reflect a bullet being shot
 */
Ship.prototype.shoot = function() {
  this.currentBulletDelay = this.bulletDelay;
};

/**
 * Rotates the ship to face the specified point
 * @param {integer} x - X-coordinate to look at
 * @param {integer} y - Y-coordinate to look at
 */
Ship.prototype.lookAt = function(x, y) {

  var targetX = this.x - x;
  var targetY = this.y - y;

  this.rotationDegree = -Math.atan2(targetX, targetY) * (180/Math.PI);

}

/**
 * Activate the ship's glitch mechanic
 */
Ship.prototype.startGlitching = function() {
  this.isGlitching = true;
}

/**
 * Deactivate the ship's glitch mechanic
 */
Ship.prototype.stopGlitching = function() {
  this.isGlitching = false;
}

/**
 * Get a bullet entity
 */
Ship.prototype.getBullet = function() {

  return new Bullet({
    x: this.x,
    y: this.y,
    rotationDegree: this.rotationDegree,
    speed: this.bulletSpeed,
    range: this.bulletRange,
    color: this.bulletColor,
    radius: this.bulletRadius,
    damage: this.bulletDamage
  });

}

/**
 * Returns an array of points describing the ship's bounding circle
 */
Ship.prototype.getBoundingCircle = function() {

  var size = this.width > this.height ? this.width : this.height;
  var radius = (size/2);

  return {
    x: this.x,
    y: this.y,
    radius: radius
  };

};

/**
 * Damages the ship
 * @param {number} damage - Amount of damage to detract from the ship's health
 */
Ship.prototype.damage = function(damage) {

  this.health -= damage;
  this.isHit = true;
  this.animHitCounter = this.animMaxHitCounter;

}

/**
 * Whether or not the ship has been destroyed
 */
Ship.prototype.isDestroyed = function() {
  return this.health < 0;
}
