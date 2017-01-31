/* global it describe context */
/* eslint-env node, mocha */

const assert = require('chai').assert;
const PiGPIO = require('../js-pigpio/index.js');
const net = require('net');
const Put = require('put');
const reverse_string = require('../js-pigpio/utils.js').reverse_string;

describe('js-pigpio', () => {

    let last_command = '';
    let server_response = '';
    const port = 5004;
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

    context('Utils', () => {
        it('get_hardware_revision', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                create_server_response(17,'8220a0');
                pigpio.getHardwareRevision((err, data)=>{
                    assert(parseInt('a02082',16)===data,"Invalid Server response");
                    //assert(last_command.substr(0,2)==='11', "Wrong Command Send");
                    assert_correct_message_sent(17, 0, 0);
                    pigpio.close();
                    done();
                });
            });
        });
    });
});