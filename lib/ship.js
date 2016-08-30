(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Ship = Asteroids.Ship = function (attrs) {
    this.pos = attrs.pos;
    this.vel = [0, 0];
    this.radius = 40;
    this.color = "#a1e5dd";
    this.game = attrs.game;
    this.lastFire = Date.now();
    this.angle = 0;
    this.rotateSpeed = 1;
    this.leftTurn = false;
    this.rightTurn = false;
    this.friction = 1;
    this.thrust = false;
    this.invulnerable = true;
    this.fireSpeed = 700;
    this.speed = 1.6;

    setTimeout(function(){this.invulnerable = false;}.bind(this), 3000);
  };

  Asteroids.Util.inherits(Ship, Asteroids.MovingObject);

  Ship.prototype.relocate = function () {
    this.pos = this.game.randPosition();
    this.vel = [0, 0];
    this.setInvulnerable();
  };

  Ship.prototype.setAngle = function(angleDiff){
    this.angle += (angleDiff * this.rotateSpeed);
  };

  Ship.prototype.setInvulnerable = function(){
    this.invulnerable = true;
    setTimeout(function(){this.invulnerable = false;}.bind(this), 3000);
  };


  Ship.prototype.fireBullet = function () {

    if ( Date.now() - this.lastFire < this.fireSpeed) {
      return;
    }

    var forwardPos = [
      (this.pos[0] + Math.sin(this.angle/180 * Math.PI) * 1),
      (this.pos[1] - Math.cos(this.angle/180 * Math.PI) * 1)
    ];


    var bulletOptions = {
      vel: [(this.vel[0] * 3), (this.vel[1] * 3)],
      pos: forwardPos,
      game: this.game,
      radius: this.radius,
      angle: this.angle,
      thrust: this.thrust
    };

    var vel_x = bulletOptions.vel[0],
        vel_y =  bulletOptions.vel[1];
    if ( vel_x === 0 && vel_y === 0 ) {
      bulletOptions.vel = [3.5, 3.5];
    }



    var bullet = new Asteroids.Bullet(bulletOptions);
      this.game.add(bullet);
      this.lastFire = Date.now();
      if (!this.game.gameView.muted) {
        Asteroids.Sound.fire.play();
      }
  };

  Ship.prototype.move = function(ctx){
    var vel;

    if ( this.leftTurn ) {
      this.setAngle(-2);
    } else if ( this.rightTurn ) {
      this.setAngle(2);
    }

    if ( this.thrust ) {

      this.friction = 1;
      vel = Asteroids.Util.calcVec(this.speed, this.angle);

      this.pos[0] += this.vel[0] + vel[0];
      this.pos[1] += this.vel[1] + vel[1];

      this.vel[0] = vel[0];
      this.vel[1] = vel[1];
    } else {
      this.friction *= 0.9999;

      this.vel[0] *= this.friction;
      this.vel[1] *= this.friction;

      this.pos[0] += this.vel[0];
      this.pos[1] += this.vel[1];

    }
    this.pos = this.game.wrap(this.pos);
  };

  Ship.sprite = new Image();

  Ship.prototype.draw = function(ctx){

    ctx.save();
      ctx.translate(this.pos[0], this.pos[1]);
      ctx.rotate((this.angle + 90) * Math.PI/180);

      Ship.sprite.src = './assets/falcon-newthrust.png';
      // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
      if (this.thrust) {
        ctx.drawImage(Ship.sprite, -40, -40, 80, 80);
      } else {
        ctx.drawImage(Ship.sprite, 0, 0, 195, 195, -40, -40, 70, 70);
      }

    ctx.restore();

    if (this.invulnerable){
      ctx.save();
      ctx.fillStyle = "rgba(20, 255, 20, 0.2)";
      ctx.beginPath();
      ctx.arc(
        this.pos[0],
        this.pos[1],
        this.radius + 10,
        0,
        2 * Math.PI,
        true
      );
      ctx.fill();
      ctx.restore();
    }
  };

  })();
