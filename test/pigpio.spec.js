/*global it describe context */

const assert = require('chai').assert;
const expect = require('chai').expect;
const PiGPIO = require('../js-pigpio/index.js');
const net = require('net');
const reverse_string = require('../js-pigpio/utils.js').reverse_string;

let last_command = "";
let server_response = "";

describe('js-pigpio', () => {

    //setup server and listen for commands
    net.createServer((socket)=>{
        socket.on("data", (data) => {
            last_command = data.toString('hex');
            if (server_response!=="") {
                server_response = reverse_string(server_response);
                var replyData = new Buffer(server_response,
                    'hex');

                socket.write(replyData);
                server_response="";
            }
        });

        socket.on("error", (ex)=>{
            throw new Error(ex);
        });
    }).
    listen(5000);

    context('Essential', () => {
        it('connects using specificed port', () => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1',5000, (err, data) => {
                "use strict";
                assert(err===undefined, "Error Creating local connection");
                assert(data===undefined, "Error Creating local connection");
                assert(pigpio.address==='127.0.0.1', "Error Creating local connection");
                assert(pigpio.port===5000, "Error Creating local connection");
                pigpio.close();
            });
        });
        it('attempts to connect to local when no server or post specified', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi(undefined, undefined, (err) => {
                "use strict";
                assert(err.code==='ECONNREFUSED', "Error Creating local connection");
                assert(err.address==='127.0.0.1', "Error Creating local connection");
                assert(err.port===8888, "Error Creating local connection");
                pigpio.close();
                done();
            });
        });
    });
    context('Beginner', () => {
        it('setServoPulsewidth', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', 5000, () => {
                "use strict";
                pigpio.setServoPulsewidth(1,4);
                setTimeout((done)=>{
                    assert(last_command[1]==='8', "Wrong Command Send");
                    assert(last_command[9]==='1', "Wrong Command Send");
                    assert(last_command[17]==='4', "Wrong Command Send");
                    done();
                }, 500, done);
                pigpio.close();

            });
        });

        it('setServoPulsewidth - errors when out of range gpiopin sent', () => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', 5000, () => {
                "use strict";
                expect(() => {
                    pigpio.setServoPulsewidth(-1);
                }).to.throw(Error);
                expect(() => {
                    pigpio.setServoPulsewidth(55);
                }).to.throw(Error);
                expect(() => {
                    pigpio.setServoPulsewidth();
                }).to.throw(Error);
                pigpio.close();

            });
        });

        it('setServoPulsewidth - errors when out of range pulsewidth sent', () => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', 5000, () => {
                "use strict";
                expect(() => {
                    pigpio.setServoPulsewidth(1,-1);
                }).to.throw(Error);
                expect(() => {
                    pigpio.setServoPulsewidth(1,256);
                }).to.throw(Error);
                expect(() => {
                    pigpio.setServoPulsewidth(1);
                }).to.throw(Error);
                pigpio.close();

            });
        });

        it('setPwmDutycycle', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', 5000, () => {
                "use strict";
                pigpio.setPwmDutycycle(2,8);
                setTimeout((done)=>{
                    assert(last_command[1]==='5', "Wrong Command Send");
                    assert(last_command[9]==='2', "Wrong Command Send");
                    assert(last_command[17]==='8', "Wrong Command Send");
                    done();
                }, 500, done);
                pigpio.close();

            });
        });

        it('setPwmDutycycle - errors when out of range gpiopin sent', () => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', 5000, () => {
                "use strict";
                expect(() => {
                    pigpio.setPwmDutycycle(-1);
                }).to.throw(Error);
                expect(() => {
                    pigpio.setPwmDutycycle(2600);
                }).to.throw(Error);
                expect(() => {
                    pigpio.setPwmDutycycle();
                }).to.throw(Error);
                pigpio.close();
            });
        });

        it('setPwmDutycycle - errors when out of range dutycycle sent', () => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', 5000, () => {
                "use strict";
                expect(() => {
                    pigpio.setPwmDutycycle(3,-1);
                }).to.throw(Error);
                expect(() => {
                    pigpio.setPwmDutycycle(4,256);
                }).to.throw(Error);
                expect(() => {
                    pigpio.setPwmDutycycle();
                }).to.throw(Error);
                pigpio.close();
            });
        });
    });

    context('Utils', () => {
        it('get_hardware_revision', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', 5000, () => {
                "use strict";
                server_response = 'a02082';
                pigpio.getHardwareRevision((err, data)=>{
                    assert('a02082'===data,"Invalid Server response");
                    assert(last_command.substr(0,2)==='11', "Wrong Command Send");
                    pigpio.close();
                    done();
                });
            });
        });
    });
});