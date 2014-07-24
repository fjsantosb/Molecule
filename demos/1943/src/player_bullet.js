Molecule.module('PlayerBullet', function (game) {
    return game.molecule.define({
        sprite: game.sprite.create('plane_bullet'),
        init: function () {
            this.sprite.position.x = this.x;
            this.sprite.position.y = this.y - this.sprite.height;
            
            this.sprite.anchor.x = this.sprite.width / 2;
            this.sprite.anchor.y = this.sprite.height / 2;
            
            this.sprite.speed.max.x = 0;
            this.sprite.speed.max.y = 10;
            
            this.sprite.collides.sprite = false;
            
            this.sprite.collides.boundaries = false;
            
            this.sprite.collides.group = 0;
            
            this.sprite.scrollable = false;
        },
        update: function () {
            this.sprite.acceleration.y = -8;
            if (this.sprite.position.y <= 0 - this.sprite.height / 2) {
                game.remove(this);
            }
        }
    });
});