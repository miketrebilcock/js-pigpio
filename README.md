# js-pigpio

[![Build Tests](https://travis-ci.org/miketrebilcock/js-pigpio.svg?branch=master)](https://travis-ci.org/miketrebilcock/js-pigpio) [![Code Coverage](https://codecov.io/gh/miketrebilcock/js-pigpio/branch/master/graph/badge.svg)](https://codecov.io/gh/miketrebilcock/js-pigpio) [![npm version](https://badge.fury.io/js/js-pigpio.svg)](https://badge.fury.io/js/js-pigpio)[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A pure JS library for interacting with Raspberry Pi GPIO using the 
[pigpio](http://abyz.co.uk/rpi/pigpio/index.html) daemon (for pwm, servo control, etc)
                                                                 
The pigpio library uses direct memory access (DMA) to allow you to sample
the GPIOs up to 1,000,000 times per second. It also makes it fast enough to
give you PWM and servo control on all GPIOs simultaneously. The servo
waveforms are accurate to a few microseconds.
                                                                 
This code is based off of the [python library](http://abyz.co.uk/rpi/pigpio/python.html)
included with the pigpio download.

For managed access to the GPIO using javascript checkout [js-gpiozero](https://github.com/miketrebilcock/js-gpiozero).

It's early days and a work in progress!

## Documentation
The API Documentation is available at the repos [github-pages](https://miketrebilcock.github.io/js-pigpio/).


## Thanks
Massive thanks for the inspiration and idea from [pi-fast-gpio](https://github.com/Tobbe/pi-fast-gpio) 
