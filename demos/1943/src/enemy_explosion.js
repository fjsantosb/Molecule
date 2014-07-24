Molecule.module('EnemyExplosion', function (game) {
    return game.molecule.define({
        sprite: game.sprite.create('enemy_explosion'),
        init: function () {
            this.sprite.position.x = this.x;
            this.sprite.position.y = this.y;
            
            this.sprite.anchor.x = this.sprite.width / 2;
            this.sprite.anchor.y = this.sprite.height / 2;
            
            this.sprite.collides.sprite = false;
            
            this.sprite.collides.boundaries = false;
            
            this.sprite.collides.group = 0;
            
            this.sprite.scrollable = false;
            
            this.sprite.animation.add('idle', {
                frames: [0, 1, 2, 3, 4, 5, 6, 7],
                speed: 0.5
            });
            
            this.sprite.animation.run('idle', {
                loop: false,
                reverse: false
            });
        },
        update: function () {
            if (this.sprite.animation.end) {
                game.remove(this);
            }
        }
    });
});