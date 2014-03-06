Molecule({
    width: 320,
    height: 320
})
.sound('castle', 'assets/castle.mp3')
.init(function (game) {

    var sound = game.sound('castle');

    // Pause sound
    sound.pause();

    // Stop sound
    sound.stop();

    // Play sound with parameter: loop
    sound.play(false);

});
