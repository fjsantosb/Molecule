Molecule.module('Player', function (require, p) {

    function Player(_game) {
        this.game = _game;
        this.sprite = null;
        this.touch = false;
        this.acceleration = {x: 2};
        this.state = 0;

        this.init = function() {
            this.sprite = this.game.tilemap.sprite('bird');
            this.sprite.position.x += this.sprite.anchor.x;
            this.sprite.position.y += this.sprite.anchor.y;
            this.sprite.overlap = true;
            this.sprite.scroll.offset.x = 64;

            this.sprite.animation.add('idle', [0], 0);
            this.sprite.animation.add('fly', [0, 1, 0, 2], 5);
            this.sprite.animation.run('fly');
            this.game.camera.attach(this.sprite);
        };

        this.update = function() {
            if(this.sprite.collision.sprite.id !== null || this.sprite.collision.map.tile !== null) {
                this.sprite.collides.sprite = false;
                this.sprite.animation.run('idle');
                this.acceleration.x = 0;
                this.state = 1;
            }
            if(this.sprite.speed.y > 0) {
                this.sprite.rotation += 2;
            }
            if((this.game.input.key.SPACE || this.game.input.touch.length > 0) && !this.touch && this.state === 0) {
                this.touch = true;
                if(this.sprite.speed.y > 0)
                    this.sprite.speed.y = 0;
                this.sprite.acceleration.y = -5;
                this.sprite.rotation = -25;
            }
            if(!this.game.input.key.SPACE && this.game.input.touch.length === 0) {
                this.touch = false;
            }

            if(this.sprite.rotation <= -25) {
                this.sprite.rotation = -25;
            }
            if(this.sprite.rotation >= 90) {
                this.sprite.rotation = 90;
            }
            this.sprite.acceleration.x = this.acceleration.x;
        };
    };

    return Player;

});