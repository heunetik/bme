const express = require('express');
const app = express();
const BME280 = require('./BME280.js');
const barometer = new BME280({address: 0x76});

app.use(express.static('public'));

app.get('/', (req, res) => {
  //send the index.html file for all requests
  res.sendFile(__dirname + '/index.html');
});

server = app.listen(3000);

const io = require("socket.io")(server);

barometer.begin((err) => {
	if (err) {
		console.info('error initializing barometer', err);
		return;
	}

	console.info('barometer running');

	setInterval(() => {
		barometer.readPressureAndTemparature((err, pressure, temperature, humidity) => {
            		let data = {
                		"temp" : temperature.toFixed(2),
                		"pressure" : (pressure / 100).toFixed(2),
                		"humidity" : humidity.toFixed(2)
            		}
			io.emit('data', data);
		});
	}, 5000);
});
