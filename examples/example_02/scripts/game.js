Molecule({
    width: 320,
    height: 320
})
.sprite('flappy', 'assets/flappy.png', 34, 24)
.ready(function (game) {

    // Create sprite and add directly to game
    var sprite = game.sprite.add('flappy');

    // Change sprite position
    sprite.position.x = game.width / 2;
    sprite.position.y = game.height / 2;
    
    // Change sprite anchor
    sprite.anchor.x = sprite.width / 2;
    sprite.anchor.y = sprite.height / 2;

    // Add animation
    sprite.animation.add('fly', {
        
        // Set an order of frames to play. This animation
        // plays the first frame, then the second, then
        // back to first and finally the last frame
        frames: [0, 1, 0, 2],
        
        // How many seconds the animation
        // should take to run all through
        speed: 0.5
    });

    // Stop current animation
    sprite.animation.stop();

    // Run animation
    sprite.animation.run('fly', {
        
        // Loop animation, true
        // by default
        loop:true,
        
        // Reverse the animation,
        // false by default
        reverse: false
    });

});