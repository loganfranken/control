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
 * Determines if two values are within a certain range of eachother
 * @param {integer} firstValue  - First value to use in comparison
 * @param {integer} secondValue - Second value to use in comparison
 * @param {integer} range       - Range to use in comparison
 */
Utility.within = function(firstValue, secondValue, range)
{
  return Math.abs(firstValue - secondValue) <= range;
}
