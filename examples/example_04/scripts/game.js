Molecule({
    width: 320,
    height: 320
})
.audio('castle', 'assets/castle.mp3')
.init(function (game) {

    var audio = game.audio('castle');

    // Pause audio
    audio.pause();

    // Stop audio
    audio.stop();

    // Play audio with parameter: loop
    audio.play(false);

});
