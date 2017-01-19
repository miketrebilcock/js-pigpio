/* eslint-env node */

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
    assert_gpio_pin_in_range(userGpio,0,31);
    assert(pulseWidth>=0 && pulseWidth <=2500, "pulsWidth must be in the range 0-2500");
    this._pi_gpio_command(def.PI_CMD_SERVO, userGpio, pulseWidth);
};

/**
 * Returns the GPIO level.
 *
 * @param {number} userGpio - The number of the gpio to address. 0-31.
 * @param {callback} cb - The function to be called with the result.
 */
pigpio.prototype.read = function (userGpio, cb) {
    "use strict";
    assert_gpio_pin_in_range(userGpio,0,31);
    this._pi_gpio_command(def.PI_CMD_READ, userGpio, 0, cb, true);
};

/**
 * Returns the GPIO level.
 *
 * @param {number} userGpio - The number of the gpio to address. 0-31.
 * @param {number} level - The output level 0 or 1.
 */
pigpio.prototype.write = function (userGpio, level) {
    "use strict";
    assert_gpio_pin_in_range(userGpio,0,31);
    this._pi_gpio_command(def.PI_CMD_WRITE, userGpio, level, undefined, true);
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
pigpio.prototype.set_PWM_dutycycle = function(userGpio, dutycycle) {
    "use strict";
    assert_gpio_pin_in_range(userGpio,0,31);
    assert(dutycycle>=0 && dutycycle <=255, "dutycycle must be in the range 0-255");
    this._pi_gpio_command(def.PI_CMD_PWM, userGpio, dutycycle, undefined, true);
};

/**
 * Returns the PWM dutycycle being used on the GPIO.
 *
 * For normal PWM the dutycycle will be out of the defined range
 * for the GPIO (see [*get_PWM_range*]).
 * If a hardware clock is active on the GPIO the reported
 * dutycycle will be 500000 (500k) out of 1000000 (1M).
 * If hardware PWM is active on the GPIO the reported dutycycle
 * will be out of a 1000000 (1M).
 *
 * @param {number} userGpio - The number of the gpio to address (0-31).
 * @param {callback} cb - Function that the value will be passed back to in form function(err, data).
 */
pigpio.prototype.get_PWM_dutycycle = function(userGpio, cb) {
    "use strict";
    assert_gpio_pin_in_range(userGpio,0,31);
    this._pi_gpio_command(def.PI_CMD_GDC, userGpio, 0, cb, true);
};

/**
 * Sets the range of PWM values to be used on the GPIO.
 *
 * @param {number} userGpio - The number of the gpio to address (0-31).
 * @param {number} range - A number in the range 25-40000.
 *
 * @example
 *  pi.set_PWM_range(9, 100)  // now  25 1/4,   50 1/2,   75 3/4 on
 *  pi.set_PWM_range(9, 500)  // now 125 1/4,  250 1/2,  375 3/4 on
 *  pi.set_PWM_range(9, 3000) // now 750 1/4, 1500 1/2, 2250 3/4 on
 */
pigpio.prototype.set_PWM_range = function (userGpio, range) {
    "use strict";
    assert_gpio_pin_in_range(userGpio,0,31);
    assert(range>=25 && range <=40000, "range must be in the range 25-40000.");
    this._pi_gpio_command(def.PI_CMD_PRS, userGpio, range, undefined, true);
};

/**
 * Returns the range of PWM values being used on the GPIO.
 * If a hardware clock or hardware PWM is active on the GPIO the reported range will be 1000000 (1M).
 *
 * @param {number} userGpio - The number of the gpio to address (0-31).
 * @param {callback} cb - Function that the value will be passed back to in form function(err, data).
 */
pigpio.prototype.get_PWM_range = function(userGpio, cb) {
    "use strict";
    assert_gpio_pin_in_range(userGpio,0,31);
    this._pi_gpio_command(def.PI_CMD_PRG, userGpio, 0, cb, true);
};

/**
 * Returns the real (underlying) range of PWM values being used on the GPIO.
 *
 * If a hardware clock is active on the GPIO the reported real range will be 1000000 (1M).
 * If hardware PWM is active on the GPIO the reported real range
 * will be approximately 250M divided by the set PWM frequency.
 *
 * @param {number} userGpio - The number of the gpio to address (0-31).
 * @param {callback} cb - Function that the value will be passed back to in form function(err, data).
 */
pigpio.prototype.get_PWM_real_range = function(userGpio, cb) {
    "use strict";
    assert_gpio_pin_in_range(userGpio,0,31);
    this._pi_gpio_command(def.PI_CMD_PRRG, userGpio, 0, cb, true);
};


/**
 * Sets the frequency (in Hz) of the PWM to be used on the GPIO.
 *
 * If PWM is currently active on the GPIO it will be switched
 * off and then back on at the new frequency.
 * Each GPIO can be independently set to one of 18 different PWM frequencies.
 * The selectable frequencies depend upon the sample rate which
 * may be 1, 2, 4, 5, 8, or 10 microseconds (default 5).
 * The sample rate is set when the pigpio daemon is started.
 *
 * The frequencies for each sample rate are:
 * hertz
 *      1:   40000 20000 10000 8000 5000 4000 2500 2000 1600
 *            1250  1000   800  500  400  250  200  100   50
 *      2:   20000 10000  5000 4000 2500 2000 1250 1000  800
 *             625   500   400  250  200  125  100   50   25
 *      4:   10000  5000  2500 2000 1250 1000  625  500  400
 *             313   250   200  125  100   63   50   25   13
 * sample
 * rate
 * (us)  5:  8000  4000  2000 1600 1000  800  500  400  320
 *            250   200   160  100   80   50   40   20   10
 *       8:  5000  2500  1250 1000  625  500  313  250  200
 *            156   125   100   63   50   31   25   13    6
 *      10:  4000  2000  1000  800  500  400  250  200  160
 *            125   100    80   50   40   25   20   10    5.
 *
 * @param {number} userGpio - The number of the gpio to address (0-31).
 * @param {number} frequency - Frequency >=0 Hz.
 */
pigpio.prototype.set_PWM_frequency = function (userGpio, frequency) {
    "use strict";
    assert_gpio_pin_in_range(userGpio,0,31);
    assert(frequency>=0, "frequency must be greater than or equal to 0");
    this._pi_gpio_command(def.PI_CMD_PFS, userGpio, frequency);
};

/**
 * Returns the frequency of PWM being used on the GPIO.
 *
 * @param {number} userGpio - The number of the gpio to address (0-31).
 * @param {callback} cb - Function that the value will be passed back to in form function(err, data).
 */
pigpio.prototype.get_PWM_frequency = function(userGpio, cb) {
    "use strict";
    assert_gpio_pin_in_range(userGpio,0,31);
    this._pi_gpio_command(def.PI_CMD_PFG, userGpio, 0, cb, true);
};

/*

 */

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
    assert_gpio_pin_in_range(gpio,0,53);
    assert([this.INPUT, this.OUTPUT, this.ALT0, this.ALT1, this.ALT2, this.ALT3, this.ALT4, this.ALT5].includes(mode), "Mode must be INPUT, OUTPUT, ALT0, ALT1, ALT2, ALT3, ALT4, ALT5");
    this._pi_gpio_command(def.PI_CMD_MODES, gpio, mode);

};

