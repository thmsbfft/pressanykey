function Keyboard(parameters) {

	this.el = document.querySelectorAll('main')[0];
	this.canvas = document.getElementsByTagName('canvas')[0];

	this.keyMap = undefined;
	this.pathPoints = [];

	this.debug = {};
	this.props = {};

	paper.setup(this.canvas);
	
	this.init();
	this.draw();

}

Keyboard.prototype.init = function() {

	this.keyMap = [
		"`",
		"1",
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
		"backspace",
		"tab",
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
		"capslock",
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
		"enter",
		"shift", // L
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
		"//shift", // R
		"control", // L
		"alt", // L
		"meta", // L
		" ", // Spacebar
		"//meta", // R
		"//alt", // R
		"//control" // R
	]

	window.addEventListener('keydown', function(e) {
		this.onKeyDown(e.key.toLowerCase(), e.location);
		e.preventDefault();
	}.bind(this));

	window.addEventListener('keyup', function(e) {
		this.onKeyUp(e.key.toLowerCase(), e.location);
		e.preventDefault();
	}.bind(this));

	window.addEventListener('resize', function(e) {
		this.draw();
	}.bind(this));

}

Keyboard.prototype.draw = function() {

	console.log("draw");

	paper.project.activeLayer.removeChildren();

	// View resize
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.canvas.style = '';
	paper.view.viewSize = new paper.Size(window.innerWidth, window.innerHeight);

	// Init UI
	this.keyboard = new paper.Group();
	this.path = new paper.Path();
	this.type = new paper.Group();
	this.graphics = new paper.Group([this.keyboard, this.path, this.type]);
	this.graphics.bringToFront();
	this.text = [];

	// Debug
	this.debug.boundingBox = new paper.Path.Rectangle(this.keyboard.bounds);
	this.debug.boundingBox.position = paper.view.center;

	// Draw UI
	this.drawKeyboard();
	this.drawPath();

	// Responsive
	this.graphics.position = paper.view.center;

	paper.view.draw();

}

