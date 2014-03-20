Molecule({
    width: 320,
    height: 320
})

// Load sprite setting its name and the path
.sprite('flappy', 'assets/flappy.png')
.ready(function (game) {

    var sprite = game.sprite.create('flappy');

    // Change sprite position
    sprite.position.x = game.width / 2;
    sprite.position.y = game.height / 2;

    // Change sprite alpha
    sprite.alpha = 0.75;

    // Change sprite rotation (degrees)
    sprite.rotation = 0;

    // Change sprite anchor
    sprite.anchor.x = sprite.width / 2;
    sprite.anchor.y = sprite.height / 2;

    // Hide sprite or not
    sprite.visible = true;

    // Flip sprite
    sprite.flip.x = false;
    sprite.flip.y = false;

    // Get full sprite dimensions
    var width = sprite.width;
    var height = sprite.height;

    // Add sprite to the game
    game.add(sprite);

});