/**
 * Returns the GPIO mode.
 *
 * @param {number} gpio - Port 0-53.
 * @param {callback} callback - Function to be run when the data has been received.
 */
pigpio.prototype.get_mode = function (gpio, callback) {
    "use strict";
    assert_gpio_pin_in_range(gpio,0,53);
    this._pi_gpio_command(def.PI_CMD_MODEG, gpio, 0, callback, true);
}

/**
 * Sets or clears the internal GPIO pull-up/down resistor.
 *
 * @param {number} gpio - Port 0-53.
 * @param {string} pud - Must be either PUD_UP, PUD_DOWN, PUD_OFF.
 */
pigpio.prototype.set_pull_up_down = function (gpio, pud) {
    "use strict";
    assert_gpio_pin_in_range(gpio,0,53);
    assert([this.PUD_DOWN, this.PUD_OFF, this.PUD_UP].includes(pud), "pud must be PUD_UP, PUD_DOWN, PUD_OFF");
    this._pi_gpio_command(def.PI_CMD_PUD, gpio, pud);

};

/**
 * Sets a glitch filter on a GPIO.
 *
 * Level changes on the GPIO are not reported unless the level
 * has been stable for at least [*steady*] microseconds.  The
 * level is then reported.  Level changes of less than [*steady*]
 * microseconds are ignored.
 *
 * @param {number} gpio - Port 0-31.
 * @param {number} steady - Number of setmicroseconds after detection before a change is confirmed.
 */
pigpio.prototype.set_glitch_filter = function (gpio, steady) {
    "use strict";
    assert_gpio_pin_in_range(gpio,0,31);
    assert(steady>=0 && steady<=300000, "steady must be in the range 0 - 30000");
    this._pi_gpio_command(def.PI_CMD_FG, gpio, steady);
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
/* eslint: no-unmodified-loop-condition */
pigpio.prototype._acquireLock = function () {
    "use strict";
    let timeout = false;
    setTimeout(()=>{
        timeout = true
    }, 500);
    /* eslint-disable no-unmodified-loop-condition */
    while (!timeout && _LOCKS[this.host+':'+this.port] !== undefined) {
        if (_LOCKS[this.host + ':' + this.port] === undefined) {
            _LOCKS[this.host + ':' + this.port] = 'Locked';
        } else {
            throw new Error('Can not acquire Lock');
        }
    }
    /* eslint-disable no-unmodified-loop-condition */
};

pigpio.prototype._releaseLock = function () {
    "use strict";
    if (_LOCKS[this.host+':'+this.port] !== undefined) {
        _LOCKS[this.host+':'+this.port] = undefined;
    }
};

function assert_gpio_pin_in_range (gpio, low , high) {
    "use strict";
    assert(gpio>=low && gpio <=high, 'userGpio must be in the range ' + low + '-' + high + '31');
}

module.exports = pigpio;
