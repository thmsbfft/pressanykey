function Keyboard() {

	app.on('window-all-closed', function() {
	    app.quit();
	});

	// @if NODE_ENV='development'
	c.log('[Keyboard] ✔');
	// @endif

	this.outputFolder = app.getPath('home') + '/pressanykey/';
	c.log(this.outputFolder);

	this.isFullScreen = false;
	this.browserWindow = new BrowserWindow({
	  width: 800,
	  height: 600,
	  frame: false,
	  backgroundColor: '#141414',
	  show: false,
	  minWidth: 600,
	  minHeight: 350,
	  darkTheme: true,
	});

	this.browserWindow.loadURL('file://' + __dirname + '/src/html/index.html' + '#' + this.id);

	this.attachEvents();

	// @if NODE_ENV='development'
	this.browserWindow.webContents.openDevTools();
	// @endif

}

Keyboard.prototype.attachEvents = function() {

	this.browserWindow.webContents.on('dom-ready', this.onReady.bind(this));

	ipcMain.on('print', function(event, text, svg) {
		this.startPrinting(text, svg);
	}.bind(this));

}

Keyboard.prototype.onReady = function() {

	this.browserWindow.webContents.send('ready');
	this.browserWindow.show();

}

Keyboard.prototype.toggleFullScreen = function() {

	// @if NODE_ENV='development'
	c.log('FULLSCREEN');
	// @endif

	this.isFullScreen = !this.isFullScreen;
	this.browserWindow.setFullScreen(this.isFullScreen);

}

Keyboard.prototype.startPrinting = function(text, svg) {

	var day = pad(new Date().getDate());
	var month = pad(new Date().getMonth() + 1);
	var year = new Date().getFullYear();
	var date = day + '-' + month + '-' + year;

	var hrs = pad(new Date().getHours());
	var min = pad(new Date().getMinutes());
	var sec = pad(new Date().getSeconds());
	var time = hrs + '-' + min + '-' + sec;

	var fileName = date + '-' + time + '-' + text + '.svg';

	fs.writeFile(this.outputFolder + fileName, svg, function(err) {
		// @if NODE_ENV='development'
		if(err) c.log(err);
		// @endif
	});

	svg_to_png.convert(this.outputFolder + fileName, this.outputFolder, {defaultWidth: "384px"})
	.then( function(){
		// sharp(this.outputFolder + fileName)
		// 	.resize(384)
		// 	.toFile(this.outputFolder + fileName, function(err) {
		// 		c.log(err);
		// 	});
	});

	// @if NODE_ENV='development'
	c.log('PRINTING');
	c.log(text);
	c.log(svg);
	// @endif

}