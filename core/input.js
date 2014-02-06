function Input(_game) {
	this.game = _game
	this.key = {SPACE: 0, LEFT_ARROW: 0, UP_ARROW: 0, RIGHT_ARROW: 0, DOWN_ARROW: 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0, J: 0, K: 0, L: 0, M: 0, N: 0, O: 0, P: 0, Q: 0, R: 0, S: 0, T: 0, U: 0, V: 0, W: 0, X: 0, Y: 0, Z: 0};
	this.mouse = {x: 0, y: 0, BUTTON_LEFT: 0, BUTTON_MIDDLE: 0, BUTTON_RIGHT: 0};
	this.touch = new Array();
};

// Method to init 'keyboard', 'mouse' or 'touch' depending of type
Input.prototype.enable = function(_type) {
	var self = this;
	
	if(_type === 'keyboard') {
		document.addEventListener('keydown', function(_e){self.onkeydown(_e)}, true);
		document.addEventListener('keyup', function(_e){self.onkeyup(_e)}, true);
	}
	if(_type === 'mouse') {
		this.game.canvas.addEventListener('mousedown', function(_e){self.onmousedown(_e)}, true);
		this.game.canvas.addEventListener('mousemove', function(_e){self.onmousemove(_e)}, true);
		this.game.canvas.addEventListener('mouseup', function(_e){self.onmouseup(_e)}, true);
	}
	if(_type === 'touch') {
		this.game.canvas.addEventListener('MSPointerDown', function(_e){self.ontouchstart(_e)}, true);
		this.game.canvas.addEventListener('pointermove', function(_e){self.ontouchmove(_e)}, true);
		this.game.canvas.addEventListener('MSPointerUp', function(_e){self.ontouchend(_e)}, true);
		this.game.canvas.addEventListener('MSPointerCancel', function(_e){self.ontouchcancel(_e)}, true);

		this.game.canvas.addEventListener('touchstart', function(_e){self.ontouchstart(_e)}, true);
		this.game.canvas.addEventListener('touchmove', function(_e){self.ontouchmove(_e)}, true);
		this.game.canvas.addEventListener('touchend', function(_e){self.ontouchend(_e)}, true);
		this.game.canvas.addEventListener('touchcancel', function(_e){self.ontouchcancel(_e)}, true);
	}
};
	
// Method to remove 'keyboard', 'mouse' or 'touch' depending of type
Input.prototype.disable = function(_type) {
	var self = this;

	if(_type === 'keyboard') {
		document.removeEventListener('keydown', function(_e){self.onkeydown(_e)}, true);
		document.removeEventListener('keyup', function(_e){self.onkeyup(_e)}, true);
	}
	if(_type === 'mouse') {
		this.game.canvas.removeEventListener('mousedown', function(_e){self.onmousedown(_e)}, true);
		this.game.canvas.removeEventListener('mousemove', function(_e){self.onmousemove(_e)}, true);
		this.game.canvas.removeEventListener('mouseup', function(_e){self.onmouseup(_e)}, true);
	}
	if(_type === 'touch') {
		this.game.canvas.removeEventListener('touchstart', function(_e){self.ontouchstart(_e)}, true);
		this.game.canvas.removeEventListener('touchmove', function(_e){self.ontouchmove(_e)}, true);
		this.game.canvas.removeEventListener('touchend', function(_e){self.ontouchend(_e)}, true);
		this.game.canvas.removeEventListener('touchcancel', function(_e){self.ontouchcancel(_e)}, true);
	}
};
	
// Method 'onkeydown' for 'keyboard' type
Input.prototype.onkeydown = function(_e) {
	_e.preventDefault();
	switch(_e.keyCode) {
		case 32:
			this.key.SPACE = 1;
			break;
		case 37:
			this.key.LEFT_ARROW = 1;
			break;
		case 38:
			this.key.UP_ARROW = 1;
			break;
		case 39:
			this.key.RIGHT_ARROW = 1;
			break;
		case 40:
			this.key.DOWN_ARROW = 1;
			break;
		case 65:
			this.key.A = 1;
			break;
		case 66:
			this.key.B = 1;
			break;
		case 67:
			this.key.C = 1;
			break;
		case 68:
			this.key.D = 1;
			break;
		case 69:
			this.key.E = 1;
			break;
		case 70:
			this.key.F = 1;
			break;
		case 71:
			this.key.G = 1;
			break;
		case 72:
			this.key.H = 1;
			break;
		case 73:
			this.key.I = 1;
			break;
		case 74:
			this.key.J = 1;
			break;
		case 75:
			this.key.K = 1;
			break;
		case 76:
			this.key.L = 1;
			break;
		case 77:
			this.key.M = 1;
			break;
		case 78:
			this.key.N = 1;
			break;
		case 79:
			this.key.O = 1;
			break;
		case 80:
			this.key.P = 1;
			break;
		case 81:
			this.key.Q = 1;
			break;
		case 82:
			this.key.R = 1;
			break;
		case 83:
			this.key.S = 1;
			break;
		case 84:
			this.key.T = 1;
			break;
		case 85:
			this.key.U = 1;
			break;
		case 86:
			this.key.V = 1;
			break;
		case 87:
			this.key.W = 1;
			break;
		case 88:
			this.key.X = 1;
			break;
		case 89:
			this.key.Y = 1;
			break;
		case 90:
			this.key.Z = 1;
			break;
	}
};
	
