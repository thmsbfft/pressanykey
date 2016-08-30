var SerialPort = require('serialport');
var serialPort = new SerialPort('/dev/cu.usbserial', { baudrate: 9600 });
var Printer = require('thermalprinter');

process.argv.forEach(function(val, index) {
	console.log(`${index}: ${val}`);
});

var text = decodeURI(process.argv[2]);
var imagePath = __dirname + '/images/' + process.argv[3];

console.log('Text: ', text);
console.log('Image: ', imagePath);

serialPort.on('open', function() {
	var printer = new Printer(serialPort);
	printer.on('ready', function() {
		printer
			.upsideDown(true)
			.center(true)
			.printLine('')
			.printLine(text)
			.printImage(imagePath)
			.printLine('')
			.printLine('')
			.printLine('')
			.print(function() {
				console.log('done');
				process.exit();
			});
	});
});

// SerialPort.list(function(err, ports) {
// 	ports.forEach(function(port) {
// 	    console.log(port.comName);
// 	    console.log(port.pnpId);
// 	    console.log(port.manufacturer);
// 	 });
// });