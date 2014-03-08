Molecule({
    width: 320,
    height: 320,
    globals: {
        sprite: null
    }
})
.sprite('flappy', 'assets/flappy.png', 34, 24)
.init(function (game) {
    // Create sprite
    this.sprite = game.sprite('flappy');

    // Change friction
    game.physics.friction.x = 0;
    game.physics.friction.y = 0.05;

    // Change gravity (pixels per frame)
    game.physics.gravity.x = 0;
    game.physics.gravity.y = 9.78 / 60;

    // Change sprite position
    this.sprite.position.x = game.width / 2;
    this.sprite.position.y = game.height / 2;

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
    
    // Add sprite to the game
    game.add(this.sprite);

})
.update(function (game) {

    if(this.sprite.position.y - this.sprite.anchor.y < 70) {
        game.physics.gravity.y = 9.78 / 60;
    } else if(this.sprite.position.y + this.sprite.anchor.y > game.width - 70) {
        game.physics.gravity.y = -9.78 / 60;
    }

});

