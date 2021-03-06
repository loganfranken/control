var ShipFactory = {};

/**
 * Generates a random ship
 * @param {integer} x - X-coordinate of the ship
 * @param {integer} y - Y-coordinate of the ship
 */
ShipFactory.generateRandomShip = function(x, y)
{
  var width = Utility.getRandomInt(20, 40);
  var height = Utility.getRandomInt(20, 40);

  var speed = Utility.getRandom(3, 6);
  var rotationSpeed = Utility.getRandomInt(2, 5);
  var rotationDegree = Utility.getRandomInt(0, 360);

  var bodyWidthFactor = Utility.getRandomInt(3, 8);
  var wingWidthFactor = (10 - bodyWidthFactor)/2;

  var wingColor = Utility.getRandomColor();
  var wingWidth = width * (wingWidthFactor * 0.1);
  var wingHeight = height * Utility.getRandom(0.2, 0.5);

  var bodyColor = Utility.getRandomColor();
  var bodyWidth = width * (bodyWidthFactor * 0.1);
  var bodyHeight = height * Utility.getRandom(0.6, 1);

  var bulletRange = Utility.getRandomInt(80, 140);
  var bulletColor = Utility.getRandomColor();
  var bulletRadius = Utility.getRandomInt(2, 4);
  var bulletDelay = Utility.getRandomInt(10, 30);
  var bulletSpeed = speed * Utility.getRandom(1, 3);

  var health = Utility.getRandomInt(20, 40);

  var aggressiveness = Utility.getRandomInt(2, 100);

  var shipProps = {

    x: x,
    y: y,

    width: width,
    height: height,

    speed: speed,
    rotationSpeed: rotationSpeed,
    rotationDegree: rotationDegree,

    wingColor: wingColor,
    wingWidth: wingWidth,
    wingHeight: wingHeight,

    bodyColor: bodyColor,
    bodyWidth: bodyWidth,
    bodyHeight: bodyHeight,

    bulletSpeed: speed * 2,
    bulletRange: bulletRange,
    bulletColor: bulletColor,
    bulletRadius: bulletRadius,
    bulletDelay: bulletDelay,
    bulletDamage: bulletRadius,

    health: health,

    isTutorialShip: false,
    aggressiveness: aggressiveness

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
