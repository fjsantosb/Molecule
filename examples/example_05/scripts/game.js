Molecule({
    width: 320,
    height: 320
})
.sprite('flappy', 'assets/flappy.png', 34, 24)
.init(function (game) {

    var sprite = game.sprite('flappy');
    sprite.id = 'flappy';

    // Change sprite position
    sprite.position.x = game.width / 2;
    sprite.position.y = game.width / 2;

    // Add animation with parameters: animation name,
    // animation frames, speed
    sprite.animation.add('fly', [0, 1, 0, 2], 0.5);

    // Run animation with parameters: animation name,
    // loop, reverse
    sprite.animation.run('fly');

    // Change sprite max speed (pixels per frame)
    sprite.speed.max.x = 1;
    sprite.speed.max.y = 0;

})
.update(function (game) {

    var sprite = game.get('flappy');

    // Set acceleration (pixels per frame)
    sprite.acceleration.x = 1;
    sprite.acceleration.y = 0;

});
