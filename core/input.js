function Input() {
	var self = this;
	this.key = {SPACE: 0, LEFT_ARROW: 0, UP_ARROW: 0, RIGHT_ARROW: 0, DOWN_ARROW: 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0, J: 0, K: 0, L: 0, M: 0, N: 0, O: 0, P: 0, Q: 0, R: 0, S: 0, T: 0, U: 0, V: 0, W: 0, X: 0, Y: 0, Z: 0};
	this.mouse = {x: 0, y: 0, BUTTON_LEFT: 0, BUTTON_MIDDLE: 0, BUTTON_RIGHT: 0};
	this.touch = new Array();
};

// Method to init 'keyboard', 'mouse' or 'touch' depending of type
Input.prototype.enable = function(_type) {
	if(_type === 'keyboard') {
		document.addEventListener('keydown', this.onkeydown, true);
		document.addEventListener('keyup', this.onkeyup, true);
	}
	if(_type === 'mouse') {
		document.addEventListener('mousedown', this.onmousedown, true);
		document.addEventListener('mousemove', this.onmousemove, true);
		document.addEventListener('mouseup', this.onmouseup, true);
	}
	if(_type === 'touch') {
		Game.canvas.addEventListener('touchstart', this.ontouchstart, true);
		Game.canvas.addEventListener('touchmove', this.ontouchmove, true);
		Game.canvas.addEventListener('touchend', this.ontouchend, true);
		Game.canvas.addEventListener('touchcancel', this.ontouchcancel, true);
	}
};
	
// Method to remove 'keyboard', 'mouse' or 'touch' depending of type
Input.prototype.disable = function(_type) {
	if(_type === 'keyboard') {
		document.removeEventListener('keydown', this.onkeydown, true);
		document.removeEventListener('keyup', this.onkeyup, true);
	}
	if(_type === 'mouse') {
		document.removeEventListener('mousedown', this.onmousedown, true);
		document.removeEventListener('mousemove', this.onmousemove, true);
		document.removeEventListener('mouseup', this.onmouseup, true);
	}
	if(_type === 'touch') {
		Game.canvas.removeEventListener('touchstart', this.ontouchstart, true);
		Game.canvas.removeEventListener('touchmove', this.ontouchmove, true);
		Game.canvas.removeEventListener('touchend', this.ontouchend, true);
		Game.canvas.removeEventListener('touchcancel', this.ontouchcancel, true);
	}
};
	
// Method 'onkeydown' for 'keyboard' type
Input.prototype.onkeydown = function(_e) {
	switch(_e.keyCode) {
		case 32:
			Game.input.key.SPACE = 1;
			break;
		case 37:
			Game.input.key.LEFT_ARROW = 1;
			break;
		case 38:
			Game.input.key.UP_ARROW = 1;
			break;
		case 39:
			Game.input.key.RIGHT_ARROW = 1;
			break;
		case 40:
			Game.input.key.DOWN_ARROW = 1;
			break;
		case 65:
			Game.input.key.A = 1;
			break;
		case 66:
			Game.input.key.B = 1;
			break;
		case 67:
			Game.input.key.C = 1;
			break;
		case 68:
			Game.input.key.D = 1;
			break;
		case 69:
			Game.input.key.E = 1;
			break;
		case 70:
			Game.input.key.F = 1;
			break;
		case 71:
			Game.input.key.G = 1;
			break;
		case 72:
			Game.input.key.H = 1;
			break;
		case 73:
			Game.input.key.I = 1;
			break;
		case 74:
			Game.input.key.J = 1;
			break;
		case 75:
			Game.input.key.K = 1;
			break;
		case 76:
			Game.input.key.L = 1;
			break;
		case 77:
			Game.input.key.M = 1;
			break;
		case 78:
			Game.input.key.N = 1;
			break;
		case 79:
			Game.input.key.O = 1;
			break;
		case 80:
			Game.input.key.P = 1;
			break;
		case 81:
			Game.input.key.Q = 1;
			break;
		case 82:
			Game.input.key.R = 1;
			break;
		case 83:
			Game.input.key.S = 1;
			break;
		case 84:
			Game.input.key.T = 1;
			break;
		case 85:
			Game.input.key.U = 1;
			break;
		case 86:
			Game.input.key.V = 1;
			break;
		case 87:
			Game.input.key.W = 1;
			break;
		case 88:
			Game.input.key.X = 1;
			break;
		case 89:
			Game.input.key.Y = 1;
			break;
		case 90:
			Game.input.key.Z = 1;
			break;
	}
};
	
