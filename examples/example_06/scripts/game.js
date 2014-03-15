Molecule({
    width: 320,
    height: 320
})
.tilemap('map', 'assets/game.json')
.init(function (game) {

    // Remove tilemap
    game.tilemap.remove();

    // Activate tilemap
    game.tilemap.set('map');

});
