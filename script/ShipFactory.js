var ShipFactory = {};

/**
 * Generates a random ship
 * @param {integer} x - X-coordinate of the ship
 * @param {integer} y - Y-coordinate of the ship
 */
ShipFactory.generateRandomShip = function(x, y)
{
  // Generate dimensions
  var width = Utility.getRandomInt(20, 40);
  var height = Utility.getRandomInt(20, 40);

  var bodyWidthFactor = Utility.getRandomInt(3, 8);
  var wingWidthFactor = (10 - bodyWidthFactor)/2;

  var wingColor = Utility.getRandomColor();
  var wingWidth = width * (wingWidthFactor * 0.1);
  var wingHeight = height * Utility.getRandom(0.2, 0.5);

  var bodyColor = Utility.getRandomColor();
  var bodyWidth = width * (bodyWidthFactor * 0.1);
  var bodyHeight = height * Utility.getRandom(0.6, 1);

  var bulletSpeed = Utility.getRandom(2, 4);
  var bulletRange = Utility.getRandomInt(80, 140);
  var bulletColor = Utility.getRandomColor();
  var bulletRadius = Utility.getRandomInt(2, 4);
  var bulletDelay = Utility.getRandomInt(20, 50);

  var health = Utility.getRandomInt(20, 50);

  var shipProps = {

    x: x,
    y: y,

    width: width,
    height: height,

    wingColor: wingColor,
    wingWidth: wingWidth,
    wingHeight: wingHeight,

    bodyColor: bodyColor,
    bodyWidth: bodyWidth,
    bodyHeight: bodyHeight,

    bulletSpeed: bulletSpeed,
    bulletRange: bulletRange,
    bulletColor: bulletColor,
    bulletRadius: bulletRadius,
    bulletDelay: bulletDelay,
    bulletDamage: bulletRadius,

    health: health

  };

  // Cockpit
  shipProps.hasCockpit = Utility.getRandomBoolean();

  if(shipProps.hasCockpit)
  {
    shipProps.cockpitColor = Utility.getRandomColor();
    shipProps.cockpitWidth = shipProps.bodyWidth * Utility.getRandom(0.5, 1);
    shipProps.cockpitHeight = shipProps.bodyHeight * Utility.getRandom(0.1, 0.5);
  }

  // Shuttle Design
  shipProps.hasShuttleDesign = Utility.getRandomBoolean();

  if(shipProps.hasShuttleDesign)
  {
    shipProps.shuttleDesignColor = Utility.getRandomColor();
    shipProps.shuttleDesignWidth = shipProps.bodyWidth;
    shipProps.shuttleDesignHeight = shipProps.bodyHeight * Utility.getRandom(0, 0.5);
  }

  return new Ship(shipProps);
}
