Molecule.module('Obstacle', function (require, p) {

    function Obstacle(_game) {
        this.game = _game;
        this.kill = false;

        this.init = function(_y) {
            this.sprite_tube_up = this.game.sprite.load('media/tube_up.png');
            this.sprite_tube_down = this.game.sprite.load('media/tube_down.png');

            this.sprite_tube_up.position.x = this.game.canvas.width;
            this.sprite_tube_up.position.y = _y + -330;
            this.sprite_tube_up.affects.physics.gravity = false;

            this.sprite_tube_down.position.x = this.game.canvas.width;
            this.sprite_tube_down.position.y = _y + 80;
            this.sprite_tube_down.affects.physics.gravity = false;
        };

        this.update = function() {
            if(this.sprite_tube_up.position.x + this.sprite_tube_up.frame.width < 0 && this.sprite_tube_down.position.x + this.sprite_tube_down.frame.width < 0) {
                this.kill = true;
            }
        };

    };

    return Obstacle;

});