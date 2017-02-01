/* global it describe context */
/* eslint-env node, mocha */

const assert = require('chai').assert;
const net = require('net');
const reverse_string = require('../js-pigpio/utils.js').reverse_string;
const Put = require('put');

 class testServer {

     constructor(port) {

         this.server_response = '';
         this.event_port = 0;
         const that = this;
         //setup server and listen for commands
         net.createServer((socket) => {
            that._register_listeners(socket);
         }).listen(port);
     }

     _register_listeners(socket) {
         this.socket = socket;
         socket.on("data", (data) => {
             if (parseInt((data.toString('hex')).substr(0, 2), 16) === 99) {
                 this.event_port = socket.remotePort;
                 socket.write(data);
             }

             if (socket.remotePort !== this.event_port || this.event_port===0) {
                 this.last_command = data.toString('hex');
                 if (this.server_response !== '') {
                     var replyData = this.server_response;
                     socket.write(replyData);
                     this.server_response = '';
                 } else {
                     socket.write(data);
                 }
             }
         });

         socket.on("error", (ex) => {
             throw new Error(ex);
         });
     }

     destroy () {
         this.socket.end();
         this.socket = null;
     }

     lastCommand() {
         const size = this.last_command.length;
         return parseInt(this.last_command.substr(size-32,2),16);
     }

     lastParameter1() {
         const size = this.last_command.length;
         return parseInt(this.last_command.substr(size-30,8),16);
     }

     lastParameter2() {
         const size = this.last_command.length;
         return parseInt(this.last_command.substr(size-22,8),16);
     }

     set_server_response (response) {
         this.server_response = response;
     }

     create_server_response(command, return_value) {
         const parameter = reverse_string(return_value);
         const cmd = Put()
             .word32le(command)
             .word32le(parameter);
         this.server_response = cmd.buffer();
     }

     assert_correct_message_sent(command, parameter1, parameter2) {
         assert(this.lastCommand() === command, "Wrong Command Sent");
         assert(this.lastParameter1() === parameter1, "Wrong Parameter1 Sent");
         assert(this.lastParameter2() === parameter2, "Wrong Parameter2 Sent");
     }
 }


exports.testServer = testServer;


