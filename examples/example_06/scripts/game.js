Molecule({
    width: 320,
    height: 320
})
.tilemap('map', 'assets/game.json')
.init(function (game) {

    var tilemap = game.tilemap('map');
    
    // Add tilemap to the game
    game.add(tilemap);

});
