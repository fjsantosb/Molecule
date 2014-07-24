Molecule.module('Menu', function (game) {
    return game.molecule.define({
        sprites: {
            title: game.sprite.create('title'),
            plane: game.sprite.create('plane_green')
        },
        text: {
            info: game.text.create({
                title: '2014 Molecule',
                position: {
                    x: game.width / 2,
                    y: game.height / 1.05
                },
                align: 'center',
                font: '14px gameboy',
                color: '#FFF',
                baseline: 'top',
                visible: true
            }),
            player1: game.text.create({
                title: '1 PLAYER',
                position: {
                    x: game.width / 2.5,
                    y: game.height / 1.8
                },
                align: 'left',
                font: '16px gameboy',
                color: '#FFF',
                baseline: 'top',
                visible: true
            }),
            player2: game.text.create({
                title: '2 PLAYERS',
                position: {
                    x: game.width / 2.5,
                    y: game.height / 1.6
                },
                align: 'left',
                font: '16px gameboy',
                color: '#FFF',
                baseline: 'top',
                visible: true
            })
        },
        players: 1,
        init: function () {
            this.sprites.title.position.x = game.width / 2;
            this.sprites.title.position.y = game.height / 4;
            
            this.sprites.title.anchor.x = this.sprites.title.width / 2;
            this.sprites.title.anchor.y = this.sprites.title.height / 2;

            this.sprites.plane.position.x = game.width / 2.8;
            this.sprites.plane.position.y = game.height / 1.68;
            
            this.sprites.plane.rotation = 180;
            
            this.sprites.plane.animation.add('idle', {
                frames: [0],
                speed: 1
            });

            this.sprites.plane.animation.run('idle', {
                loop: true,
                reverse: false
            });

        },
        update: function () {
            if (game.input.key.UP_ARROW || game.input.gamepad[0].axes[1] < -0.25) {
                this.sprites.plane.position.x = game.width / 2.8;
                this.sprites.plane.position.y = game.height / 1.68;
                this.players = 1;
            }
            if (game.input.key.DOWN_ARROW || game.input.gamepad[0].axes[1] > 0.25) {
                this.sprites.plane.position.x = game.width / 2.8;
                this.sprites.plane.position.y = game.height / 1.50;
                this.players = 2;
            }
        }
    });
});