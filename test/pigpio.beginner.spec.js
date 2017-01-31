/* global it describe context */
/* eslint-env node, mocha */

const assert = require('chai').assert;
const expect = require('chai').expect;
const PiGPIO = require('../js-pigpio/index.js');
const reverse_string = require('../js-pigpio/utils.js').reverse_string;
const net = require('net');
const Put = require('put');

describe('beginner', () => {

    let last_command = "";
    let server_response = "";
    const port = 5000;
    let event_port = 0;

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

    context('mode', () => {
        it('set_mode as INPUT', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                pigpio.set_mode(1, pigpio.INPUT);
                setTimeout((done) => {
                    assert_correct_message_sent(0, 1, 0);
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
                setTimeout((done) => {
                    assert_correct_message_sent(0, 1, 1);
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
                setTimeout((done) => {
                    assert_correct_message_sent(0, 1, 4);
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
                setTimeout((done) => {
                    assert_correct_message_sent(0, 1, 5);
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
                setTimeout((done) => {
                    assert_correct_message_sent(0, 1, 6);
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
                setTimeout((done) => {
                    assert_correct_message_sent(0, 1, 7);
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
                setTimeout((done) => {
                    assert_correct_message_sent(0, 1, 3);
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
                setTimeout((done) => {
                    assert_correct_message_sent(0, 1, 2);
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
                setTimeout((done) => {
                    assert_correct_message_sent(0, 1, 7);
                    done();
                }, 100, done);
                pigpio.close();

            });
        });

        it('get_mode_returns_a_value', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                create_server_response(1, '0100');
                pigpio.get_mode(2, (err, data) => {
                    assert(err === undefined, "Error occured");
                    assert(pigpio.OUTPUT === data, "Invalid Server response");
                    assert_correct_message_sent(1, 2, 0);
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
                setTimeout((done) => {
                    assert_correct_message_sent(2, 1, 0);
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
                setTimeout((done) => {
                    assert_correct_message_sent(2, 1, 2);
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
                setTimeout((done) => {
                    assert_correct_message_sent(2, 1, 1);
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

    context('read command', () => {
        it('read a value from a pin', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                pigpio.read(1);
                create_server_response(3, '0100');
                pigpio.read(2, (err, data) => {
                    assert(err === undefined, "Error occured");
                    assert(1 === data, "Invalid Server response");
                    assert_correct_message_sent(3, 2, 0);
                    pigpio.close();
                    done();
                });
            });
        });
        it('validates inputs', () => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                expect(() => {
                    pigpio.read(-1);
                }).to.throw(Error);
                expect(() => {
                    pigpio.read(35);
                }).to.throw(Error);
                expect(() => {
                    pigpio.read();
                }).to.throw(Error);
                pigpio.close();
            });
        });
    });

    context('write command', () => {
        it('writes a 1 to a pin', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                pigpio.write(1, 1);
                setTimeout((done) => {
                    assert_correct_message_sent(4, 1, 1);
                    done();
                }, 100, done);
                pigpio.close();
            });
        });
        it('writes a 0 to a pin', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                pigpio.write(1, 0);
                setTimeout((done) => {
                    assert_correct_message_sent(4, 1, 0);
                    done();
                }, 100, done);
                pigpio.close();
            });
        });
        it('validates write pin', () => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                expect(() => {
                    pigpio.write(-1, 1);
                }).to.throw(Error);
                expect(() => {
                    pigpio.write(35, 0);
                }).to.throw(Error);
                expect(() => {
                    pigpio.write();
                }).to.throw(Error);
                pigpio.close();
            });
        });
        it('validates write level', () => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                expect(() => {
                    pigpio.write(1, -1);
                }).to.throw(Error);
                expect(() => {
                    pigpio.write(2, 2);
                }).to.throw(Error);
                expect(() => {
                    pigpio.write(3);
                }).to.throw(Error);
                pigpio.close();
            });
        });
    });

    context('ServoPulsewith', () => {
        it('setServoPulsewidth', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                pigpio.setServoPulsewidth(1, 4);
                setTimeout((done) => {
                    assert_correct_message_sent(8, 1, 4);
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
                    pigpio.setServoPulsewidth(1, -1);
                }).to.throw(Error);
                expect(() => {
                    pigpio.setServoPulsewidth(1, 256);
                }).to.throw(Error);
                expect(() => {
                    pigpio.setServoPulsewidth(1);
                }).to.throw(Error);
                pigpio.close();
            });
        });
    });

    context('PWM_dutycycle', () => {
        it('set_PWM_dutycycle', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                pigpio.set_PWM_dutycycle(2, 8);
                setTimeout((done) => {
                    assert_correct_message_sent(5, 2, 8);
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
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                expect(() => {
                    pigpio.set_PWM_dutycycle(3, -1);
                }).to.throw(Error);
                expect(() => {
                    pigpio.set_PWM_dutycycle(4, 256);
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
                create_server_response(83, '80000000');
                pigpio.get_PWM_dutycycle(2, (err, data) => {
                    assert(err === undefined, "Error occured");
                    assert(128 === data, "Invalid Server response");
                    assert_correct_message_sent(83, 2, 0);
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

    context('callback', () => {
        it('errors when out of range gpiopin sent', () => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                expect(() => {
                    pigpio.callback(-1);
                }).to.throw(Error);
                expect(() => {
                    pigpio.callback(2600);
                }).to.throw(Error);
                expect(() => {
                    pigpio.callback();
                }).to.throw(Error);

            });
        });

        it('errors when invalid edge value sent', () => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                expect(() => {
                    pigpio.callback(1, 4);
                }).to.throw(Error);
            });
        });
    });
});