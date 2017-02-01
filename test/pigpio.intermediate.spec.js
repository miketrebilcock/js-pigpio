/* global it describe context */
/* eslint-env node, mocha */

const assert = require('chai').assert;
const expect = require('chai').expect;
const PiGPIO = require('../js-pigpio/index.js');
const testServer = require ('./testhelper.js').testServer;
let server;

describe('intermediate', () => {


    const port = 5003;

    before(()=> {
        server = new testServer(port);
    });

    it('set_PWM_frequency', (done) => {
        const pigpio = new PiGPIO();
        pigpio.pi('127.0.0.1', port, () => {
            "use strict";
            pigpio.set_PWM_frequency(2,15);
            setTimeout((done)=>{
                server.assert_correct_message_sent(7, 2, 15);
                done();
            }, 100, done);
            pigpio.close();
        });
    });

    it('set_PWM_dutycycle - errors when out of range gpiopin sent', () => {
        const pigpio = new PiGPIO();
        pigpio.pi('127.0.0.1', port, () => {
            "use strict";
            expect(() => {
                pigpio.set_PWM_frequency(-1);
            }).to.throw(Error);
            expect(() => {
                pigpio.set_PWM_frequency(32);
            }).to.throw(Error);
            expect(() => {
                pigpio.set_PWM_frequency();
            }).to.throw(Error);
            pigpio.close();
        });
    });

    it('set_PWM_dutycycle - errors when out of range frequency sent', () => {
        const pigpio = new PiGPIO();
        pigpio.pi('127.0.0.1', port, () => {
            "use strict";
            expect(() => {
                pigpio.set_PWM_frequency(3,-1);
            }).to.throw(Error);
            expect(() => {
                pigpio.set_PWM_frequency(4, 0);
            }).to.throw(Error);
            expect(() => {
                pigpio.set_PWM_frequency();
            }).to.throw(Error);
            pigpio.close();
        });
    });

    it('set_PWM_range', (done) => {
        const pigpio = new PiGPIO();
        pigpio.pi('127.0.0.1', port, () => {
            "use strict";
            pigpio.set_PWM_range(2,25);
            setTimeout((done)=>{
                server.assert_correct_message_sent(6, 2, 25);
                done();
            }, 100, done);
            pigpio.close();
        });
    });

    it('set_PWM_range - errors when out of range gpiopin sent', () => {
        const pigpio = new PiGPIO();
        pigpio.pi('127.0.0.1', port, () => {
            "use strict";
            expect(() => {
                pigpio.set_PWM_range(-1);
            }).to.throw(Error);
            expect(() => {
                pigpio.set_PWM_range(32);
            }).to.throw(Error);
            expect(() => {
                pigpio.set_PWM_range();
            }).to.throw(Error);
            pigpio.close();
        });
    });

    it('set_PWM_range - errors when out-of-range range sent', () => {
        const pigpio = new PiGPIO();
        pigpio.pi('127.0.0.1', port, () => {
            "use strict";
            expect(() => {
                pigpio.set_PWM_range(3,24);
            }).to.throw(Error);
            expect(() => {
                pigpio.set_PWM_range(4, 0);
            }).to.throw(Error);
            expect(() => {
                pigpio.set_PWM_range(4, 40000);
            }).to.throw(Error);
            expect(() => {
                pigpio.set_PWM_range();
            }).to.throw(Error);
            pigpio.close();
        });
    });

    it('get_PWM_range_returns_a_value', (done) => {
        const pigpio = new PiGPIO();
        pigpio.pi('127.0.0.1', port, () => {
            server.create_server_response(22, '80000000');
            pigpio.get_PWM_range(2,(err, data)=>{
                assert (err === undefined, "Error occured");
                assert(128===data,"Invalid Server response");
                server.assert_correct_message_sent(22, 2, 0);
                pigpio.close();
                done();
            });
        });
    });

    it('get_PWM_real_range_returns_a_value', (done) => {
        const pigpio = new PiGPIO();
        pigpio.pi('127.0.0.1', port, () => {
            "use strict";
            server.create_server_response(24, '80000000');
            pigpio.get_PWM_real_range(2,(err, data)=>{
                assert (err === undefined, "Error occured");
                assert(128===data,"Invalid Server response");
                server.assert_correct_message_sent(24, 2, 0);
                pigpio.close();
                done();
            });
        });
    });


    it('get_PWM_frequecy_returns_a_value', (done) => {
        const pigpio = new PiGPIO();
        pigpio.pi('127.0.0.1', port, () => {
            "use strict";
            server.create_server_response(23, '80000000');
            pigpio.get_PWM_frequency(2,(err, data)=>{
                assert (err === undefined, "Error occured");
                assert(128===data,"Invalid Server response");
                server.assert_correct_message_sent(23, 2, 0);
                pigpio.close();
                done();
            });
        });
    });

    it('get_PWM_frequency - errors when out of range gpiopin sent', () => {
        const pigpio = new PiGPIO();
        pigpio.pi('127.0.0.1', port, () => {
            "use strict";
            expect(() => {
                pigpio.get_PWM_frequency(-1);
            }).to.throw(Error);
            expect(() => {
                pigpio.get_PWM_frequency(32);
            }).to.throw(Error);
            expect(() => {
                pigpio.get_PWM_frequency();
            }).to.throw(Error);
            pigpio.close();
        });
    });

    after(()=>{
        server.destroy();
    });
});
