var SerialPort = require('serialport');
// var serialPort = new SerialPort('/dev/ttyUSB0', { baudrate: 9600 });
var Printer = require('thermalprinter');

SerialPort.list(function(err, ports) {
	ports.forEach(function(port) {
	    console.log(port.comName);
	    console.log(port.pnpId);
	    console.log(port.manufacturer);
	 });
});

// serialPort.on('open', function() {
// 	var printer = new Printer(serialPort);
// 	printer.on('ready', function() {
// 		printer
// 			.indent(10)
// 			.horizontalLine(16)
// 			.bold(true)
// 			.indent(10)
// 			.printLine('first line')
// 			.print(function() {
// 				console.log('done');
// 				process.exit();
// 			});
// 	});
// });