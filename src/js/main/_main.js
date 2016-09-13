function pad(n) { return ("0" + n).slice(-2); }
var Console = require('console').Console;
var fs = require('fs');
var output = fs.createWriteStream('./stdout.log');
var c = new Console(output);

var hrs = pad(new Date().getHours());
var min = pad(new Date().getMinutes());
var sec = pad(new Date().getSeconds());
var time = hrs + ':' + min + ':' + sec;

c.log('');
c.log('--------');
c.log(time);
c.log('--------');
c.log('');


function CommandManager() {

	this.template = undefined;
	this.menu = undefined;
	c.log('[Command Manager] ✔');

	this.createMenus();

}

CommandManager.prototype.createMenus = function() {
	var name = app.getName();
	this.template = [
		{
			label: name,
			submenu: [
				{
					label: 'About ' + name,
					role: 'about'
				},
				{
					label: 'Version ' + app.getVersion(),
					enabled: false
				},
				{
					type: 'separator'
				},
				{
					label: 'Hide ' + name,
					accelerator: 'CmdOrCtrl+H',
					role: 'hide'
				},
				{
					label: 'Hide Others',
					accelerator: 'CmdOrCtrl+Alt+H',
					role: 'hideothers'
				},
				{
					label: 'Show All',
					role: 'unhide'
				},
				{
					type: 'separator'
				},
				{
					label: 'Quit',
					accelerator: 'CmdOrCtrl+Q',
					click: function() { app.quit() }
				}
			]
		},
		{
			label: 'Special',
			submenu: [
				{
					label: 'Fullscreen',
					accelerator: 'Cmd+Ctrl+F',
					type: 'checkbox',
					click: function() {
						Keyboard.toggleFullScreen();
					}
				}
			]
		}
	];
	this.menu = Menu.buildFromTemplate(this.template);
	Menu.setApplicationMenu(this.menu);
}
function Keyboard() {

	app.on('window-all-closed', function() {
	    app.quit();
	});

	c.log('[Keyboard] ✔');

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

	this.browserWindow.webContents.openDevTools();

}

Keyboard.prototype.attachEvents = function() {

	this.browserWindow.webContents.on('dom-ready', this.onReady.bind(this));

	ipcMain.on('print', function(event, text, blob, svg) {
		this.startPrinting(text, blob, svg);
	}.bind(this));

}

Keyboard.prototype.onReady = function() {

	this.browserWindow.webContents.send('ready');
	this.browserWindow.show();

}

Keyboard.prototype.toggleFullScreen = function() {

	c.log('FULLSCREEN');

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
		if(err) c.log(err);
	});

	// Save Text
	fs.writeFile(this.outputFolder + txtFileName, text, function(err) {
		if(err) c.log(err);
	});

}
'use strict';
process.env['PATH'] ='/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

var electron = require('electron');
var electronScreen = undefined;
var ipcMain = require('electron').ipcMain;
var Menu = require('electron').Menu;
var MenuItem = require('electron').MenuItem;
var app = electron.app;
var Tray = electron.Tray;
const {clipboard} = require('electron');
var electronLocalshortcut = require('electron-localshortcut');
var BrowserWindow = electron.BrowserWindow;
var path = require('path');
var fs = require('fs');
var shell = require('electron').shell;
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var gm = require('gm');

app.on('ready', function() {

	electronScreen = electron.screen;

	CommandManager = new CommandManager();
	Keyboard = new Keyboard();

});