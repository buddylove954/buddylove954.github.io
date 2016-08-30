// Utility code, vector math
(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Util = Asteroids.Util = {};

  Util.inherits = function (childClass, parentClass) {
    var Surrogate = function () {};

    Surrogate.prototype = parentClass.prototype;
    childClass.prototype = new Surrogate();
    childClass.prototype.constructor = childClass;
  };

  Util.dir = function (vec) {
    var norm = Util.norm(vec);
    return Util.scale(vec, 1 / norm);
  };

  Util.norm = function (vec) {
   return Util.dist([0, 0], vec);
 };

  Util.scale = function (vec, m) {
    return [vec[0] * m, vec[1] * m];
  };

  Util.randomVec = function (length) {
    var randX = (Math.random() * 2) - 1;
    var randY = (Math.random() * 2) - 1;

    return [(randX * length), (randY * length)];
  };

  Util.dist = function (objOnePos, objTwoPos) {
    var diffX = objOnePos[0] - objTwoPos[0];
    var diffY = objOnePos[1] - objTwoPos[1];

    return Math.sqrt((diffX * diffX) + (diffY * diffY));
  };

  Util.calcVec = function(speed, angle) {
    var x,
        y;

    x = speed * Math.cos(angle/180 * Math.PI);
    y = speed * Math.sin(angle/180 * Math.PI);

   return [x,y];
  };

})();
