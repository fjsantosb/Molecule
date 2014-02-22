Molecule.test('Molecule.Game.physics', function (physics, p) {

    buster.testCase('Physics', {

        'spriteHitsPlatformBelow()': {
            'returns false if sprite does not affect gravity': function () {
                expect(p.spriteHitsPlatformBelow({affects: {physics: { gravity: false}}})).to.be(false);
            }
        }

    });

});