// Method 'onkeyup' for 'keyboard' type
Input.prototype.onkeyup = function(_e) {
	_e.preventDefault();
	switch(_e.keyCode) {
		case 32:
			this.key.SPACE = 0;
			break;
		case 37:
			this.key.LEFT_ARROW = 0;
			break;
		case 38:
			this.key.UP_ARROW = 0;
			break;
		case 39:
			this.key.RIGHT_ARROW = 0;
			break;
		case 40:
			this.key.DOWN_ARROW = 0;
			break;
		case 65:
			this.key.A = 0;
			break;
		case 66:
			this.key.B = 0;
			break;
		case 67:
			this.key.C = 0;
			break;
		case 68:
			this.key.D = 0;
			break;
		case 69:
			this.key.E = 0;
			break;
		case 70:
			this.key.F = 0;
			break;
		case 71:
			this.key.G = 0;
			break;
		case 72:
			this.key.H = 0;
			break;
		case 73:
			this.key.I = 0;
			break;
		case 74:
			this.key.J = 0;
			break;
		case 75:
			this.key.K = 0;
			break;
		case 76:
			this.key.L = 0;
			break;
		case 77:
			this.key.M = 0;
			break;
		case 78:
			this.key.N = 0;
			break;
		case 79:
			this.key.O = 0;
			break;
		case 80:
			this.key.P = 0;
			break;
		case 81:
			this.key.Q = 0;
			break;
		case 82:
			this.key.R = 0;
			break;
		case 83:
			this.key.S = 0;
			break;
		case 84:
			this.key.T = 0;
			break;
		case 85:
			this.key.U = 0;
			break;
		case 86:
			this.key.V = 0;
			break;
		case 87:
			this.key.W = 0;
			break;
		case 88:
			this.key.X = 0;
			break;
		case 89:
			this.key.Y = 0;
			break;
		case 90:
			this.key.Z = 0;
			break;
	}
};
	
// Method 'onmousedown' for 'mouse' type
Input.prototype.onmousedown = function(_e) {
	switch(_e.button) {
		case 0:
			this.mouse.BUTTON_LEFT = 1;
			break;
		case 1:
			this.mouse.BUTTON_MIDDLE = 1;
			break;
		case 2:
			this.mouse.BUTTON_RIGHT = 1;
			break;
	}
	this.mousePosition(_e);
};
	
// Method 'onmousemove' for 'mouse' type
Input.prototype.onmousemove = function(_e) {
	this.mousePosition(_e);
};
	
// Method 'onmouseup' for 'mouse' type
Input.prototype.onmouseup = function(_e) {
	switch(_e.button) {
		case 0:
			this.mouse.BUTTON_LEFT = 0;
			break;
		case 1:
			this.mouse.BUTTON_MIDDLE = 0;
			break;
		case 2:
			this.mouse.BUTTON_RIGHT = 0;
			break;
	}
	this.mousePosition(_e);
};

Input.prototype.mousePosition = function(_e) {
	this.mouse.x = (_e.pageX  - this.game.canvas.offsetLeft) / this.game.scale;
	this.mouse.y = (_e.pageY - this.game.canvas.offsetTop) / this.game.scale;
}
	
// Method 'ontouchstart' for 'touch' type
Input.prototype.ontouchstart = function(_e) {
	_e.preventDefault();
	this.normalizeTouches(_e);
};
	
// Method 'ontouchmove' for 'touch' type
Input.prototype.ontouchmove = function(_e) {
	_e.preventDefault();
	this.normalizeTouches(_e);
};
	
// Method 'ontouchend' for 'touch' type
Input.prototype.ontouchend = function(_e) {
	_e.preventDefault();
	this.touch = [];
};
	
// Method 'ontouchcancel' for 'touch' type
Input.prototype.ontouchcancel = function(_e) {
	_e.preventDefault();
	this.touch = [];
};
	
// Method to normalize touches depending of canvas size and position
Input.prototype.normalizeTouches = function(_e) {
	this.touch = [];
	if(_e.touches) {
		for(var i = 0; i < _e.touches.length; i++) {
			this.touch.push({x: (_e.touches[i].pageX - this.game.canvas.offsetLeft) / this.game.scale, y: (_e.touches[i].pageY - this.game.canvas.offsetTop) / this.game.scale});
		}
	} else {
		this.touch.push({x: (_e.pageX - this.game.canvas.offsetLeft) / this.game.scale, y: (_e.pageY - this.game.canvas.offsetTop) / this.game.scale});
	}
};