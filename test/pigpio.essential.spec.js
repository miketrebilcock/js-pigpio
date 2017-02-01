/* global it describe context */
/* eslint-env node, mocha */

const assert = require('chai').assert;
const PiGPIO = require('../js-pigpio/index.js');
const testServer = require ('./testhelper.js').testServer;
let server;

describe('essential', () => {

    const port = 5002;

    before(()=> {
        server = new testServer(port);
    });

    it('connects using specificed port', () => {
        const pigpio = new PiGPIO();
        pigpio.pi('127.0.0.1',port, (err, data) => {
            "use strict";
            assert(err===undefined, "Error Creating local connection");
            assert(data===undefined, "Error Creating local connection");
            assert(pigpio.address==='127.0.0.1', "Error Creating local connection");
            assert(pigpio.port===port, "Error Creating local connection");
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

    after(()=>{
        server.destroy();
    });
});