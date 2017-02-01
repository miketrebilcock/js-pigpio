/* global it describe context */
/* eslint-env node, mocha */

const expect = require('chai').expect;
const PiGPIO = require('../js-pigpio/index.js');
const testServer = require ('./testhelper.js').testServer;
let server;

describe('advanced', () => {

    const port = 5001;

    before(()=> {
        server = new testServer(port);
    });

    it('set_glitch_filter command is sent', (done) => {
        const pigpio = new PiGPIO();
        pigpio.pi('127.0.0.1', port, () => {
            "use strict";
            pigpio.set_glitch_filter(2, 5);
            setTimeout((done)=>{
                server.assert_correct_message_sent(97, 2, 5);
                done();
            }, 100, done);
            pigpio.close();
        });
    });

    it('set_glitch_filter validates inputs', () => {
        const pigpio = new PiGPIO();
        pigpio.pi('127.0.0.1', port, () => {
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

    after(()=>{
        server.destroy();
    });
});

