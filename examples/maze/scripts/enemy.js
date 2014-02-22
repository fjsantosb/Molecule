Molecule.module('Enemy', function (require, p) {

	function Enemy(_game, _type) {
		this.current = {acceleration: {x: 0, y: 0}};
		this.game = _game;
		this.type = _type;
		switch(this.type) {
			case 1:
				this.sprite = this.game.sprite.load('media/enemy_red.png');
				break;
			case 2:
				this.sprite = this.game.sprite.load('media/enemy_orange.png');
				break;
			case 3:
				this.sprite = this.game.sprite.load('media/enemy_blue.png');
				break;
			case 4:
				this.sprite = this.game.sprite.load('media/enemy_purple.png');
				break;
		}
	
		this.init = function() {
			switch(this.type) {
				case 1:
					this.sprite.position.x += 16;
					this.sprite.position.y += 16 * 2;
					this.sprite.speed.max.x = 1;
					this.sprite.speed.max.y = 1;
					break;
				case 2:
					this.sprite.position.x += 16 * 27;
					this.sprite.position.y += 16 * 27;
					this.sprite.speed.max.x = 1;
					this.sprite.speed.max.y = 1;
					break;
				case 3:
					this.sprite.position.x += 16 * 27;
					this.sprite.position.y += 16 * 2;
					this.sprite.speed.max.x = 1;
					this.sprite.speed.max.y = 1;
					break;
				case 4:
					this.sprite.position.x += 16;
					this.sprite.position.y += 16 * 27;
					this.sprite.speed.max.x = 1;
					this.sprite.speed.max.y = 1;
					break;
			}
		};
	
		this.update = function() {
			if(this.sprite.position.absolute.x % 16 === 0 && this.sprite.position.absolute.y % 16 === 0 && !this.change) {
				if(this.current.acceleration.x === 0 && this.current.acceleration.y === 0) {
					this.current.acceleration.x = Math.floor(Math.random() * 3) -1;
					this.current.acceleration.y = Math.floor(Math.random() * 3) -1;
				}
				if(this.current.acceleration.x !== 0) {
					// Check is Tile not Exist on Layer with parameters: layer name, x, y
					tile = this.game.tilemap.tile.get('map', this.sprite.position.absolute.x, this.sprite.position.absolute.y + this.sprite.frame.height + 1);
					if(tile === 0) {
						if(Math.floor(Math.random() * 2) === 0) {
							this.current.acceleration.x = 0;
							this.current.acceleration.y = 1;
						}
					}
					// Check is Tile not Exist on Layer with parameters: layer name, x, y
					tile = this.game.tilemap.tile.get('map', this.sprite.position.absolute.x, this.sprite.position.absolute.y - 1);
					if(tile === 0) {
						if(Math.floor(Math.random() * 2) === 0) {
							this.current.acceleration.x = 0;
							this.current.acceleration.y = -1;
						}
					}
				} else if(this.current.acceleration.y !== 0) {
					// Check is Tile not Exist on Layer with parameters: layer name, x, y
					tile = this.game.tilemap.tile.get('map', this.sprite.position.absolute.x + this.sprite.frame.width + 1, this.sprite.position.absolute.y);
					if(tile === 0) {
						if(Math.floor(Math.random() * 2) === 0) {
							this.current.acceleration.x = 1;
							this.current.acceleration.y = 0;
						}
					}
					// Check is Tile not Exist on Layer with parameters: layer name, x, y
					tile = this.game.tilemap.tile.get('map', this.sprite.position.absolute.x - 1, this.sprite.position.absolute.y);
					if(tile === 0) {
						if(Math.floor(Math.random() * 2) === 0) {
							this.current.acceleration.x = -1;
							this.current.acceleration.y = 0;
						}
					}
				}
			}
			// Check sprite collision with map (up & down part of the sprite)
			if(this.sprite.collision.sprite.up || this.sprite.collision.sprite.down) {
				this.current.acceleration.y *= -1;
			// Check sprite collision with map (left & right part of the sprite)
			} else if(this.sprite.collision.sprite.left || this.sprite.collision.sprite.right) {
				this.current.acceleration.x *= -1;
			}
		
			this.sprite.acceleration.x = this.current.acceleration.x;
			this.sprite.acceleration.y = this.current.acceleration.y;
		};
	};
	
	return Enemy;
	
});