/* global it describe context */
/* eslint-env node, mocha */

const assert = require('chai').assert;
const expect = require('chai').expect;
const PiGPIO = require('../js-pigpio/index.js');
const net = require('net');
const Put = require('put');
const reverse_string = require('../js-pigpio/utils.js').reverse_string;


describe('intermediate', () => {

    let last_command = '';
    let server_response = '';
    const port = 5003;
    let event_port = 0;

    //setup server and listen for commands
    net.createServer((socket)=>{
        socket.on("data", (data) => {
            if(parseInt((data.toString('hex')).substr(0,2),16)===99) {
                event_port = socket.remotePort;
                socket.write(data);
            }

            if(socket.remotePort !== event_port) {
                last_command = data.toString('hex');
                if (server_response !== "") {
                    const replyData = server_response;
                    if(socket.write(replyData)) {
                        server_response = "";
                    } else {
                        throw new Error;
                    }
                }
            }
        });

        socket.on("error", (ex)=>{
            throw new Error(ex);
        });
    }).
    listen(port);

    function lastCommand() {
        const size = last_command.length;
        return parseInt(last_command.substr(size-32,2),16);
    }

    function lastParameter1() {
        const size = last_command.length;
        return parseInt(last_command.substr(size-30,8),16);
    }

    function lastParameter2() {
        const size = last_command.length;
        return parseInt(last_command.substr(size-22,8),16);
    }

    function assert_correct_message_sent(command, parameter1, parameter2) {
        assert(lastCommand() === command, "Wrong Command Sent");
        assert(lastParameter1() === parameter1, "Wrong Parameter1 Sent");
        assert(lastParameter2() === parameter2, "Wrong Parameter2 Sent");
    }

    function create_server_response(command, return_value) {
        const parameter = reverse_string(return_value);
        const cmd = Put()
            .word32le(command)
            .word32le(parameter);
        server_response = cmd.buffer();
    }

    it('set_PWM_frequency', (done) => {
        const pigpio = new PiGPIO();
        pigpio.pi('127.0.0.1', port, () => {
            "use strict";
            pigpio.set_PWM_frequency(2,15);
            setTimeout((done)=>{
                assert_correct_message_sent(7, 2, 15);
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
                assert_correct_message_sent(6, 2, 25);
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
            create_server_response(22, '80000000');
            pigpio.get_PWM_range(2,(err, data)=>{
                assert (err === undefined, "Error occured");
                assert(128===data,"Invalid Server response");
                assert_correct_message_sent(22, 2, 0);
                pigpio.close();
                done();
            });
        });
    });

    it('get_PWM_real_range_returns_a_value', (done) => {
        const pigpio = new PiGPIO();
        pigpio.pi('127.0.0.1', port, () => {
            "use strict";
            create_server_response(24, '80000000');
            pigpio.get_PWM_real_range(2,(err, data)=>{
                assert (err === undefined, "Error occured");
                assert(128===data,"Invalid Server response");
                assert_correct_message_sent(24, 2, 0);
                pigpio.close();
                done();
            });
        });
    });


    it('get_PWM_frequecy_returns_a_value', (done) => {
        const pigpio = new PiGPIO();
        pigpio.pi('127.0.0.1', port, () => {
            "use strict";
            create_server_response(23, '80000000');
            pigpio.get_PWM_frequency(2,(err, data)=>{
                assert (err === undefined, "Error occured");
                assert(128===data,"Invalid Server response");
                assert_correct_message_sent(23, 2, 0);
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
});
