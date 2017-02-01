/* global it describe context */
/* eslint-env node, mocha */

const assert = require('chai').assert;
const PiGPIO = require('../js-pigpio/index.js');
const testServer = require ('./testhelper.js').testServer;
let server;

describe('js-pigpio', () => {

    const port = 5004;

    before(()=> {
        server = new testServer(port);
    });

    context('Utils', () => {
        it('get_hardware_revision', (done) => {
            const pigpio = new PiGPIO();
            pigpio.pi('127.0.0.1', port, () => {
                server.create_server_response(17,'8220a0');
                pigpio.getHardwareRevision((err, data)=>{
                    assert(parseInt('a02082',16)===data,"Invalid Server response");
                    server.assert_correct_message_sent(17, 0, 0);
                    pigpio.close();
                    done();
                });
            });
        });
    });

    after(()=>{
       server.destroy();
    });
});