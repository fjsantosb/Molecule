Molecule(320, 320, function (game, require) {

    game.assets = require('assets');
    
    // Create sprite
    var sprite = game.assets.sprites.flappy;
    
    game.init(function () {
    
        // Change sprite position
        sprite.position.x = game.width / 2;
        sprite.position.y = game.width / 2;
        
        // Change sprite anchor
        sprite.anchor.x = sprite.width / 2;
        sprite.anchor.y = sprite.height / 2;
        
        // Add animation with parameters: animation name, animation frames, speed
        sprite.animation.add('fly', [0, 1, 0, 2], 0.5);
        
        // Run animation with parameters: animation name, loop, reverse 
        sprite.animation.run('fly');
        
        // Change max speed sprite (pixels per frame)
        sprite.speed.max.x = 1;
        sprite.speed.max.y = 0;
        
    });
    
    game.update(function () {
    
        // Set acceleration (pixels per frame)
        sprite.acceleration.x = 1;
        sprite.acceleration.y = 0;

    });

});