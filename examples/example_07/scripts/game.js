Molecule({
    width: 320,
    height: 320,
    globals: {
        sprite: null
    }
})
.sprite('flappy', 'assets/flappy.png', 34, 24)
.init(function (game) {

    // Create sprite and add to game
    this.sprite = game.sprite.add('flappy');
    
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

    // Add animation
    this.sprite.animation.add('fly', {
        frames: [0, 1, 0, 2],
        speed: 0.5
    });

    // Run animation
    this.sprite.animation.run('fly');

})
.update(function (game) {

    if(this.sprite.position.y - this.sprite.anchor.y < 70) {
        game.physics.gravity.y = 9.78 / 60;
    } else if(this.sprite.position.y + this.sprite.anchor.y > game.width - 70) {
        game.physics.gravity.y = -9.78 / 60;
    }

});