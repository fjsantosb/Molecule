Molecule(320, 320, function (game, require) {

    game.assets = require('assets');
    
    // Create audio
    var audio = game.assets.audio.castle;
    
    game.init(function () {
    
        // Pause audio
        audio.pause();
        
        // Stop audio
        audio.stop();
        
        // Play audio with parameter: loop
        audio.play(false);
        
    });
    
    game.update(function () {

    });

});