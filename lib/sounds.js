(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

var Sound = Asteroids.Sound = {

  empire: new Howl({
    urls: ['sounds/imperial_march.wav'],
    volume: 0.5,
    buffer: true
  }),

  empty: new Howl({
    urls: ['sounds/empty.wav'],
    volume: 0.5,
    buffer: true
  }),

  theme: new Howl({
    urls: ['sounds/sw_theme.wav'],
    volume: 0.5,
    buffer: true
  }),

  failed: new Howl({
    urls: ['sounds/failed.wav'],
    volume: 0.7,
    buffer: true
  }),


  fire: new Howl({
    urls: ['sounds/fire.wav'],
    volume: 0.5,
    buffer: true
  }),

  lightsaber: new Howl({
    urls: ['sounds/light-saber.wav'],
    volume: 0.5,
    buffer: true
  }),

  explode: new Howl({
    urls: ['sounds/explode.wav'],
    volume: 0.4,
    buffer: true,
    stop: 1
  }),

  vader: new Howl({
    urls: ['sounds/theforce.wav'],
    volume: 0.6,
    buffer: true
  })

};


})();
