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
        it('set_mode as INPUT', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', 5000, () => {
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
            pigpio.pi('127.0.0.1', 5000, () => {
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
            pigpio.pi('127.0.0.1', 5000, () => {
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
            pigpio.pi('127.0.0.1', 5000, () => {
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
            pigpio.pi('127.0.0.1', 5000, () => {
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
            pigpio.pi('127.0.0.1', 5000, () => {
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
            pigpio.pi('127.0.0.1', 5000, () => {
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
            pigpio.pi('127.0.0.1', 5000, () => {
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
            pigpio.pi('127.0.0.1', 5000, () => {
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
            pigpio.pi('127.0.0.1', 5000, () => {
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

        it('set_pull_up_down as off', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', 5000, () => {
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
            pigpio.pi('127.0.0.1', 5000, () => {
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
            pigpio.pi('127.0.0.1', 5000, () => {
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
            pigpio.pi('127.0.0.1', 5000, () => {
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
                }, 100, done);
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
                }, 100, done);
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

    context('Advanced', () => {
        "use strict";
        it('set_glitch_filter command is sent', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', 5000, () => {
                "use strict";
                pigpio.set_glitch_filter(2, 5);
                setTimeout((done)=>{
                    assert(last_command[0]==='6', "Wrong Command Sent");
                    assert(last_command[1]==='1', "Wrong Command Sent");
                    assert(last_command[9]==='2', "Wrong GPIO Pin Sent");
                    assert(last_command[17]==='5', "Wrong Argument Sent");
                    done();
                }, 100, done);
                pigpio.close();

            });
        });

        it('set_glitch_filter validates inputs', () => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', 5000, () => {
                "use strict";
                expect(() => {
                    pigpio.set_glitch_filter(-1, 5)
                }).to.throw(Error);
                expect(() => {
                    pigpio.set_glitch_filter(54, 5)
                }).to.throw(Error);
                expect(() => {
                    pigpio.set_glitch_filter(54, -1)
                }).to.throw(Error);
                expect(() => {
                    pigpio.set_glitch_filter(54, 300001)
                }).to.throw(Error);
                expect(() => {
                    pigpio.set_glitch_filter(1, "TEST");
                }).to.throw(Error);
                expect(() => {
                    pigpio.set_glitch_filter();
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