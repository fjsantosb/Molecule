Molecule({
    width: 320,
    height: 320,
    globals: {
        sprite: null
    }
})
.sprite('flappy', 'assets/flappy.png', 34, 24)
.init(function (game) {

    this.sprite = game.sprite.create('flappy');

    // Change sprite position
    this.sprite.position.x = game.width / 2;
    this.sprite.position.y = game.height / 2;

    // Change sprite anchor
    this.sprite.anchor.x = this.sprite.width / 2;
    this.sprite.anchor.y = this.sprite.height / 2;

    // Add animation
    this.sprite.animation.add('fly', {
        frames: [0, 1, 0, 2],
        speed: 0.5
    });

    // Run animation
    this.sprite.animation.run('fly');

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