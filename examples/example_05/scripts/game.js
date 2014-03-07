Molecule({
    width: 320,
    height: 320,
    globals: {
        sprite: null
    }
})
.sprite('flappy', 'assets/flappy.png', 34, 24)
.init(function (game) {

    this.sprite = game.sprite('flappy');

    // Change sprite position
    this.sprite.position.x = game.width / 2;
    this.sprite.position.y = game.width / 2;

    // Change sprite anchor
    this.sprite.anchor.x = this.sprite.width / 2;
    this.sprite.anchor.y = this.sprite.height / 2;

    // Add animation with parameters: animation name,
    // animation frames, speed
    this.sprite.animation.add('fly', [0, 1, 0, 2], 0.5);

    // Stop current animation
    this.sprite.animation.stop();

    // Run animation with parameters: animation name,
    // loop, reverse
    this.sprite.animation.run('fly', true, false);

    // Change sprite max speed (pixels per frame)
    this.sprite.speed.max.x = 1;
    this.sprite.speed.max.y = 0;

    // Add sprite to the game
    game.add(this.sprite);

})
.update(function (game) {

    // Set acceleration (pixels per frame)
    this.sprite.acceleration.x = 1;
    this.sprite.acceleration.y = 0;
});