// Method 'onkeyup' for 'keyboard' type
Input.prototype.onkeyup = function(_e) {
	switch(_e.keyCode) {
		case 32:
			Game.input.key.SPACE = 0;
			break;
		case 37:
			Game.input.key.LEFT_ARROW = 0;
			break;
		case 38:
			Game.input.key.UP_ARROW = 0;
			break;
		case 39:
			Game.input.key.RIGHT_ARROW = 0;
			break;
		case 40:
			Game.input.key.DOWN_ARROW = 0;
			break;
		case 65:
			Game.input.key.A = 0;
			break;
		case 66:
			Game.input.key.B = 0;
			break;
		case 67:
			Game.input.key.C = 0;
			break;
		case 68:
			Game.input.key.D = 0;
			break;
		case 69:
			Game.input.key.E = 0;
			break;
		case 70:
			Game.input.key.F = 0;
			break;
		case 71:
			Game.input.key.G = 0;
			break;
		case 72:
			Game.input.key.H = 0;
			break;
		case 73:
			Game.input.key.I = 0;
			break;
		case 74:
			Game.input.key.J = 0;
			break;
		case 75:
			Game.input.key.K = 0;
			break;
		case 76:
			Game.input.key.L = 0;
			break;
		case 77:
			Game.input.key.M = 0;
			break;
		case 78:
			Game.input.key.N = 0;
			break;
		case 79:
			Game.input.key.O = 0;
			break;
		case 80:
			Game.input.key.P = 0;
			break;
		case 81:
			Game.input.key.Q = 0;
			break;
		case 82:
			Game.input.key.R = 0;
			break;
		case 83:
			Game.input.key.S = 0;
			break;
		case 84:
			Game.input.key.T = 0;
			break;
		case 85:
			Game.input.key.U = 0;
			break;
		case 86:
			Game.input.key.V = 0;
			break;
		case 87:
			Game.input.key.W = 0;
			break;
		case 88:
			Game.input.key.X = 0;
			break;
		case 89:
			Game.input.key.Y = 0;
			break;
		case 90:
			Game.input.key.Z = 0;
			break;
	}
};
	
// Method 'onmousedown' for 'mouse' type
Input.prototype.onmousedown = function(_e) {
	switch(_e.button) {
		case 0:
			Game.input.mouse.BUTTON_LEFT = 1;
			break;
		case 1:
			Game.input.mouse.BUTTON_MIDDLE = 1;
			break;
		case 2:
			Game.input.mouse.BUTTON_RIGHT = 1;
			break;
	}
	Game.input.mousePosition(_e);
};
	
// Method 'onmousemove' for 'mouse' type
Input.prototype.onmousemove = function(_e) {
	Game.input.mousePosition(_e);
};
	
// Method 'onmouseup' for 'mouse' type
Input.prototype.onmouseup = function(_e) {
	switch(_e.button) {
		case 0:
			Game.input.mouse.BUTTON_LEFT = 0;
			break;
		case 1:
			Game.input.mouse.BUTTON_MIDDLE = 0;
			break;
		case 2:
			Game.input.mouse.BUTTON_RIGHT = 0;
			break;
	}
	Game.input.mousePosition(_e);
};

Input.prototype.mousePosition = function(_e) {
	Game.input.mouse.x = (_e.pageX  - Game.canvas.offsetLeft) / Game.scale;
	Game.input.mouse.y = (_e.pageY - Game.canvas.offsetTop) / Game.scale;
}
	
// Method 'ontouchstart' for 'touch' type
Input.prototype.ontouchstart = function(_e) {
	_e.preventDefault();
	Game.input.normalizeTouches(_e.touches);
};
	
// Method 'ontouchmove' for 'touch' type
Input.prototype.ontouchmove = function(_e) {
	_e.preventDefault();
	Game.input.normalizeTouches(_e.touches);
};
	
// Method 'ontouchend' for 'touch' type
Input.prototype.ontouchend = function(_e) {
	_e.preventDefault();
	Game.input.normalizeTouches(_e.touches);
};
	
// Method 'ontouchcancel' for 'touch' type
Input.prototype.ontouchcancel = function(_e) {
	_e.preventDefault();
	Game.input.normalizeTouches(_e.touches);
};
	
// Method to normalize touches depending of canvas size and position
Input.prototype.normalizeTouches = function(_touches) {
	Game.input.touch = [];
	for(var i = 0; i < _touches.length; i++) {
		Game.input.touch.push({x: (_touches[i].pageX - Game.canvas.offsetLeft) / Game.scale, y: (_touches[i].pageY - Game.canvas.offsetTop) / Game.scale});
	}
};