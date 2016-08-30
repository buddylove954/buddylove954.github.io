(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  RADIUS = 2;
  SPEED = 15;
  COLOR = "#ff3333";

  var Bullet = Asteroids.Bullet = function (bulletOptions) {
    var vel = bulletOptions.vel,
        angle = bulletOptions.angle,
        thrust = bulletOptions.thrust;

    this.bullet = true;

    var newVel = Asteroids.Util.calcVec(0.65, angle);

    this.vel = [vel[0]*8, vel[1]*8];
        // this.pos = [(pos[0] + (vel[0]*10)), (pos[1] + (vel[1]*10))];
    if ( (vel[0] === 0 && vel[1] === 0) ) {
        newVel = Asteroids.Util.calcVec(0.70, angle);
        this.vel[0] = newVel[0]*10;
        this.vel[1] = newVel[1]*10;
      }
    else if ( !thrust ) {
      newVel = Asteroids.Util.calcVec(Asteroids.Util.norm(vel), angle);
      if (Math.abs(newVel[0]) > 2.5 || Math.abs(newVel[1]) > 2.5) {
        this.vel = [(newVel[0]*3), (newVel[1]*3)];

      } else {
        newVel = Asteroids.Util.calcVec(0.70, angle);
        this.vel[0] = newVel[0]*10;
        this.vel[1] = newVel[1]*10;
      }
    }
    //
    this.radius = RADIUS;
    this.speed = SPEED;
    this.pos = bulletOptions.pos;
    this.color = COLOR;
    this.game = bulletOptions.game;

  };


  Asteroids.Util.inherits(Bullet, Asteroids.MovingObject);


Bullet.prototype.collideWith = function (otherObject) {
  if (otherObject instanceof Asteroids.Asteroid) {
    this.remove();
    otherObject.remove();
  }
};

Bullet.prototype.isWrappable = false;

})();
