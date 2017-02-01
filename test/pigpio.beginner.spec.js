/* global it describe context */
/* eslint-env node, mocha */

const assert = require('chai').assert;
const expect = require('chai').expect;
const PiGPIO = require('../js-pigpio/index.js');
const testServer = require ('./testhelper.js').testServer;
let server;

describe('beginner', () => {

    const port = 5000;

    before(()=> {
        server = new testServer(port);
    });

    context('mode', () => {
        it('set_mode as INPUT', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                pigpio.set_mode(1, pigpio.INPUT);
                setTimeout((done) => {
                    server.assert_correct_message_sent(0, 1, 0);
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
                    server.assert_correct_message_sent(0, 1, 1);
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
                    server.assert_correct_message_sent(0, 1, 4);
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
                    server.assert_correct_message_sent(0, 1, 5);
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
                    server.assert_correct_message_sent(0, 1, 6);
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
                    server.assert_correct_message_sent(0, 1, 7);
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
                    server.assert_correct_message_sent(0, 1, 3);
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
                    server.assert_correct_message_sent(0, 1, 2);
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
                    server.assert_correct_message_sent(0, 1, 7);
                    done();
                }, 100, done);
                pigpio.close();

            });
        });

        it('get_mode_returns_a_value', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                server.create_server_response(1, '0100');
                pigpio.get_mode(2, (err, data) => {
                    assert(err === undefined, "Error occured");
                    assert(pigpio.OUTPUT === data, "Invalid Server response");
                    server.assert_correct_message_sent(1, 2, 0);
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
                    server.assert_correct_message_sent(2, 1, 0);
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
                    server.assert_correct_message_sent(2, 1, 2);
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
                    server.assert_correct_message_sent(2, 1, 1);
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
                server.create_server_response(3, '0100');
                pigpio.read(2, (err, data) => {
                    assert(err === undefined, "Error occured");
                    assert(1 === data, "Invalid Server response");
                    server.assert_correct_message_sent(3, 2, 0);
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
                    server.assert_correct_message_sent(4, 1, 1);
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
                    server.assert_correct_message_sent(4, 1, 0);
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
                    server.assert_correct_message_sent(8, 1, 4);
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
                    server.assert_correct_message_sent(5, 2, 8);
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
                server.create_server_response(83, '80000000');
                pigpio.get_PWM_dutycycle(2, (err, data) => {
                    assert(err === undefined, "Error occured");
                    assert(128 === data, "Invalid Server response");
                    server.assert_correct_message_sent(83, 2, 0);
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

    after(()=>{
        server.destroy();
    });
});