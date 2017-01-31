const Pigpio = require('../js-pigpio/index.js');

const HOST = 'pigpio.hopto.org';
const PORT = 8888;

const PiGPIO = new Pigpio();

PiGPIO.pi(HOST, PORT, (err) => {
    if (err) throw err;

    PiGPIO.read(4, (err, data) => {
        "use strict";
        console.log("pin 4:");
       console.log(data);
       PiGPIO.write(4,0, ()=> {
           console.log("Written")
           PiGPIO.read(4,(err,data) => {
               console.log("pin 4:");
               console.log (data);
               PiGPIO.write(4,1, ()=>{
                   PiGPIO.read(4,(err,data) => {
                       console.log("pin 4:");
                       console.log(data);
                   });
               });
           })
       });
    });
});

