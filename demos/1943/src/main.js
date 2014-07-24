Molecule({
    width: 448,
    height: 512
})
.spritesheet('assets/spritesheets/spritesheet_a.json', {
    'decoy' : ['decoy.png'],
    'plane_1up' : ['plane_1up_idle_1.png', 'plane_1up_idle_2.png', 'plane_1up_left_1_1.png', 'plane_1up_left_1_2.png', 'plane_1up_left_2_1.png', 'plane_1up_left_2_2.png', 'plane_1up_right_1_1.png', 'plane_1up_right_1_2.png', 'plane_1up_right_2_1.png', 'plane_1up_right_2_2.png'],
    'plane_2up' : ['plane_1up_idle_1.png', 'plane_1up_idle_2.png', 'plane_1up_left_1_1.png', 'plane_1up_left_1_2.png', 'plane_1up_left_2_1.png', 'plane_1up_left_2_2.png', 'plane_1up_right_1_1.png', 'plane_1up_right_1_2.png', 'plane_1up_right_2_1.png', 'plane_1up_right_2_2.png'],
    'plane_shadow' : ['plane_shadow_idle.png', 'plane_shadow_left_1.png', 'plane_shadow_left_2.png', 'plane_shadow_right_1.png', 'plane_shadow_right_2.png'],
    'plane_bullet' : ['plane_bullet.png'],
    'plane_green' : ['plane_green_idle_1.png', 'plane_green_idle_2.png'],
    'plane_red' : ['plane_red_idle_1.png', 'plane_red_idle_2.png'],
    'enemy_explosion' : ['enemy_explosion_1.png', 'enemy_explosion_2.png', 'enemy_explosion_3.png', 'enemy_explosion_4.png', 'enemy_explosion_5.png', 'enemy_explosion_6.png', 'enemy_explosion_7.png', 'enemy_explosion_8.png',],
    'title' : ['title.png']
})
.tilemap('stage_01', 'assets/tilemaps/stage_01.json')
.ready(function (game) {
    game.boundaries.x = 0;
    game.boundaries.y = 0;
    game.boundaries.width = game.width;
    game.boundaries.height = game.height;
    
    game.physics.friction.x = 0.10;
    game.physics.friction.y = 0.10;
    
    game.input.enable('keyboard');
    game.input.enable('gamepad');
    
    game.molecule.add('Game');
});