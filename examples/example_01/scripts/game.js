Molecule(320, 320, function (game, require) {

    game.assets = require('assets');
    
    // Create sprite
    var sprite = game.assets.sprites.flappy;
    
    game.init(function () {
    
        // Change sprite position
        sprite.position.x = game.width / 2;
        sprite.position.y = game.width / 2;
        
        // Change sprite alpha
        sprite.alpha = 0.75;
        
        // Change sprite rotation (degrees)
        sprite.rotation = 0;
        
        // Change sprite anchor
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        
        // Hide sprite
        sprite.visible = true;
        
        // Flip sprite
        sprite.flip.x = false;
        sprite.flip.y = false;
        
        // Get full sprite dimensions
        var full_width = sprite.width;
        var full_height = sprite.height;
        
        // Get frame sprite dimensions
        var frame_width = sprite.frame.width;
        var frame_height = sprite.frame.height;
        
    });
    
    game.update(function () {
    
    });

});