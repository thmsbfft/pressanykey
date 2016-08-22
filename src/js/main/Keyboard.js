function Keyboard() {

	app.on('window-all-closed', function() {
	    app.quit();
	});

	// @if NODE_ENV='development'
	c.log('[Keyboard] ✔');
	// @endif

	this.isFullScreen = false;
	this.frame = new BrowserWindow({
	  width: 800,
	  height: 600,
	  frame: false,
	  backgroundColor: '#141414',
	  show: false,
	  minWidth: 600,
	  minHeight: 350,
	  darkTheme: true,
	});

	this.frame.loadURL('file://' + __dirname + '/src/html/index.html' + '#' + this.id);

	this.attachEvents();

	// @if NODE_ENV='development'
	this.frame.webContents.openDevTools();
	// @endif

}

Keyboard.prototype.attachEvents = function() {

	this.frame.webContents.on('dom-ready', this.onReady.bind(this));

}

Keyboard.prototype.onReady = function() {

	this.frame.webContents.send('ready');
	this.frame.show();

}

Keyboard.prototype.toggleFullScreen = function() {

	// @if NODE_ENV='development'
	c.log('FULLSCREEN');
	c.log(this);
	// @endif

	this.isFullScreen = !this.isFullScreen;
	this.frame.setFullScreen(this.isFullScreen);

}