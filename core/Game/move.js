Molecule.module('Molecule.Game.move', function (require, p) {

   return function (sprites) {
       var r = true,
           t,
           sprite;

       for (var i = 0; i < sprites.length; i++) {
           sprite = sprites[i];
           t = true;
           sprite.speed.check.x = true;
           sprite.speed.check.y = true;
           if (sprite.speed.t.x >= 1) {
               sprite.speed.t.x -= 1;
               sprite.move.x = 1;
               t = false;
               r = false;
               sprite.speed.check.x = false;
           } else if (sprite.speed.t.x <= -1) {
               sprite.speed.t.x += 1;
               sprite.move.x = -1;
               t = false;
               r = false;
               sprite.speed.check.x = false;
           }
           if (sprite.speed.t.y >= 1) {
               sprite.speed.t.y -= 1;
               sprite.move.y = 1;
               t = false;
               r = false;
               sprite.speed.check.y = false;
           } else if (sprite.speed.t.y <= -1) {
               sprite.speed.t.y += 1;
               sprite.move.y = -1;
               t = false;
               r = false;
               sprite.speed.check.y = false;
           }
           if (t) {
               if (sprite.speed.t.x !== 0)
                   sprite.speed.t.x > 0 ? sprite.move.x = 1 : sprite.move.x = -1;
               if (sprite.speed.t.y !== 0)
                   sprite.speed.t.y > 0 ? sprite.move.y = 1 : sprite.move.y = -1;
           }
       }
       return r;

   }

});