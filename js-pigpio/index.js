const def = require('./definitions.js');
const net = require('net');
const assert = require('assert');
const Put = require('put');
const reverse_string = require('./utils.js').reverse_string;

const _LOCKS = [];

/** @class */
function pigpio() {
    "use strict";

}

pigpio.prototype = {
// GPIO levels
    OFF: 0,
    LOW: 0,
    CLEAR: 0,

    ON: 1,
    HIGH: 1,
    SET: 1,

    TIMEOUT: 2,

// GPIO edges

    RISING_EDGE: 0,
    FALLING_EDGE: 1,
    EITHER_EDGE: 2,

// GPIO modes

    INPUT: 0,
    OUTPUT: 1,
    ALT0: 4,
    ALT1: 5,
    ALT2: 6,
    ALT3: 7,
    ALT4: 3,
    ALT5: 2,

// GPIO Pull Up Down

    PUD_OFF: 0,
    PUD_DOWN: 1,
    PUD_UP: 2
};


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
 * @param {string} [host] - The host to connect to.
 * @param {number} [port] - The port on the host to connect to.
 * @param {Object} [cb] - Callback function.
 */
pigpio.prototype.pi = function(host, port, cb) {
    "use strict";
    const that = this;
    if (host === undefined) {
        host = process.env.PIGPIO_ADDR || 'localhost';
    }
    if (port === undefined) {
        port =  process.env.PIGPIO_PORT || '8888';
    }
    this.client = net.connect({host, port});

    this.client.on('connect', () => {
        // Disable the Nagle algoritm
        this.client.setNoDelay(true);

        cb();
    });
    this.client.on("data", (data) => {
        that._releaseLock();
        if (that._next !== undefined) {
            that._next(undefined, reverse_string(data.toString('hex')));
        }

    });

    this.client.on('error', (e) => {
        cb(e);
    });
};

/**
 * Half-closes the connection. We might still get some data from the server.
 */
pigpio.prototype.close = function() {
    "use strict";
    this.client.end();
};

/**
 *
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
 * @example
 *     gpio.setServoPulsewidth(17, 0)    # off
 *     gpio.setServoPulsewidth(17, 1000) # safe anti-clockwise
 *     gpio.setServoPulsewidth(17, 1500) # centre
 *     gpio.setServoPulsewidth(17, 2000) # safe clockwise
 *
 * @param {number} userGpio - The number of the gpio to address. 0-31.
 * @param {number} pulseWidth - The servo pulsewidth to generate
 *              0 (off),
 *              500 (most anti-clockwise) - 2500 (most clockwise).
 */
pigpio.prototype.setServoPulsewidth = function(userGpio, pulseWidth) {
    "use strict";
    assert(userGpio>=0 && userGpio <=31, "userGpio must be in the range 0-31");
    assert(pulseWidth>=0 && pulseWidth <=2500, "pulsWidth must be in the range 0-2500");
    this._pi_gpio_command(def.PI_CMD_SERVO, userGpio, pulseWidth);
};

/**
 * Starts (non-zero dutycycle) or stops (0) PWM pulses on the gpio.
 *
 * @example
 *     pi.set_PWM_dutycycle(4,   0) # PWM off
 *     pi.set_PWM_dutycycle(4,  64) # PWM 1/4 on
 *     pi.set_PWM_dutycycle(4, 128) # PWM 1/2 on
 *     pi.set_PWM_dutycycle(4, 192) # PWM 3/4 on
 *     pi.set_PWM_dutycycle(4, 255) # PWM full on
 *
 * @param {number} userGpio - The number of the gpio to address (0-31).
 * @param {number} dutycycle - The pwm dutycycle to use:
 *              0 (off),
 *              255 (full on).
 */
pigpio.prototype.setPwmDutycycle = function(userGpio, dutycycle) {
    "use strict";
    assert(userGpio>=0 && userGpio <=31, "userGpio must be in the range 0-31");
    assert(dutycycle>=0 && dutycycle <=255, "dutycycle must be in the range 0-255");
    this._pi_gpio_command(def.PI_CMD_PWM, userGpio, dutycycle);
};


/**
 *
 * Returns the Pi's hardware revision number.
 *
 * The hardware revision is the last few characters on the Revision line of /proc/cpuinfo.
 * The revision number can be used to determine the assignment of GPIO to pins (see [*gpio*]).
 * There are at least three types of board.
 * * Type 1 boards have hardware revision numbers of 2 and 3.
 * * Type 2 boards have hardware revision numbers of 4, 5, 6, and 15.
 * * Type 3 boards have hardware revision numbers of 16 or greater.
 * * If the hardware revision can not be found or is not a valid hexadecimal number the function returns 0.
 *
 * @param {callback} cb - Callback that will receive the result in form of function (err, data).
 */
pigpio.prototype.getHardwareRevision = function(cb) {
    "use strict";
    this._pi_gpio_command(def.PI_CMD_HWVER, 0, 0, cb, true);

};

/**
 * Sets the GPIO mode.
 *
 * @param {number} gpio - Port 0-53.
 * @param {string} mode - Must be either INPUT, OUTPUT, ALT0, ALT1, ALT2, ALT3, ALT4 or ALT5.
 */
pigpio.prototype.set_mode = function (gpio, mode) {
    "use strict";
    assert(gpio>=0 && gpio <=53, "userGpio must be in the range 0-31");
    assert([this.INPUT, this.OUTPUT, this.ALT0, this.ALT1, this.ALT2, this.ALT3, this.ALT4, this.ALT5].includes(mode), "Mode must be INPUT, OUTPUT, ALT0, ALT1, ALT2, ALT3, ALT4, ALT5");
    this._pi_gpio_command(def.PI_CMD_MODES, gpio, mode);

};

pigpio.prototype._pi_gpio_command = function(command, parameter1, parameter2, next, wait_for_response) {
    "use strict";
    const cmd = Put()
        .word32le(command)
        .word32le(parameter1)
        .word32le(parameter2)
        .word32le(0);
    this._acquireLock();
    if(!this.client.write(cmd.buffer())) {
        next(new Error("Error Sending Command to Pi: "+command));
    }
    if(wait_for_response) {
        this._next = next;
    } else {
        this._releaseLock();
        if( next !== undefined) {
            next();
        }
    }
};

pigpio.prototype._acquireLock = function () {
    "use strict";
    if (_LOCKS[this.host+':'+this.port] === undefined) {
        _LOCKS[this.host+':'+this.port] = 'Locked';
    } else {
        throw new Error ('Can not acquire Lock');
    }
};

pigpio.prototype._releaseLock = function () {
    "use strict";
    if (_LOCKS[this.host+':'+this.port] !== undefined) {
        _LOCKS[this.host+':'+this.port] = undefined;
    }
};

module.exports = pigpio;
