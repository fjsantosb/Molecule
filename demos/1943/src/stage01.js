Molecule.module('Stage01', function (game) {
    return game.molecule.define({
        player1: null,
        player2: null,
        init: function () {
            var decoy = game.molecule.add('Decoy');
            
            if (this.players === 1) {
                this.player1 = game.molecule.add('Player', {id: 1, x: game.width / 2});
            } else if (this.players === 2) {
                this.player1 = game.molecule.add('Player', {id: 1, x: game.width / 1.2});
                this.player2 = game.molecule.add('Player', {id: 2, x: game.width / 6});
            }
            
            game.tilemap.set('stage_01');

            game.camera.follow(decoy.sprite);
        },
        update: function () {
            if ((Math.floor(Math.random() * 100)) === 0) {
                game.molecule.add('PlaneRed', {x:  (Math.floor(Math.random() * game.width)), y: 0});
            }
        }
    });
});