Keyboard.prototype.drawKeyboard = function(props) {

	// MADNESS

	var keyboardWidth = Math.round(paper.view.bounds.width*0.9);
	var margin = Math.round(paper.view.bounds.width*0.007);
	var keySize = Math.round( (keyboardWidth - 13*margin) / 15.5 );
	var typeSize = paper.view.bounds.width*0.015;

	// Draw first line
	for (var i = 0; i < 13; i++) {
		var path = new paper.Rectangle(new paper.Point(i*(keySize + margin), 0), keySize);
		var key = new paper.Path.Rectangle(path, new paper.Size(4, 4));
		this.keyboard.addChild(key);
	}

	// Del key is 1.5x wider than a Key
	var del = new paper.Rectangle(new paper.Point(13*(keySize + margin), 0), new paper.Size(keySize*1.5, keySize));
	var delKey = new paper.Path.Rectangle(del, new paper.Size(4, 4));
	this.keyboard.addChild(delKey);

	// Tab key is 1.5x wider than a Key
	var tab = new paper.Rectangle(new paper.Point(0, keySize + margin), new paper.Size(keySize*1.5, keySize));
	var tabKey = new paper.Path.Rectangle(tab, new paper.Size(4, 4));
	this.keyboard.addChild(tabKey);

	// Draw second line
	for (var i = 0; i < 13; i++) {
		var path = new paper.Rectangle(new paper.Point(i*(keySize + margin) + tabKey.bounds.width + margin, keySize + margin), keySize);
		var key = new paper.Path.Rectangle(path, new paper.Size(4, 4));
		this.keyboard.addChild(key);
	}

	// Capslock key is 1.5x wider than a Key + margin
	var cl = new paper.Rectangle(new paper.Point(0, (keySize + margin) * 2), new paper.Size(keySize*1.5 + margin, keySize));
	var clKey = new paper.Path.Rectangle(cl, new paper.Size(4, 4));
	this.keyboard.addChild(clKey);

	// Draw third line
	for (var i = 0; i < 11; i++) {
		var path = new paper.Rectangle(new paper.Point(i*(keySize + margin) + clKey.bounds.width + margin, (keySize + margin) * 2), keySize);
		var key = new paper.Path.Rectangle(path, new paper.Size(4, 4));
		this.keyboard.addChild(key);
	}

	// Return key is 2x wider than a Key
	var rt = new paper.Rectangle(new paper.Point(this.keyboard.lastChild.bounds.topRight.x + margin, (keySize + margin) * 2), new paper.Size(keySize*2, keySize));
	var rtKey = new paper.Path.Rectangle(rt, new paper.Size(4, 4));
	this.keyboard.addChild(rtKey);

	// Shift key is 2x wider than a Key + 2 x margin
	var shift = new paper.Rectangle(new paper.Point(0, (keySize + margin) * 3), new paper.Size(keySize*2 + 2 * margin, keySize));
	var shiftKey = new paper.Path.Rectangle(shift, new paper.Size(4, 4));
	this.keyboard.addChild(shiftKey);

	// Draw fourth line
	for (var i = 0; i < 10; i++) {
		var path = new paper.Rectangle(new paper.Point(i*(keySize + margin) + shiftKey.bounds.width + margin, (keySize + margin) * 3), keySize);
		var key = new paper.Path.Rectangle(path, new paper.Size(4, 4));
		this.keyboard.addChild(key);
	}

	// Shift key is 2x wider than a Key + 2 x margin
	var shift2 = new paper.Rectangle(new paper.Point(this.keyboard.lastChild.bounds.topRight.x + margin, (keySize + margin) * 3), new paper.Point(rtKey.bounds.bottomRight.x, rtKey.bounds.bottomRight.y + margin + keySize));
	var shift2Key = new paper.Path.Rectangle(shift2, new paper.Size(4, 4));
	this.keyboard.addChild(shift2Key);

	// Ctrl1 key is 1.5x wider than a Key
	var ctrl1 = new paper.Rectangle(new paper.Point(0, (keySize + margin) * 4), new paper.Size(keySize*1.5, keySize));
	var ctrl1Key = new paper.Path.Rectangle(ctrl1, new paper.Size(4, 4));
	this.keyboard.addChild(ctrl1Key);

	// Alt1 key is 1x key + 1x margin
	var alt1 = new paper.Rectangle(new paper.Point(1.5*keySize + margin, (keySize + margin) * 4), new paper.Size(keySize + margin, keySize));
	var alt1Key = new paper.Path.Rectangle(alt1, new paper.Size(4, 4));
	this.keyboard.addChild(alt1Key);

	// Command1 key is 4key + 5margins
	var cmd1 = new paper.Rectangle(new paper.Point(this.keyboard.lastChild.bounds.topRight.x + margin, (keySize + margin) * 4), new paper.Point(keySize*4 + margin*5 - margin, (keySize + margin) * 4 + keySize));
	var cmd1Key = new paper.Path.Rectangle(cmd1, new paper.Size(4, 4));
	this.keyboard.addChild(cmd1Key);

	// Space key is 6x key + 5x margin
	var space = new paper.Rectangle(new paper.Point(4*keySize + 5*margin, (keySize + margin) * 4), new paper.Size(6*keySize + 5*margin, keySize));
	var spaceKey = new paper.Path.Rectangle(space, new paper.Size(4, 4));
	this.keyboard.addChild(spaceKey);

	var cmd2Key = cmd1Key.clone();
	cmd2Key.position.x = spaceKey.bounds.rightCenter.x + cmd1Key.bounds.width/2 + margin;
	this.keyboard.addChild(cmd2Key);

	var alt2Key = alt1Key.clone();
	alt2Key.position.x = this.keyboard.lastChild.bounds.topRight.x + alt1Key.bounds.width/2 + margin;
	this.keyboard.addChild(alt2Key);

	// Ctrl2 key completes the layout
	var ctrl2 = new paper.Rectangle(new paper.Point(this.keyboard.lastChild.bounds.topRight.x + margin, (keySize + margin) * 4), new paper.Point(shift2Key.bounds.bottomRight.x, shift2Key.bounds.bottomRight.y + margin + keySize));
	var ctrl2Key = new paper.Path.Rectangle(ctrl2, new paper.Size(4, 4));
	this.keyboard.addChild(ctrl2Key);

	// Type
	var delType = new paper.PointText(new paper.Point(delKey.bounds.bottomRight.x - margin, delKey.bounds.bottomRight.y - margin));
	delType.justification = 'right';
	delType.fontSize = typeSize;
	delType.fontFamily= 'Roboto';
	delType.fillColor = 'white';
	delType.content = 'del';
	this.type.addChild(delType);

	var returnType = new paper.PointText(new paper.Point(rtKey.bounds.bottomRight.x - margin, rtKey.bounds.bottomRight.y - margin));
	returnType.justification = 'right';
	returnType.fontSize = typeSize;
	returnType.fontFamily= 'Roboto';
	returnType.fillColor = 'white';
	returnType.content = 'return';
	this.type.addChild(returnType);

	if(paper.view.bounds.width < 1000) {
		returnType.content = "•";
		delType.content = "←";
	}

	this.keyboard.style = {
		fillColor: "#808080",
		strokeColor: new paper.Color(1,1,1,0.4),
		strokeWidth: 1.5,
		shadowColor: new paper.Color(0,0,0,0.45),
		shadowBlur: 4,
		shadowOffset: new paper.Point(0, 2)
	}

}

Keyboard.prototype.drawPath = function() {

	var strokeWidth = paper.view.bounds.width*0.004 + 1;

	this.path.style = {
		strokeWidth : strokeWidth,
		fillColor: new paper.Color(0,0,0,0),
		strokeCap : 'round',
		strokeJoin : 'round'
	}

	this.path.strokeColor = {
		gradient: {
			stops: [new paper.Color('#00FFF4'), new paper.Color('#1F00FF')]
		},
		origin: paper.view.bounds.leftCenter,
		destination: paper.view.bounds.rightCenter
	}

	for (var i = 0; i <= this.pathPoints.length - 1; i++) {
		this.path.add(this.keyboard.children[this.pathPoints[i]].bounds.center);
	}
	
	this.path.smooth();

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
			index = 57;
		}

		if(key == "alt") {
			index = 58;
		}

		if(key == "control") {
			index = 59;
		}

		if(key == "shift") {
			index = 52;
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

	this.pathPoints.push(index);
	this.path.add(this.keyboard.children[index].bounds.center);
	this.path.smooth();

	this.text.push(key);

	paper.view.draw();

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

Keyboard.prototype.delete = function() {

	this.path.removeSegment(this.path.segments.length-1);
	this.path.smooth();

	console.log(this.pathPoints);

	this.pathPoints.pop();
	console.log(this.pathPoints);
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