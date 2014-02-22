Molecule(320, 480, function (game, require) {
	
	var Player = require('Player');
	var Enemy = require('Enemy');
	
	// Load Enemies
	var enemy_red = new Enemy(game, 1);
	var enemy_orange = new Enemy(game,2);
	var enemy_blue = new Enemy(game,3);
	var enemy_purple = new Enemy(game,4);
	
	// Load Player
	var player = new Player(game);
	
	// Load Map with parameters: resource
	var map = game.tilemap.load('media/maze.json');
	
	var score_text = game.text('16px Pixlpowr');
	
	// Enable Keyboard
	game.input.enable('keyboard');
	game.input.enable('touch');
	
	// Set Game's Friction on X and Y axis. Friction is measured between 0 (not friction) and 1 (full friction)
	game.physics.friction.x = 1;
	game.physics.friction.y = 1;
	
	// Set TileMap	
	game.tilemap.set(map);
	
	// Set Game Camera to Follow Sprite
	game.camera.attach(player.sprite);
	
	game.init(function () {
		score_text.color = '#ffffff';
		score_text.x = 160;
		score_text.y = 1;
		// Init Player
		player.init();
		// Init Enemies
		enemy_red.init();
		enemy_orange.init();
		enemy_blue.init();
		enemy_purple.init();
	});
	
	game.update(function () {
		// Update Player
		player.update();
		// Update Enemies
		enemy_red.update();
		enemy_orange.update();
		enemy_blue.update();
		enemy_purple.update();
		var t = '';
		for(i = 0; i < 6 - player.c.toString().length; i++) {
			t = t + '0';
		}
		score_text.title = 'SCORE ' + t + player.c;
	});
});