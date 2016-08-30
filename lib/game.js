/* Game (lib/game.js)
Holds collections of the asteroids, bullets, and ship.
#step method calls #move on all the objects, and #checkCollisions checks for colliding objects.
#draw(ctx) draws the game.
Keeps track of dimensions of the space; wraps objects around when they drift off the screen.
*/

(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }


  var NUM_ASTEROIDS = 6;

  var Game = Asteroids.Game = function (dims, gameView) {
    this.dims = dims;
    this.DIM_X = dims.DIM_X;
    this.DIM_Y = dims.DIM_Y;
    this.ship = new Asteroids.Ship ({pos: [this.DIM_X / 2, this.DIM_Y / 2], game: this});
    this.bullets = [];
    this.level = 1;
    this.lives = 3;
    this.gameOver = false;
    this.score = 200;
    this.paused = true;
    this.numAsteroids = 6;
    this.asteroids = [];
    this.smallRadius = 25;
    this.bigRadius = 50;
    this.gameView = gameView;
    this.bindKeyHandlers();
    this.startAnimate = false;
    this.newGame = true;


    this.addAsteroids(this.numAsteroids, this.bigRadius);
    this.addSmallAsteroids(this.asteroids[0]);
  };

  Game.prototype.unpause = function () {
    var gameView = this.gameView;
    this.paused = false;
    if (!$(".game-over").hasClass("is-active")) {
      if (!gameView.muted) {
        Asteroids.Sound.empire.unmute();
      }
      requestAnimationFrame(gameView.animate.bind(gameView));
      $(".paused").removeClass("is-active");
    }
  };

  Game.prototype.playSound = function () {
    Asteroids.Sound.empire.play();
    this.soundInterval = setInterval(function(){
      if (!this.gameView.muted && !this.gameOver) {
        Asteroids.Sound.empire.play();
      }
    }.bind(this), 40000);
  };

  Game.prototype.playClickSound = function () {
    if (!this.gameView.muted && !this.gameOver) {
      Asteroids.Sound.lightsaber.play();
    }
  };

  Game.prototype.stopSound = function () {
    Asteroids.Sound.empire.stop();
    Asteroids.Sound.vader.stop();
    Asteroids.Sound.theme.stop();
    Asteroids.Sound.failed.stop();
    Asteroids.Sound.fire.stop();
    Asteroids.Sound.lightsaber.stop();
    Asteroids.Sound.explode.stop();
    clearInterval(this.soundInterval);
  };

  Game.prototype.cantAfford = function () {
    if (!this.gameView.muted && !this.gameOver) {
      Asteroids.Sound.empty.play();
    }
  };

  Game.prototype.pause = function () {
    if (this.newGame) {
      this.newGame = false;
    }
    Asteroids.Sound.empire.mute();
    $(".paused").addClass("is-active");
    $(".balance").remove();
    $(".upgrades").append("<h4 class='balance'>current balance: " + this.score + "</h4>");

  };

  Game.prototype.bindKeyHandlers = function () {
    var ship = this.ship,
        game = this,
        gameView = this.gameView,
        ctx = this.gameView.ctx;

    $(function() {
      $(".shields").click(function() {
        if (game.score >= 100){
          game.ship.setInvulnerable();
          game.score -= 100;
          game.unpause();
          game.playClickSound();
        } else {
          game.cantAfford();
        }
      });

      $(".add-life").click(function() {
        if (game.score >= 500){
          game.lives += 1;
          game.score -= 500;
          game.unpause();
          game.playClickSound();
        } else {
          game.cantAfford();
        }
      });

      $( ".reload" ).click(function() {
        if (game.score >= 200) {
          game.ship.fireSpeed -= 100;
          if (game.ship.fireSpeed < 0) {
            game.ship.fireSpeed = 0;
          }
          game.score -= 200;
          game.unpause();
          game.playClickSound();
        } else {
          game.cantAfford();
        }
      });

      $(".speed").click(function() {
        if ( game.score >= 100 ){
          game.ship.speed += 0.2;
          game.score -= 100;
          game.unpause();
          game.playClickSound();
        } else {
          game.cantAfford();
        }
      });
    });

    $(document).on('keydown', this, function (e) {
      var char = String.fromCharCode(e.keyCode);

      if (char.toLowerCase() === "a" || char === "%" ) {
        ship.leftTurn = true;
      } else if ( char.toLowerCase() === "d" || char === "'" ) {
        ship.rightTurn = true;
      }

      if ( char.toLowerCase() === "w" || char === "&") {
        ship.thrust = true;
      }

      if (char.toLowerCase() === "p") {
        if (game.startAnimate) {
          game.paused = !game.paused;
          if ( game.paused ) {
            game.pause();
          } else {
            game.unpause();
          }
        }
      }

      if (char.toLowerCase() === "m") {
        Asteroids.Sound.theme.stop();
        game.gameView.muted = !game.gameView.muted;

        if (!game.gameView.muted && !game.gameOver) {
          game.playSound();
        } else {
          game.stopSound();
        }
      }

      if ( e.keyCode === 32 ) {
        if (!game.paused) {
          ship.fireBullet();
        }
      }
      if ( e.keyCode === 13 ) {
        Asteroids.Sound.theme.stop();
        game.paused = false;
        $(".new-game").removeClass("is-active");
        $(".marquee").remove();
        $(".game-over").removeClass("is-active");
        if (!game.startAnimate) {
          game.playSound();
          game.startAnimate = true;
          gameView.lastTime = 0;
          game.paused = false;
          requestAnimationFrame(gameView.animate.bind(gameView));
          ship.setInvulnerable();
          if (!gameView.muted) {
            game.playClickSound();
            game.playSound();
          }
        }
      }
    }.bind(this));

    $(document).on('keyup', this, function (e) {
      var char = String.fromCharCode(e.keyCode);

      if ( char.toLowerCase() === "a" || char === "%" ) {
        ship.leftTurn = false;
      } else if ( char.toLowerCase() === "d" || char === "'" ) {
        ship.rightTurn = false;
      }

      if ( char.toLowerCase() === "w" || char === "&" ) {
        ship.thrust = false;
      }

    }.bind(this));

    $( window ).resize(function() {
      ctx.canvas.width = window.innerWidth;
      ctx.canvas.height = window.innerHeight;
      game.DIM_X = window.innerWidth;
      game.DIM_Y = window.innerHeight;
      gameView.dims = {DIM_X: window.innerWidth, DIM_Y: window.innerHeight};
    });
  };

  Game.prototype.unbindKeyHandlers = function () {
    this.gameOver = true;
    this.stopSound();
    $(document).unbind();
    $(document).off('keyup');
    $(document).off('keydown');
    cancelAnimationFrame(this.frame);
    cancelAnimationFrame(this);
  };



  Asteroids.Game.prototype.randPosition = function () {
    var xPos = Math.random() * this.DIM_X;
    var yPos = Math.random() * this.DIM_Y;
    return [xPos, yPos];
  };

  Asteroids.Game.prototype.addAsteroids = function (num, radius) {
    for (var i = 0; i < num; i++) {
      this.asteroids.push(new Asteroids.Asteroid({pos: this.randPosition(), game: this, radius: radius}));
    }
  };

  Asteroids.Game.prototype.addSmallAsteroids = function (bigAsteroid) {
    var vel = bigAsteroid.vel;
    var pos = bigAsteroid.pos;
    this.asteroids.push(new Asteroids.Asteroid({pos: [pos[0] + 50, pos[1] + 50], vel: [vel[0] * 2, vel[1] * -2], game: this, radius: this.smallRadius}));
    this.asteroids.push(new Asteroids.Asteroid({pos: [pos[0] - 50, pos[1] - 50], vel: [vel[0] * -2, vel[1] * -2], game: this, radius: this.smallRadius}));
  };

  Game.prototype.allObjects = function () {
    return this.asteroids.concat(this.ship, this.bullets);
  };

  Game.prototype.draw = function (ctx) {
    //this will empty the canvas
    ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);

    this.allObjects().forEach(function (object) {
      object.draw(ctx);
    });
  };

  Game.prototype.moveObjects = function (delta) {
    this.allObjects().forEach(function (object) {
      object.move(delta);
    });

  };


  Game.prototype.wrap = function (pos) {
    var origX = pos[0];
    var origY = pos[1];

    while (origX > this.DIM_X) { origX -= this.DIM_X; }
    while (origX < 0) { origX += this.DIM_X; }
    while (origY > this.DIM_Y) { origY -= this.DIM_Y; }
    while (origY < 0) { origY += this.DIM_Y; }


    return [origX, origY];
  };

  Game.prototype.checkCollisions = function () {

    for (var i = 0; i < this.allObjects().length - 1; i++) {
      for (var j = i + 1; j < this.allObjects().length; j++) {
        var firstObject = this.allObjects()[i];
        var secondObject = this.allObjects()[j];
        if (firstObject.isCollidedWith(secondObject)) {
          firstObject.collideWith(secondObject);
        }
      }
    }
  };

  Game.prototype.isOutOfBounds = function (pos) {
    return (pos[0] < 0) || (pos[1] < 0) ||
      (pos[0] > this.DIM_X) || (pos[1] > this.DIM_Y);
  };

  Game.prototype.add = function (object) {

    if (object instanceof Asteroids.Asteroid) {
      this.asteroids.push(object);
    } else if (object instanceof Asteroids.Bullet) {
      this.bullets.push(object);
    } else if (object instanceof Asteroids.Ship) {
      this.ships.push(object);
    }


  };

  Game.prototype.step = function () {
    this.moveObjects();
    this.checkCollisions();
  };

  Game.prototype.removeLife = function(){

    if ( this.lives !== 0 ) {
      this.lives -= 1;
      this.ship.relocate();
    } else {
      Asteroids.Sound.empire.stop();
      this.gameOver = true;
    }
  };

  Game.prototype.remove = function (object, otherObject) {
    var i;
    if (object.asteroid) {
      i = this.asteroids.indexOf(object);
      if (i !== -1) {
        if (!this.gameView.muted) {
          Asteroids.Sound.explode.play();
        }
        this.asteroids.splice(i, 1);
        if (!otherObject) {
          this.score += 10;
        }
        if ( object.radius === 50 ) {
          this.addSmallAsteroids(object);
        }
        if ( this.asteroids.length === 0 ) {
          this.nextLevel();
        }
      }
    }
    if (object.bullet) {
      i = this.bullets.indexOf(object);
      if (i !== -1) {
        this.bullets.splice(i, 1);
      }
    }

    if (object === this.ship) {
      if (!object.invulnerable) {
        this.removeLife();
      }
    }
  };

  Game.prototype.nextLevel = function () {
    this.numAsteroids = Math.floor(this.numAsteroids * 1.5);
    this.addAsteroids(this.numAsteroids, this.bigRadius);
    this.score += (10 * this.level);
    this.level += 1;
    this.lives += 1;
    this.ship.setInvulnerable();
    if (!this.gameView.muted) {
      Asteroids.Sound.vader.play();
    }
  };

  Game.prototype.draw = function (ctx) {
    ctx.save();
      ctx.clearRect(0,0, ctx.canvas.width,ctx.canvas.height);
      this.allObjects().forEach(function(obj){
        obj.draw(ctx);
      });
      ctx.fillStyle = "#fff";
      ctx.font="20px starjedi";
      ctx.fillText(
        "level: " + this.level,
        (ctx.canvas.width / 2) - 50,
        20
      );
      if (this.newGame) {
        ctx.fillText(
          "press p to upgrade",
          (ctx.canvas.width / 2) - 130,
          50
        );
      }
      ctx.fillText(
        "death stars remaining: " + this.asteroids.length,
        30,
        20
      );
      ctx.fillText(
        "score: " + this.score,
        ctx.canvas.width - 150,
        20
      );
      ctx.fillText(
        "lives:  " + this.lives,
        ctx.canvas.width - 150,
        50
      );
    ctx.restore();
  };


})();
