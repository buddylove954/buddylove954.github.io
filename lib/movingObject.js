// Base class for anything that moves
(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var MovingObject = Asteroids.MovingObject = function (attrs) {
    this.pos = attrs.pos; 
    this.vel = attrs.vel;
    this.radius = attrs.radius;
    this.color = attrs.color;
    this.game = attrs.game;
  };

  MovingObject.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    ctx.arc(
      this.pos[0],
      this.pos[1],
      this.radius,
      0,
      2 * Math.PI,
      false
    );

    ctx.fill();
  };

  MovingObject.prototype.isWrappable = true;

  MovingObject.prototype.move = function (delta) {
    delta = delta || 1;

    var origX = this.pos[0];
    var origY = this.pos[1];

    var dx = this.vel[0] * delta/5;
    var dy = this.vel[1] * delta/5;

    var posX = origX + dx;
    var posY = origY + dy;

    this.pos = [posX, posY];
    if (this.game.isOutOfBounds(this.pos)) {
      if (!this.isWrappable) {
        return this.game.remove(this);
      }
    }

    this.pos = this.game.wrap(this.pos);
  };

  MovingObject.prototype.isCollidedWith = function (otherObject) {
    var distObjs = Asteroids.Util.dist(this.pos, otherObject.pos);
    return distObjs < (this.radius + otherObject.radius);
  };

  MovingObject.prototype.collideWith = function (otherObject) {
    var ship = this.game.ship,
        asteroid = Asteroids.Asteroid,
        game = this.game;

     if (this.asteroid && otherObject.bullet || this.bullet && otherObject.asteroid) {
       game.remove(this);
       game.remove(otherObject);
     }

     if (this === ship && otherObject.asteroid) {
       game.remove(ship);
       game.remove(otherObject);
     } else if (this.asteroid && otherObject === ship) {
       game.remove(this);
       game.remove(ship);
     } else if ( this.asteroid && otherObject.asteroid ) {
       game.remove(this, otherObject);
       game.remove(otherObject, this);
     }

  };

})();
