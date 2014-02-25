Molecule.module('assets', function (game) {

    return {
    
        tilemap: {
        
            // Load map with parameter: path
            game: game.tilemap.load('assets/game.json')
            
        }
        
    }
    
});