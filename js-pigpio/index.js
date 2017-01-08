const def = require('./definitions.js');
const net = require('net');
const Put = require('put');

const _LOCKS = [];

/** @constructor */
function pigpio() {}

/**
 *
 * Connects to the pigpio daemon.
 *
 * This method has to be called before it's possible to do anything with
 * the GPIO pins.
 *
 * The callback will be called when the connection has been established or
 * if an error occurs.
 *
 * @param {string} [host] - The host to connect to
 * @param {number} [port] - The port on the host to connect to
 * @param {function} [cb] - Callback function
 */
pigpio.prototype.pi = function(host, port, cb) {
    if (host === undefined) {
        host = process.env.PIGPIO_ADDR || 'localhost';
    }
    if (port === undefined) {
        port =  process.env.PIGPIO_PORT || '8888';
    }
    this.client = net.connect({host: host, port: port});

    this.client.on('connect', function() {
        // Disable the Nagle algoritm
        this.client.setNoDelay(true);

        cb();
    }.bind(this));

    this.client.on('error', function(e) {
        cb(e);
    });
};

/**
 * Half-closes the connection. We might still get some data from the server.
 */
pigpio.prototype.close = function() {
    this.client.end();
};

/**
 * Starts (500-2500) or stops (0) servo pulses on the given gpio pin.
 *
 * The selected pulsewidth will continue to be transmitted until
 * changed by a subsequent call to set_servo_pulsewidth.
 *
 * The pulsewidths supported by servos varies and should probably
 * be determined by experiment. A value of 1500 should always be
 * safe and represents the mid-point of rotation.
 *
 * You can DAMAGE a servo if you command it to move beyond its
 * limits.
 *
 *     gpio.setServoPulsewidth(17, 0)    # off
 *     gpio.setServoPulsewidth(17, 1000) # safe anti-clockwise
 *     gpio.setServoPulsewidth(17, 1500) # centre
 *     gpio.setServoPulsewidth(17, 2000) # safe clockwise
 *
 * @param {number} userGpio The number of the gpio to address. 0-31.
 * @param {number} pulsewidth The servo pulsewidth to generate
 *              0 (off),
 *              500 (most anti-clockwise) - 2500 (most clockwise).
 */
pigpio.prototype.setServoPulsewidth = function(userGpio, pulsewidth) {
    var cmd = Put()
        .word32le(def.PI_CMD_SERVO) // _PI_CMD_SERVO
        .word32le(userGpio)
        .word32le(pulsewidth)
        .word32le(0); // Not used

    this.client.write(cmd.buffer());
};

/**
 * Starts (non-zero dutycycle) or stops (0) PWM pulses on the gpio.
 *
 *     pi.set_PWM_dutycycle(4,   0) # PWM off
 *     pi.set_PWM_dutycycle(4,  64) # PWM 1/4 on
 *     pi.set_PWM_dutycycle(4, 128) # PWM 1/2 on
 *     pi.set_PWM_dutycycle(4, 192) # PWM 3/4 on
 *     pi.set_PWM_dutycycle(4, 255) # PWM full on
 *
 * @param {number} userGpio The number of the gpio to address. 0-31
 * @param {number} dutycycle The pwm dutycycle to use.
 *              0 (off),
 *              255 (full on)
 */
pigpio.prototype.setPwmDutycycle = function(userGpio, dutycycle) {
    var cmd = Put()
        .word32le(def.PI_CMD_PWM)
        .word32le(userGpio)
        .word32le(dutycycle)
        .word32le(0);

    this.client.write(cmd.buffer());
};

pigpio.prototype.getHardwareRevision = function (cb) {
    var cmd = Put()
        .word32le(def.PI_CMD_HWVER)
        .word32le(0)
        .word32le(0)
        .word32le(1);

    this.client.write(cmd.buffer());

};

function pi_gpio_command(command, p1, p2, next) {
    var cmd = Put()
        .word32le(command)
        .word32le(p1)
        .word32le(p2)
        .word32le(1);

    if(!this.client.write(cmd.buffer())) {
        next(new Error("Error Sending Command to Pi: "+command));
    }
}

module.exports = pigpio;
