/**
 * A ship
 * @constructor
 * @param {object} props - Various properties used in constructing the ship
 */
function Ship(props) {

  // ID
  this.id = Utility.getRandom(0, 99999999);

  // Coordinates
  this.x = props.x;
  this.y = props.y;

  // Rotation
  this.rotationDegree = props.rotationDegree;
  this.currentRadians = 0;

  // Velocity
  this.currentVelocityY = 0;
  this.currentVelocityX = 0;

  // Speed
  this.speed = props.speed;
  this.rotationSpeed = props.rotationSpeed;
  this.velocityDiff = { x: 0, y: 0 };

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

  // Glitch Color
  this.glitchColor = this.bodyColor.replace('rgb', 'rgba').replace(')', ', x)');

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

  // Pushing
  this.pushSpeed = 0;

  // Glitching
  this.isGlitching = false;
  this.glitchRange = 75;
  this.animGlitchCounter = 0;
  this.animMaxGlitchCouner = 10;

  // Bullets
  this.bulletDelay = props.bulletDelay;
  this.bulletSpeed = props.bulletSpeed;
  this.bulletRange = props.bulletRange;
  this.bulletColor = props.bulletColor;
  this.bulletRadius = props.bulletRadius;
  this.bulletDamage = props.bulletDamage;
  this.currentBulletDelay = 0;
  this.lastAttackerId = 0;

  // Health
  this.isTutorialShip = props.isTutorialShip;
  this.maxHealth = props.health;
  this.health = props.health;

  // Weak
  this.isWeak = false;
  this.animMaxWeakCounter = 20;
  this.animWeakCounter = 0;

  // Hit
  this.animMaxHitCounter = 5;
  this.animHitCounter = 0;

  // Enemy Behavior
  this.target = null;
  this.aggressiveness = props.aggressiveness;

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

  // Draw the glitch range
  if(this.isGlitching)
  {
    var opacity = (this.animGlitchCounter/this.animMaxGlitchCouner)/8;
    var currGlitchColor = this.glitchColor.replace('x', opacity);

    context.fillStyle = currGlitchColor;
    context.beginPath();
    context.arc(0, 0, this.glitchRange, 0, 2 * Math.PI);
    context.fill();

    context.lineWidth = 3;
    context.strokeStyle = currGlitchColor;
    context.stroke();
    context.closePath();

    this.animGlitchCounter++;

    if(this.animGlitchCounter > this.animMaxGlitchCouner)
    {
      this.animGlitchCounter = this.animMaxGlitchCouner;
    }
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

  context.closePath();
  context.restore();

  // Draw the health bar
  context.save();
  context.translate(this.x + mapCenterX, this.y + mapCenterY);

  context.lineWidth = 1;
  context.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  context.strokeRect(-20, this.halfHeight + 10, 40, 5);

  context.fillStyle = 'rgba(255, 255, 255, 0.6)';
  context.fillRect(-20, this.halfHeight + 10, 40 * ((this.health > 0 ? this.health: 0)/this.maxHealth), 5);

  context.restore();

  // Update animation counters
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

  // Update weak status
  this.isWeak = (this.health/this.maxHealth <= 0.5);

  var isBeingPushed = (this.pushSpeed > 0);
  var targetSpeed = isBeingPushed ? this.pushSpeed : this.speed;

  this.currentRadians = Utility.toRadians(this.rotationDegree);
  this.currentVelocityY = targetSpeed * Math.cos(this.currentRadians);
  this.currentVelocityX = targetSpeed * Math.sin(this.currentRadians);

  // Move forward
  if(this.isMovingForward && !isBeingPushed)
  {
    // Move the ship forward
    this.y -= this.currentVelocityY;
    this.x += this.currentVelocityX;
  }

  // Move backward
  if(this.isMovingBackward || isBeingPushed)
  {
    // Move the ship backward
    this.y += this.currentVelocityY;
    this.x -= this.currentVelocityX;
  }

  // Update push acceleration
  if(isBeingPushed)
  {
    this.pushSpeed -= 0.1;
  }

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
 * Pushes the ship backward
 */
Ship.prototype.pushBackward = function(speed) {
  this.pushSpeed = speed;
};

/**
 * Stop the ship's movement
 */
Ship.prototype.stop = function() {
  this.isMoving = false;
  this.isMovingForward = false;
  this.isMovingBackward = false;
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
 * Whether or not the ship intersects a given bounding circle
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
 * Rotates the ship to either look towards the given coordinates
 * @param {integer} x - X-coordinate to look at
 * @param {integer} y - Y-coordinate to look at
 */
Ship.prototype.lookTowards = function(x, y) {

  var targetX = this.x - x;
  var targetY = this.y - y;

  var targetRotationDegree = -Math.atan2(targetX, targetY) * (180/Math.PI);

  if(Utility.within(this.rotationDegree, targetRotationDegree, 2))
  {
    return;
  }

  if(this.rotationDegree > targetRotationDegree)
  {
    this.rotationDegree -= this.rotationSpeed;
  }
  else
  {
    this.rotationDegree += this.rotationSpeed;
  }

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
  this.animGlitchCounter = 0;
}

/**
 * Whether or not the ship can be glitched
 */
Ship.prototype.canBeGlitched = function() {
  return this.isWeak;
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
    damage: this.bulletDamage,
    sourceId: this.id
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
 * Whether or not the ship's glitch range intersects a given bounding circle
 * @param {object} boundingCircle - Bounding circle to test intersection
 */
Ship.prototype.isInGlitchRange = function(boundingCircle)
{
  return Utility.doCirclesIntersect(boundingCircle, this.getGlitchRangeBoundingCircle());
};

/**
 * Returns an object describing the ship's glitch range bounding circle
 */
Ship.prototype.getGlitchRangeBoundingCircle = function() {

  return {
    x: this.x,
    y: this.y,
    radius: this.glitchRange
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
  return !this.isTutorialShip && this.health < 0;
}
