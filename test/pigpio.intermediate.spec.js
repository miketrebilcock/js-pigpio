/* global it describe context */
/* eslint-env node, mocha */

const assert = require('chai').assert;
const expect = require('chai').expect;
const PiGPIO = require('../js-pigpio/index.js');
const net = require('net');
const Put = require('put');



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
            }

            if(socket.remotePort !== event_port) {
                last_command = data.toString('hex');
                if (server_response !== "") {
                    var replyData = server_response;
                    socket.write(replyData);
                    server_response = "";
                }
            }
        });

        socket.on("error", (ex)=>{
            throw new Error(ex);
        });
    }).
    listen(port);

    it('set_PWM_frequency', (done) => {
        const pigpio = new PiGPIO();
        pigpio.pi('127.0.0.1', port, () => {
            "use strict";
            pigpio.set_PWM_frequency(2,15);
            setTimeout((done)=>{
                assert(last_command[1]==='7', "Wrong Command Send");
                assert(last_command[9]==='2', "Wrong Command Send");
                assert(last_command[17]==='f', "Wrong Command Send");
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
                assert(last_command[1]==='6', "Wrong Command Sent");
                assert(last_command[9]==='2', "Wrong Pin Sent");
                assert(parseInt(last_command.substr(16,2),16)===25, "Wrong value Sent");
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
            "use strict";
            const cmd = Put()
                .word32le(0x80000000);
            server_response = cmd.buffer();
            pigpio.get_PWM_range(2,(err, data)=>{
                assert (err === undefined, "Error occured");
                assert(128===data,"Invalid Server response");
                assert(parseInt(last_command.substr(0,2),16)===22, "Wrong Command Send");
                pigpio.close();
                done();
            });
        });
    });

    it('get_PWM_real_range_returns_a_value', (done) => {
        const pigpio = new PiGPIO();
        pigpio.pi('127.0.0.1', port, () => {
            "use strict";
            const cmd = Put()
                .word32le(0x80000000);
            server_response = cmd.buffer();
            pigpio.get_PWM_real_range(2,(err, data)=>{
                assert (err === undefined, "Error occured");
                assert(128===data,"Invalid Server response");
                assert(parseInt(last_command.substr(0,2),16)===24, "Wrong Command Send");
                pigpio.close();
                done();
            });
        });
    });


    it('get_PWM_frequecy_returns_a_value', (done) => {
        const pigpio = new PiGPIO();
        pigpio.pi('127.0.0.1', port, () => {
            "use strict";
            const cmd = Put()
                .word32le(0x80000000);
            server_response = cmd.buffer();
            pigpio.get_PWM_frequency(2,(err, data)=>{
                assert (err === undefined, "Error occured");
                assert(128===data,"Invalid Server response");
                assert(parseInt(last_command.substr(0,2),16)===23, "Wrong Command Send");
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
