Molecule({
    width: 320,
    height: 320
})
.init(function (game) {

    // Enable keyboard
    game.input.enable('keyboard');
})
.update(function (game) {

    // Check if Key A has been pressed
    if (game.input.key.A) {
        console.log('Key A has been pressed');
    }

    // Check if Key Up Arrow has been pressed
    if (game.input.key.UP_ARROW) {
        console.log('Key Up Arrow has been pressed');
    }

    // Check if Key Space has been pressed
    if (game.input.key.SPACE) {
        console.log('Key Space has been pressed');
    }

    // Check if Key P has not been pressed
    if (!game.input.key.P) {
        console.log('Key P has not been pressed');
    } else {
        console.log('Key P has been pressed');
    }

});
