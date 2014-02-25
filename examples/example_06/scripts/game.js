Molecule(320, 320, function (game, require) {

    game.assets = require('assets');
    
    // Create tilemap
    var map = game.assets.tilemap.game;
    
    game.init(function () {
    
        // Set tilemap as game map
        game.tilemap.set(map);
        
    });
    
    game.update(function () {

    });

});