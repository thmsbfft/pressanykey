function Keyboard(parameters) {

	this.el = document.querySelectorAll('main')[0];
	this.canvas = document.getElementsByTagName('canvas')[0];

	paper.setup(this.canvas);
	this.attachEvents();

	this.keyboard = undefined;
	this.keyMap = undefined;
	this.path = new paper.Path();
	this.graphics = undefined;
	this.type = undefined;

	this.text = [];

	this.debug = {
		center: undefined,
		boundingBox: undefined
	}

	paper.project.importSVG('../data/keyboard.svg', { onLoad: this.initKeyboard.bind(this), onError: this.onErr.bind(this) });
	paper.view.zoom = 0.5;

}

Keyboard.prototype.onErr = function(err) {
	console.log(err);
}

Keyboard.prototype.attachEvents = function() {

	window.addEventListener('keydown', function(e) {
		this.onKeyDown(e.key.toLowerCase(), e.location);
		e.preventDefault();
	}.bind(this));

	window.addEventListener('keyup', function(e) {
		this.onKeyUp(e.key.toLowerCase(), e.location);
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
	this.canvas.style = '';
	paper.view.viewSize = new paper.Size(window.innerWidth, window.innerHeight);

	// Debug
	this.debug.center.position = paper.view.center;
	this.debug.boundingBox.position = paper.view.center;

	// Responsive
	this.graphics.position = paper.view.center;

	paper.view.draw();

}

Keyboard.prototype.initKeyboard = function(keyboard, svg) {

	console.log('Imported!');

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
		shadowOffset: new paper.Point(0, 2)
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

	var returnType = new paper.Raster('return');
	returnType.position.x = this.keyboard.children[59].bounds.bottomRight.x - returnType.width/2 - 12;
	returnType.position.y = this.keyboard.children[59].bounds.bottomRight.y - returnType.height/2 - 12;

	var delType = new paper.Raster('del');
	delType.position.x = this.keyboard.children[47].bounds.bottomRight.x - delType.width/2 - 12;
	delType.position.y = this.keyboard.children[47].bounds.bottomRight.y - delType.height/2 - 12;
	// var returnType = new paper.PointText(new paper.Point(this.keyboard.children[59].bounds.bottomRight.x - 12, this.keyboard.children[59].bounds.bottomRight.y - 12));
	// returnType.justification = 'right';
	// returnType.fontFamily= 'Roboto';

	// returnType.fillColor = 'white';
	// returnType.content = 'return';

	// var delType = new paper.PointText(new paper.Point(this.keyboard.children[47].bounds.bottomRight.x - 12, this.keyboard.children[47].bounds.bottomRight.y - 12));
	// delType.justification = 'right';
	// delType.fontFamily= 'Roboto';

	// delType.fillColor = 'white';
	// delType.content = 'del';

	this.type = new paper.Group([returnType, delType]);

	this.initPath();
	this.resize();

}

Keyboard.prototype.initPath = function() {

	this.path.style = {
		strokeWidth : 6,
		fillColor: new paper.Color(0,0,0,0),
		strokeCap : 'round',
		strokeJoin : 'round'
	}

	this.path.strokeColor = {
		gradient: {
			stops: [new paper.Color('#00FFF4'), new paper.Color('#1F00FF')]
		},
		origin: this.debug.boundingBox.bounds.leftCenter,
		destination: this.debug.boundingBox.bounds.rightCenter
	}

	this.graphics = new paper.Group([this.keyboard, this.path, this.type]);
	this.graphics.bringToFront();

}

Keyboard.prototype.locateKey = function(key, location) {

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

	return index;

}

Keyboard.prototype.onKeyDown = function(key, location) {

	var index = this.locateKey(key, location);

	this.keyboard.children[index].shadowColor = new paper.Color(0,0,0,0.2);
	this.keyboard.children[index].shadowBlur = 1;
	this.keyboard.children[index].shadowOffset = new paper.Point(0, 1);

	if(key == "backspace") {
		this.delete();
		return;
	}

	if(key == "enter") {
		paper.view.draw();
		return;
	}

	this.addToText(key);
	this.addToPath(index);

}

Keyboard.prototype.onKeyUp = function(key, location) {

	for (var i = this.keyboard.children.length - 1; i >= 0; i--) {
		
		this.keyboard.children[i].shadowColor = new paper.Color(0,0,0,0.45);
		this.keyboard.children[i].shadowBlur = 4;
		this.keyboard.children[i].shadowOffset = new paper.Point(0, 2);

	}

	if(key == "enter") {
		if(this.path.segments.length > 1) {
			this.sendToPrinter();
			this.resetAll();
		}
	}

	paper.view.draw();
}

Keyboard.prototype.addToPath = function(index) {

	this.path.add(this.keyboard.children[index].bounds.center);
	this.path.smooth();

	paper.view.draw();

}

Keyboard.prototype.addToText = function(character) {

	this.text.push(character);

}

Keyboard.prototype.delete = function() {

	this.path.removeSegment(this.path.segments.length-1);
	this.text.pop();

	paper.view.draw();

}

Keyboard.prototype.sendToPrinter = function() {

	// Format text for exporting
	for (var i = this.text.length - 1; i >= 0; i--) {
		if(this.text[i] == 'meta' || this.text[i] == 'control' || this.text[i] == 'alt' || this.text[i] == 'shift' || this.text[i] == 'tab' || this.text[i] == 'capslock') {
			this.text[i] = '░';
		}
	}

	// Format svg for saving
	var svg = '<?xml version="1.0" encoding="utf-8"?>';
	svg += '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="' + paper.view.bounds.width + '" height="' + paper.view.bounds.height + '">';
	svg += this.path.exportSVG({ asString: true });
	svg += '</svg>';

	var blob = new Blob([svg], {
		type: 'data:image/svg+xml'
	});

	saveAs(blob, this.text.join('') + '.svg');

}

Keyboard.prototype.resetAll = function() {

	this.path.removeSegments();
	this.text = [];

}