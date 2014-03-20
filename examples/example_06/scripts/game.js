Molecule({
    width: 320,
    height: 320
})
.tilemap('myMap', 'assets/game.json')
.ready(function (game) {

    // Activate tilemap
    game.tilemap.set('myMap');

    setTimeout(function () {

        // Remove tilemap
        game.tilemap.remove();

    }, 2000);

});