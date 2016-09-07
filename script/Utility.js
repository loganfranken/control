var Utility = {};

/**
 * Converts degrees to radians
 * @param {integer} degree - Degrees
 */
Utility.toRadians = function(degree)
{
  return degree * Math.PI / 180
}

/**
 * Returns a random point
 * @param {integer} x       - X-coordinate on which to base the random point
 * @param {integer} y       - Y-coordinate on which to base the random point
 * @param {integer} buffer  - Buffer used in generating a random point
 */
Utility.getRandomPoint = function(x, y, buffer)
{
  return {
    x: Utility.getRandomInt(x - buffer, x + buffer),
    y: Utility.getRandomInt(y - buffer, y + buffer)
  };
}

/**
 * Returns a random integer between the maximum (inclusive) and minimum (inclusive)
 * Credit: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * @param {integer} min - Minimum (inclusive) range of the random integer
 * @param {integer} max - Maximum (inclusive) range of the random integer
 */
Utility.getRandomInt = function(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random RGB color
 */
Utility.getRandomColor = function()
{
  var red = Utility.getRandomInt(0, 255);
  var blue = Utility.getRandomInt(0, 255);
  var green = Utility.getRandomInt(0, 255);

  return 'rgb(' + red + ', ' + blue + ',' + green + ')';
}

/**
 * Returns a random boolean
 */
Utility.getRandomBoolean = function()
{
  return !!Utility.getRandomInt(0, 1);
}

/**
 * Returns a random number between the maximum (inclusive) and minimum (inclusive)
 * Credit: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * @param {number} min - Minimum (inclusive) range of the random integer
 * @param {number} max - Maximum (inclusive) range of the random integer
 */
Utility.getRandom = function(min, max)
{
  return Math.random() * (max - min) + min;
}

/**
 * Determines if two values are within a certain range of eachother
 * @param {integer} firstValue  - First value to use in comparison
 * @param {integer} secondValue - Second value to use in comparison
 * @param {integer} range       - Range to use in comparison
 */
Utility.within = function(firstValue, secondValue, range)
{
  return Math.abs(firstValue - secondValue) <= range;
}

/**
 * Condenses an array, removing all null values
 * @param {object[]} items - Array, containing any data type
 */
Utility.condense = function(items)
{
  var newItems = [];

  var itemsLength = items.length;
  for(var i=0; i<itemsLength; i++)
  {
    var item = items[i];

    if(item === null)
    {
      continue;
    }

    newItems.push(item);
  }

  return newItems;
}

/**
 * Determines if two circles intersect
 * @param {object} circleA - First circle to test
 * @param {object} circleB - First circle to test
 */
Utility.doCirclesIntersect = function(circleA, circleB) {

  var radiiSum = Math.pow(circleA.radius + circleB.radius, 2);
  var centerDiff = Math.pow(circleA.x - circleB.x, 2) + Math.pow(circleA.y - circleB.y, 2);

  return (centerDiff <= radiiSum);

};
