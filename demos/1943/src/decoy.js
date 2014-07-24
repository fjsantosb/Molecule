Molecule.module('Decoy', function (game) {
    return game.molecule.define({
        sprite: game.sprite.create('decoy'),
        init: function () {
            this.sprite.position.x = game.width / 2;
            this.sprite.position.y = game.height * 5;
            
            this.sprite.anchor.x = this.sprite.width / 2;
            this.sprite.anchor.y = this.sprite.height / 2;
            
            this.sprite.speed.max.x = 0;
            this.sprite.speed.max.y = 1;
            
            this.sprite.collidable = false;
            
            this.sprite.visible = false;
        },
        update: function () {
            this.sprite.acceleration.y = -1;
        }
    });
});