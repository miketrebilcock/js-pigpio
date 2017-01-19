/* global it describe context */
/* eslint-env node, mocha */

const assert = require('chai').assert;
const expect = require('chai').expect;
const PiGPIO = require('../js-pigpio/index.js');
const net = require('net');
const Put = require('put');

describe('beginner', () => {

    let last_command = "";
    let server_response = "";
    const port = 5000;

    //setup server and listen for commands
    net.createServer((socket)=>{
        socket.on("data", (data) => {
            last_command = data.toString('hex');
            if (server_response!=="") {
                var replyData = server_response;
                socket.write(replyData);
                server_response="";
            }
        });

        socket.on("error", (ex)=>{
            throw new Error(ex);
        });
    }).
    listen(port);

    context('mode', () => {
        it('set_mode as INPUT', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                pigpio.set_mode(1, pigpio.INPUT);
                setTimeout((done)=>{
                    assert(last_command[1]==='0', "Wrong Command Send");
                    assert(last_command[9]==='1', "Wrong Command Send");
                    assert(last_command[17]==='0', "Wrong Command Send");
                    done();
                }, 100, done);
                pigpio.close();
            });
        });

        it('set_mode as OUTPUT', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                pigpio.set_mode(1, pigpio.OUTPUT);
                setTimeout((done)=>{
                    assert(last_command[1]==='0', "Wrong Command Send");
                    assert(last_command[9]==='1', "Wrong Command Send");
                    assert(last_command[17]==='1', "Wrong Command Send");
                    done();
                }, 100, done);
                pigpio.close();
            });
        });

        it('set_mode as ALT0', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                pigpio.set_mode(1, pigpio.ALT0);
                setTimeout((done)=>{
                    assert(last_command[1]==='0', "Wrong Command Send");
                    assert(last_command[9]==='1', "Wrong Command Send");
                    assert(last_command[17]==='4', "Wrong Command Send");
                    done();
                }, 100, done);
                pigpio.close();
            });
        });

        it('set_mode as ALT1', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                pigpio.set_mode(1, pigpio.ALT1);
                setTimeout((done)=>{
                    assert(last_command[1]==='0', "Wrong Command Send");
                    assert(last_command[9]==='1', "Wrong Command Send");
                    assert(last_command[17]==='5', "Wrong Command Send");
                    done();
                }, 100, done);
                pigpio.close();
            });
        });

        it('set_mode as ALT2', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                pigpio.set_mode(1, pigpio.ALT2);
                setTimeout((done)=>{
                    assert(last_command[1]==='0', "Wrong Command Send");
                    assert(last_command[9]==='1', "Wrong Command Send");
                    assert(last_command[17]==='6', "Wrong Command Send");
                    done();
                }, 100, done);
                pigpio.close();
            });
        });

        it('set_mode as ALT3', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                pigpio.set_mode(1, pigpio.ALT3);
                setTimeout((done)=>{
                    assert(last_command[1]==='0', "Wrong Command Send");
                    assert(last_command[9]==='1', "Wrong Command Send");
                    assert(last_command[17]==='7', "Wrong Command Send");
                    done();
                }, 100, done);
                pigpio.close();
            });
        });

        it('set_mode as ALT4', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                pigpio.set_mode(1, pigpio.ALT4);
                setTimeout((done)=>{
                    assert(last_command[1]==='0', "Wrong Command Send");
                    assert(last_command[9]==='1', "Wrong Command Send");
                    assert(last_command[17]==='3', "Wrong Command Send");
                    done();
                }, 100, done);
                pigpio.close();
            });
        });

        it('set_mode as ALT5', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                pigpio.set_mode(1, pigpio.ALT5);
                setTimeout((done)=>{
                    assert(last_command[1]==='0', "Wrong Command Send");
                    assert(last_command[9]==='1', "Wrong Command Send");
                    assert(last_command[17]==='2', "Wrong Command Send");
                    done();
                }, 100, done);
                pigpio.close();
            });
        });

        it('set_mode validates inputs', () => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                expect(() => {
                    pigpio.set_mode(-1, pigpio.OUTPUT);
                }).to.throw(Error);
                expect(() => {
                    pigpio.set_mode(54, pigpio.OUTPUT);
                }).to.throw(Error);
                expect(() => {
                    pigpio.set_mode(1, "TEST");
                }).to.throw(Error);
                expect(() => {
                    pigpio.set_mode();
                }).to.throw(Error);
                pigpio.close();

            });
        });

        it('set_mode as ALT3', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                pigpio.set_mode(1, pigpio.ALT3);
                setTimeout((done)=>{
                    assert(last_command[1]==='0', "Wrong Command Send");
                    assert(last_command[9]==='1', "Wrong Command Send");
                    assert(last_command[17]==='7', "Wrong Command Send");
                    done();
                }, 100, done);
                pigpio.close();

            });
        });

        it('get_mode_returns_a_value', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                const cmd = Put()
                    .word32le(0x0100);
                server_response = cmd.buffer();
                pigpio.get_mode(2,(err, data)=>{
                    assert (err === undefined, "Error occured");
                    assert(pigpio.OUTPUT===data,"Invalid Server response");
                    assert(last_command.substr(0,2)==='01', "Wrong Command Send");
                    pigpio.close();
                    done();
                });
            });
        });
    });
    context('pull_up_down', () => {
        it('set_pull_up_down as off', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                pigpio.set_pull_up_down(1, pigpio.PUD_OFF);
                setTimeout((done)=>{
                    assert(last_command[1]==='2', "Wrong Command Send");
                    assert(last_command[9]==='1', "Wrong GPIO Port Send");
                    assert(last_command[17]==='0', "Wrong Argument Send");
                    done();
                }, 100, done);
                pigpio.close();
            });
        });

        it('set_pull_up_down as up', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                pigpio.set_pull_up_down(1, pigpio.PUD_UP);
                setTimeout((done)=>{
                    assert(last_command[1]==='2', "Wrong Command Send");
                    assert(last_command[9]==='1', "Wrong Command Send");
                    assert(last_command[17]==='2', "Wrong Command Send");
                    done();
                }, 100, done);
                pigpio.close();
            });
        });

        it('set_pull_up_down as down', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                pigpio.set_pull_up_down(1, pigpio.PUD_DOWN);
                setTimeout((done)=>{
                    assert(last_command[1]==='2', "Wrong Command Send");
                    assert(last_command[9]==='1', "Wrong Command Send");
                    assert(last_command[17]==='1', "Wrong Command Send");
                    done();
                }, 100, done);
                pigpio.close();

            });
        });

        it('set_pull_up_down validates inputs', () => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                expect(() => {
                    pigpio.set_pull_up_down(-1, pigpio.PUD_DOWN);
                }).to.throw(Error);
                expect(() => {
                    pigpio.set_pull_up_down(54, pigpio.PUD_DOWN);
                }).to.throw(Error);
                expect(() => {
                    pigpio.set_pull_up_down(1, "TEST");
                }).to.throw(Error);
                expect(() => {
                    pigpio.set_pull_up_down();
                }).to.throw(Error);
                pigpio.close();
            });
        });
    });

    context ('ServoPulsewith', () => {
        it('setServoPulsewidth', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                pigpio.setServoPulsewidth(1,4);
                setTimeout((done)=>{
                    assert(last_command[1]==='8', "Wrong Command Send");
                    assert(last_command[9]==='1', "Wrong Command Send");
                    assert(last_command[17]==='4', "Wrong Command Send");
                    done();
                }, 100, done);
                pigpio.close();
            });
        });

        it('setServoPulsewidth - errors when out of range gpiopin sent', () => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
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
            pigpio.pi('127.0.0.1', port, () => {
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
    });

    context('PWM_dutycycle', ()=>{
        it('set_PWM_dutycycle', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                pigpio.set_PWM_dutycycle(2,8);
                setTimeout((done)=>{
                    assert(last_command[1]==='5', "Wrong Command Send");
                    assert(last_command[9]==='2', "Wrong Command Send");
                    assert(last_command[17]==='8', "Wrong Command Send");
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
                    pigpio.set_PWM_dutycycle(-1);
                }).to.throw(Error);
                expect(() => {
                    pigpio.set_PWM_dutycycle(2600);
                }).to.throw(Error);
                expect(() => {
                    pigpio.set_PWM_dutycycle();
                }).to.throw(Error);
                pigpio.close();
            });
        });

        it('set_PWM_dutycycle - errors when out of range dutycycle sent', () => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', 5000, () => {
                "use strict";
                expect(() => {
                    pigpio.set_PWM_dutycycle(3,-1);
                }).to.throw(Error);
                expect(() => {
                    pigpio.set_PWM_dutycycle(4,256);
                }).to.throw(Error);
                expect(() => {
                    pigpio.set_PWM_dutycycle();
                }).to.throw(Error);
                pigpio.close();
            });
        });

        it('get_PWM_dutycycle_returns_a_value', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                const cmd = Put()
                    .word32le(0x80000000);
                server_response = cmd.buffer();
                pigpio.get_PWM_dutycycle(2,(err, data)=>{
                    assert (err === undefined, "Error occured");
                    assert(128===data,"Invalid Server response");
                    assert(parseInt(last_command.substr(0,2),16)===83, "Wrong Command Send");
                    pigpio.close();
                    done();
                });
            });
        });

        it('get_PWM_dutycycle - errors when out of range gpiopin sent', () => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                expect(() => {
                    pigpio.get_PWM_dutycycle(-1);
                }).to.throw(Error);
                expect(() => {
                    pigpio.get_PWM_dutycycle(32);
                }).to.throw(Error);
                expect(() => {
                    pigpio.get_PWM_dutycycle();
                }).to.throw(Error);
                pigpio.close();
            });
        });
    });
});