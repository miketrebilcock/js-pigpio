/* global it describe context */
/* eslint-env node, mocha */

const assert = require('chai').assert;
const expect = require('chai').expect;
const PiGPIO = require('../js-pigpio/index.js');
const net = require('net');

describe('advanced', () => {

    let last_command = '';
    let server_response = '';
    const port = 5001;
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

    it('set_glitch_filter command is sent', (done) => {
        const pigpio = new PiGPIO();
        pigpio.pi('127.0.0.1', port, () => {
            "use strict";
            pigpio.set_glitch_filter(2, 5);
            setTimeout((done)=>{
                assert_correct_message_sent(97, 2, 5);
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
});

