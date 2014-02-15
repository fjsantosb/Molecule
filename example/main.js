window.onload = function(){
  var game = new Game(480, 320);
  var sprite = game.sprite.load('logo.png');

  game.start();

  this.init = function(){
    sprite.position.x = game.canvas.width / 2 - sprite.size.width / 2;
    sprite.position.y = game.canvas.height/ 2 - sprite.size.height / 2;
  }

  this.update = function () {

  }
}

