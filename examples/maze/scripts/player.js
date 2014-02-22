Molecule.module('Player', function (require, p) {
	function Player(_game) {
		this.current = {acceleration: {x: 0, y: 0}};
		this.game = _game;
		this.sprite = this.game.sprite.load('media/player.png');
		this.c = 0;
		this.arrow_left = this.game.sprite.load('media/arrow_left.png');
		this.arrow_right = this.game.sprite.load('media/arrow_right.png');
		this.arrow_up = this.game.sprite.load('media/arrow_up.png');
		this.arrow_down = this.game.sprite.load('media/arrow_down.png');
	
		this.init = function() {
			this.sprite.anchor.x = this.sprite.frame.width / 2;
			this.sprite.anchor.y = this.sprite.frame.height / 2;
			this.sprite.position.x += 16 * 14 + this.sprite.frame.width / 2;
			this.sprite.position.y += 16 * 14 + this.sprite.frame.height / 2;
			this.sprite.speed.max.x = 1;
			this.sprite.speed.max.y = 1;
			this.sprite.scroll.offset.y = 32;
			
			this.arrow_left.position.x = 0;
			this.arrow_left.position.y = this.game.canvas.height - 80;
			this.arrow_left.scrollable = false;
			this.arrow_left.collidable = false;
			
			this.arrow_right.position.x = 80;
			this.arrow_right.position.y = this.game.canvas.height - 80;
			this.arrow_right.scrollable = false;
			this.arrow_right.collidable = false;
			
			this.arrow_up.position.x = 160;
			this.arrow_up.position.y = this.game.canvas.height - 80;
			this.arrow_up.scrollable = false;
			this.arrow_up.collidable = false;
			
			this.arrow_down.position.x = 240;
			this.arrow_down.position.y = this.game.canvas.height - 80;
			this.arrow_down.scrollable = false;
			this.arrow_down.collidable = false;
			
		};
	
		this.update = function() {
			// Check if tile exist on Layer with parameters: layer name, x, y
			var token = this.game.tilemap.tile.get('token', this.sprite.position.absolute.x, this.sprite.position.absolute.y);
			if(token !== 0) {
				// If exist then clear tile with parameters: layer name, x, y
				this.game.tilemap.tile.clear('token', this.sprite.position.absolute.x, this.sprite.position.absolute.y);
				this.c += 10;
			}
			// Check sprite collision with map (up & down part of the sprite)
			if(this.sprite.collision.map.up || this.sprite.collision.map.down) {
				this.current.acceleration.y = 0;
			}
			// Check sprite collision with map (left & right part of the sprite)
			if(this.sprite.collision.map.left || this.sprite.collision.map.right) {
				this.current.acceleration.x = 0;
			}
			
			if(this.game.input.key.LEFT_ARROW || this.arrow_left.touch()) {
				this.current.acceleration.x = -1;
			}
			if(this.game.input.key.RIGHT_ARROW || this.arrow_right.touch()) {
				this.current.acceleration.x = 1;
			}
			if(this.game.input.key.UP_ARROW || this.arrow_up.touch()) {
				this.current.acceleration.y = -1;
			}
			if(this.game.input.key.DOWN_ARROW || this.arrow_down.touch()) {
				this.current.acceleration.y = 1;
			}
			
			this.sprite.acceleration.x = this.current.acceleration.x;
			this.sprite.acceleration.y = this.current.acceleration.y;
		};
	};
	
	return Player;

});