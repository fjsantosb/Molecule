Molecule(320, 480, function (game, require) {

    var Player = require('Player'),
        Obstacle = require('Obstacle'),
        bird = new Player(game),
        obstacles = [],
        tap = null,
        map = game.tilemap.load('media/game.json'),
        tube = {counter: 0, create: 100},
        text_score = game.text('55px Angies'),
        score = 0;

//    game.input.enable('touch');
    game.input.enable('keyboard');

    game.physics.friction.x = 1;
    game.physics.friction.y = 0.01;

    game.physics.gravity.x = 0;
    game.physics.gravity.y = 11 / 60;

    game.tilemap.set(map);

    game.init(function () {
        tap = game.tilemap.sprite('tap');
        text_score.align = 'center';
        text_score.x = game.width / 2;
        text_score.y = 10;
        text_score.stroke.enable = true;
        text_score.stroke.color = '#444444';
        bird.init();
    });

    game.update(function () {

        text_score.title = score;
        if(bird.state === 0)
            tube.counter++;
        for(var i = obstacles.length - 1; i >= 0; i--) {
            if(obstacles[i].sprite_tube_up.position.x + obstacles[i].sprite_tube_up.frame.width === bird.sprite.position.x - bird.sprite.anchor.x + 1 && bird.state === 0)
                score++;
            if(obstacles[i].kill) {
                obstacles[i].sprite_tube_up.kill = true;
                obstacles[i].sprite_tube_down.kill = true;
                obstacles.splice(i, 1);
            }
        }
        if(tube.counter >= tube.create) {
            console.log('drawing tube', game.timer.fps);
            obstacles.push(new Obstacle(game));
            obstacles[obstacles.length - 1].init(Math.random() * 300);
            tube.counter = 0;
        }
        bird.update();
        for(var i = 0; i < obstacles.length; i++) {
            obstacles[i].update();
        }

    });

    window.timer = game.timer;

});
