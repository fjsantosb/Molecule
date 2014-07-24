Molecule.module('PlaneRed', function (game) {
    return game.molecule.define({
        sprite: game.sprite.create('plane_red'),
        live: 2,
        init: function () {
            this.sprite.position.x = this.x;
            this.sprite.position.y = this.y;
            
            this.sprite.anchor.x = this.sprite.width / 2;
            this.sprite.anchor.y = this.sprite.height / 2;
            
            this.sprite.speed.max.x = 3;
            this.sprite.speed.max.y = 3;
            
            this.sprite.collides.boundaries = false;
            
            this.sprite.collides.group = 1;
            
            this.sprite.scrollable = false;
            
            this.sprite.animation.add('idle', {
                frames: [0, 1],
                speed: 0.1
            });
            
            this.sprite.animation.run('idle', {
                loop: true,
                reverse: false
            });
        },
        update: function () {
            var id = null;
            this.sprite.acceleration.y = 3;
            if (this.sprite.collision.sprite.id !== null) {
                var m = game.molecule.get('PlayerBullet');
                for (var i = 0; i < m.length; i++) {
                    if (m[i].sprite.collision.sprite.id === this.sprite.id) {
                        id = m[i].id;
                        game.remove(m[i]);
                        this.live--;
                        if (this.live <= 0) {
                            game.molecule.add('EnemyExplosion', {x: this.sprite.position.x, y: this.sprite.position.y});
                        }
                    }
                }
            }
            if (this.sprite.position.y > game.height + this.sprite.height / 2 || this.live <= 0) {
                if (id !== null) {
                    var p = game.molecule.get('Player', {id: id});
                    p[0].score += 10;
                }
                game.remove(this);
            }
        }
    });
});