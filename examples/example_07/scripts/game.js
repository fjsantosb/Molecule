Molecule(320, 320, function (game, require) {

    game.assets = require('assets');
    
    // Create sprite
    var sprite = game.assets.sprites.flappy;
    
    // Change friction
    game.physics.friction.x = 0;
    game.physics.friction.y = 0.05;
    
    // Change gravity (pixels per frame)
    game.physics.gravity.x = 0;
    game.physics.gravity.y = 9.78 / 60;
    
    game.init(function () {
    
        // Change sprite position
        sprite.position.x = game.width / 2;
        sprite.position.y = game.width / 2;
        
        // Add animation with parameters: animation name, animation frames, speed
        sprite.animation.add('fly', [0, 1, 0, 2], 0.5);
        
        // Stop current animation
        sprite.animation.stop();
        
        // Run animation with parameters: animation name, loop, reverse 
        sprite.animation.run('fly', true, false);
        
    });
    
    game.update(function () {

        if(sprite.position.y < 50) {
            game.physics.gravity.y = 9.78 / 60;
        } else if(sprite.position.y + sprite.frame.height > game.width - 50) {
            game.physics.gravity.y = -9.78 / 60;
        }

    });

});