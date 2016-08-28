function Keyboard(parameters) {

	this.el = document.querySelectorAll('main')[0];
	this.canvas = document.getElementsByTagName('canvas')[0];

	paper.setup(this.canvas);
	this.attachEvents();

	this.keyboard = undefined;
	this.keyMap = undefined;
	this.path = new paper.Path();
	this.graphics = undefined;

	this.debug = {
		center: undefined,
		boundingBox: undefined
	}

	paper.project.importSVG('../keyboard.svg', { onLoad: this.initKeyboard.bind(this) });
	paper.view.zoom = 0.5;

}

Keyboard.prototype.attachEvents = function() {

	window.addEventListener('keydown', function(e) {

		// console.log(e.key);
		// console.log('Loc', e.location);
		// var char = String.fromCharCode(e.keyCode);
		// console.log(char, e.key);
		
		this.onKeyDown(e.key.toLowerCase(), e.location);
		e.preventDefault();

	}.bind(this));

	window.addEventListener('resize', function(e) {
		this.resize();
	}.bind(this));

}

Keyboard.prototype.resize = function() {

	// View resize
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	paper.view.viewSize = new paper.Size(window.innerWidth, window.innerHeight);

	// Debug
	this.debug.center.position = paper.view.center;
	this.debug.boundingBox.position = paper.view.center;

	// Responsive
	this.graphics.position = paper.view.center;

	paper.view.draw();

}

Keyboard.prototype.initKeyboard = function(keyboard, svg) {

	// Debug
	this.debug.center = new paper.Shape.Circle(new paper.Point(80, 50), 2);
	this.debug.center.fillColor = "red";

	// Keyboard
	this.keyboard = keyboard.children[0];
	// this.keyboard.applyMatrix = false;

	this.keyboard.style = {
		fillColor: "#808080",
		strokeColor: new paper.Color(1,1,1,0.4),
		strokeWidth: 1.5,
		shadowColor: new paper.Color(0,0,0,0.45),
		shadowBlur: 4,
		shadowOffset: new paper.Point(0, 2),
		borderRadius: 8
	}

	// Debug
	this.debug.boundingBox = new paper.Path.Rectangle(this.keyboard.bounds);
	// this.debug.boundingBox.strokeColor = "blue";

	for (var i = this.keyboard.children.length - 1; i >= 0; i--) {
		
		// Style keys individually

		this.keyboard.children[i].strokeColor = new paper.Color(Math.random(), Math.random(), Math.random());
		this.keyboard.children[i].strokeColor = {
			gradient: {
				stops: [new paper.Color(1,1,1,0.3), new paper.Color(1,1,1,0.2)]
			},
			origin: this.keyboard.children[i].bounds.topCenter,
			destination: this.keyboard.children[i].bounds.bottomCenter
		}

	}

	this.keyMap = [
		"1",
		"`",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"0",
		"-",
		"=",
		"q",
		"w",
		"e",
		"r",
		"t",
		"y",
		"u",
		"i",
		"o",
		"p",
		"[",
		"]",
		"\\",
		"a",
		"s",
		"d",
		"f",
		"g",
		"h",
		"j",
		"k",
		"l",
		";",
		"'",
		"z",
		"x",
		"c",
		"v",
		"b",
		"n",
		"m",
		",",
		".",
		"/",
		"backspace",
		"tab",
		"capslock",
		"shift", // L
		" ", // Space
		"//meta", // R
		"control", // L
		"//alt", // R
		"alt", // L
		"//control", // R
		"meta", // L
		"//shift", // R
		"enter",
	]

	this.initPath();

	this.resize();

}

Keyboard.prototype.initPath = function() {

	this.path.style = {
		strokeColor : "red",
		strokeWidth : 2
	}

	this.graphics = new paper.Group([this.keyboard, this.path]);
	this.graphics.bringToFront();

}

Keyboard.prototype.onKeyDown = function(key, location) {

	var index = null

	if(location == 1 || location == 0) {

		// Left side
		
		for (var i = this.keyMap.length - 1; i >= 0; i--) {
			if(this.keyMap[i] == key) index = i;
		}

		if(index == null) {
			console.log('No match');
		}

	}
	else if(location == 2) {

		// Right side

		if(key == "meta") {
			index = 52;
		}

		if(key == "alt") {
			index = 54;
		}

		if(key == "control") {
			index = 56;
		}

		if(key == "shift") {
			index = 58;
		}

	}

	this.addToPath(index);

}

Keyboard.prototype.addToPath = function(index) {

	this.keyboard.children[index].strokeColor = "red";

	this.path.add(this.keyboard.children[index].bounds.center);
	this.path.smooth();

	paper.view.draw();

}