var Pigpio = require('../js-pigpio/index.js');

const HOST = 'pigpio.hopto.org';
const PORT = 8888;


var PiGPIO = new Pigpio();

PiGPIO.pi(HOST, PORT, (err) => {
    if (err) throw err;

    PiGPIO.callback(4, PiGPIO.EITHER_EDGE, (gpio, level, tick) => {
        "use strict";
        console.log("CALLBACK FIRED!!!!!");
        console.log(gpio);
        console.log(level);
        console.log(tick);
        console.log("Done");
    });
});