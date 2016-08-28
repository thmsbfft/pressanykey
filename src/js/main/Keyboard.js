function Keyboard() {

	app.on('window-all-closed', function() {
	    app.quit();
	});

	// @if NODE_ENV='development'
	c.log('[Keyboard] ✔');
	// @endif

	// this.outputFolder = app.getPath('home') + '/pressanykey/';
	this.outputFolder = __dirname + '/images/';
	c.log(this.outputFolder);

	this.isFullScreen = false;
	this.browserWindow = new BrowserWindow({
	  width: 1500,
	  height: 700,
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

	// ipcMain.on('print', function(event, text, svg) {
	// 	this.startPrinting(text, svg);
	// }.bind(this));

	ipcMain.on('print', function(event, text, blob, svg) {
		this.startPrinting(text, blob, svg);
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

Keyboard.prototype.decodeBase64Image = function(dataString) {

	var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
	    response = {};

	  if (matches.length !== 3) {
	    return new Error('Invalid input string');
	  }

	  response.type = matches[1];
	  response.data = new Buffer(matches[2], 'base64');

	  return response;

}

Keyboard.prototype.startPrinting = function(text, blob, svg) {

	var day = pad(new Date().getDate());
	var month = pad(new Date().getMonth() + 1);
	var year = new Date().getFullYear();
	var date = day + '-' + month + '-' + year;

	var hrs = pad(new Date().getHours());
	var min = pad(new Date().getMinutes());
	var sec = pad(new Date().getSeconds());
	var time = hrs + '-' + min + '-' + sec;

	var svgFileName = date + '-' + time + '.svg';
	var jpgFileName = date + '-' + time + '.jpg';
	var txtFileName = date + '-' + time + '.txt';

	var imageBuffer = this.decodeBase64Image(blob);

	fs.writeFile(this.outputFolder + jpgFileName, imageBuffer.data, function(err) {
		if(err) throw err;
		c.log('Saved');

		// Resize image for printer
		gm(this.outputFolder + jpgFileName)
			.resize(384)
			.flop()
			.flip()
			.write(this.outputFolder + jpgFileName, function(err) {
				if(err) throw err;
				
				c.log('Done resizing');

				// Send to printer script
				exec('node printer.js' + ' ' +'"'+ encodeURI(text) +'"'+ ' ' + jpgFileName, function (error, stdout, stderr) {
					if(error == null) c.log('Printed');
					if(error) c.log(error);
				}.bind(this));

			}.bind(this));
	}.bind(this));

	// Save SVG
	fs.writeFile(this.outputFolder + svgFileName, svg, function(err) {
		// @if NODE_ENV='development'
		if(err) c.log(err);
		// @endif
	});

	// Save Text
	fs.writeFile(this.outputFolder + txtFileName, text, function(err) {
		// @if NODE_ENV='development'
		if(err) c.log(err);
		// @endif
	});

}