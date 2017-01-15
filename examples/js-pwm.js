var Pigpio = require('../js-pigpio/index.js');

var LED_1_GPIO = 24;
var LED_2_GPIO = 25;
var HOST = '192.168.1.4';
var PORT = 8888;

var run = true;
var dcStates = [0, 16, 64, 128, 255]; // dutycycle, 0 - 255
var dcIndex = 0;

var PiGPIO = new Pigpio();

PiGPIO.pi(HOST, PORT, (err) => {
    if (err) throw err;

    setTimeout(() => { run = false; }, 20000);

    var pwmUpdateInterval = setInterval(() => {
        PiGPIO.set_PWM_dutycycle(LED_1_GPIO, dcStates[dcIndex]);
        PiGPIO.set_PWM_dutycycle(LED_2_GPIO, dcStates[4 - dcIndex]);

        dcIndex += 1;
        if (dcIndex > 4) {
            dcIndex = 0;
        }

        if (!run) {
            PiGPIO.set_PWM_dutycycle(LED_1_GPIO, 0); // pwm off
            PiGPIO.set_PWM_dutycycle(LED_2_GPIO, 0); // pwm off
            PiGPIO.close();
            clearInterval(pwmUpdateInterval);
        }
    }, 1000);
});

