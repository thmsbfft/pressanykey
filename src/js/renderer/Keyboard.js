function Keyboard(parameters) {

	this.el = document.querySelectorAll('main')[0];
	this.canvas = document.getElementsByTagName('canvas')[0];

	paper.setup(this.canvas);
	this.attachEvents();

	this.keyboard = undefined;

	this.debug = {
		center: undefined
	}

	// this.resize();
	paper.project.importSVG('../keyboard.svg', { onLoad: this.initKeyboard.bind(this) });
}

Keyboard.prototype.attachEvents = function() {

	window.addEventListener('keypress', function(e) {

		console.log(e.keyCode);

		var char = String.fromCharCode(e.keyCode);
		
		this.addToPath(e.key);
		console.log(char, e.key);
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
	this.debug.center.opacity = 0;

	// Responsive
	this.keyboard.setPosition(paper.view.viewSize.width/2, paper.view.viewSize.height/2);

	paper.view.draw();

}

Keyboard.prototype.initKeyboard = function(keyboard, svg) {

	// Debug
	this.debug.center = new paper.Shape.Circle(new paper.Point(80, 50), 2);
	this.debug.center.fillColor = "red";

	// Keyboard
	this.keyboard = keyboard.children[0];

	this.keyboard.style = {
		fillColor: "#808080",
		strokeColor: new paper.Color(1,1,1,0.4),
		strokeWidth: 1.5,
		shadowColor: new paper.Color(0,0,0,0.45),
		shadowBlur: 4,
		shadowOffset: new paper.Point(0, 2),
		borderRadius: 8
	}

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

	};

	this.resize();

}

Keyboard.prototype.addToPath = function(key) {

	// console.log(this.keyboard.children);
	this.keyboard.strokeColor = "red";

}