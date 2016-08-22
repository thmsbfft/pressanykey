function CommandManager() {

	this.template = undefined;
	this.menu = undefined;
	// @if NODE_ENV='development'
	c.log('[Command Manager] ✔');
	// @endif

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