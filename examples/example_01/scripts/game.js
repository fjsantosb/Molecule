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
        sprite.anchor.x = sprite.width / 2;
        sprite.anchor.y = sprite.height / 2;
        
        // Hide sprite
        sprite.visible = true;
        
        // Flip sprite
        sprite.flip.x = false;
        sprite.flip.y = false;
        
        // Get sprite width and height
        var width = sprite.width;
        var height = sprite.height;
        
    });
    
    game.update(function () {
    
    });

});