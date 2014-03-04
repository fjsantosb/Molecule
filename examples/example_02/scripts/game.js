Molecule({
    width: 320,
    height: 320
})
.sprite('flappy', 'assets/flappy.png', 34, 24)
.init(function (game) {

    var sprite = game.sprite('flappy');

    // Change sprite position
    sprite.position.x = game.width / 2;
    sprite.position.y = game.width / 2;

    // Add animation with parameters: animation name,
    // animation frames, speed
    sprite.animation.add('fly', [0, 1, 0, 2], 0.5);

    // Stop current animation
    sprite.animation.stop();

    // Run animation with parameters: animation name,
    // loop, reverse
    sprite.animation.run('fly', true, false);

    game.add(sprite);

});