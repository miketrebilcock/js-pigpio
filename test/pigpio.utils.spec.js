/* global it describe context */
/* eslint-env node, mocha */

const assert = require('chai').assert;
const PiGPIO = require('../js-pigpio/index.js');
const net = require('net');
const Put = require('put');

describe('js-pigpio', () => {

    let last_command = '';
    let server_response = '';
    const port = 5004;

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

    context('Utils', () => {
        it('get_hardware_revision', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                "use strict";
                const cmd = Put()
                    .word32le(0x0011)
                    .word32le(0)
                    .word32le(0)
                    .word32le(0x00a02082);
                server_response = cmd.buffer();
                pigpio.getHardwareRevision((err, data)=>{
                    assert(parseInt('a02082',16)===data,"Invalid Server response");
                    assert(last_command.substr(0,2)==='11', "Wrong Command Send");
                    pigpio.close();
                    done();
                });
            });
        });
    });
});