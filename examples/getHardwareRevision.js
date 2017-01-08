const Pigpio = require('../js-pigpio/index.js');

const HOST = '192.168.1.4';
const PORT = 8888;

const PiGPIO = new Pigpio();

PiGPIO.pi(HOST, PORT, (err) => {
    if (err) throw err;

    PiGPIO.getHardwareRevision((err, data) => {

        console.log (data); /* eslint-disable-line no-console*/
    });
});

