Molecule.module('Game', function (game) {
    return game.molecule.define({
        text: {
            up1: game.text.create({
                title: '1UP',
                position: {
                    x: game.width / 8,
                    y: game.height / 100
                },
                align: 'center',
                font: '16px gameboy',
                color: '#FFF',
                baseline: 'top',
                visible: true
            }),
            score1: game.text.create({
                title: '000000',
                position: {
                    x: game.width / 8,
                    y: game.height / 20
                },
                align: 'center',
                font: '16px gameboy',
                color: '#FFF',
                baseline: 'top',
                visible: true
            }),
            up2: game.text.create({
                title: '2UP',
                position: {
                    x: game.width / 1.13,
                    y: game.height / 100
                },
                align: 'center',
                font: '16px gameboy',
                color: '#FFF',
                baseline: 'top',
                visible: true
            }),
            score2: game.text.create({
                title: '000000',
                position: {
                    x: game.width / 1.13,
                    y: game.height / 20
                },
                align: 'center',
                font: '16px gameboy',
                color: '#FFF',
                baseline: 'top',
                visible: true
            }),
            hi: game.text.create({
                title: 'HI SCORE',
                position: {
                    x: game.width / 2,
                    y: game.height / 100
                },
                align: 'center',
                font: '16px gameboy',
                color: '#FFF',
                baseline: 'top',
                visible: true
            }),
            hiscore: game.text.create({
                title: '000000',
                position: {
                    x: game.width / 2,
                    y: game.height / 20
                },
                align: 'center',
                font: '16px gameboy',
                color: '#FFF',
                baseline: 'top',
                visible: true
            })
        },
        scene: null,
        state: null,
        players: 1,
        init: function () {
            this.state = 'menu';
        },
        update: function () {
            switch (this.state) {
                case 'menu':
                    if (this.scene === null) {
                        this.scene = game.molecule.add('Menu');
                    }
                    if (game.input.key.SPACE || game.input.gamepad[0].buttons[0]) {
                        this.players = this.scene.players;
                        game.remove(this.scene);
                        this.scene = null;
                        this.state = 'stage01';
                    }
                break;
                case 'stage01':
                    if (this.scene === null) {
                        this.scene = game.molecule.add('Stage01', {players: this.players});
                    }
                    this.text.score1.title = String('000000' + this.scene.player1.score).slice(-6);
                    if (this.players === 2) {
                        this.text.score2.title = String('000000' + this.scene.player2.score).slice(-6);
                    }
                break;
            }
        }
    });
});