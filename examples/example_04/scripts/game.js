Molecule({
    width: 320,
    height: 320
})
.audio('castle', 'assets/castle.mp3')
.ready(function (game) {

    var myAudio = game.audio.create('castle');

    // Play audio. Passing true
    // will loop the audio
    myAudio.play();

    setTimeout(function () {

        // Pause audio
        myAudio.pause();

    }, 1000);

    setTimeout(function () {

        // Play again
        myAudio.play();

    }, 2000);

    setTimeout(function () {

        // Stop audio
        myAudio.stop();

    }, 3000);


});