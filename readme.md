#js-pigpio

A pure JS library for interacting with Raspberry Pi GPIO using the 
[pigpio](http://abyz.co.uk/rpi/pigpio/index.html) daemon (for pwm, servo control, etc)
                                                                 
The pigpio library uses direct memory access (DMA) to allow you to sample
the GPIOs up to 1,000,000 times per second. It also makes it fast enough to
give you PWM and servo control on all GPIOs simultaneously. The servo
waveforms are accurate to a few microseconds.
                                                                 
This code is based off of the [python library](http://abyz.co.uk/rpi/pigpio/python.html)
included with the pigpio download.

For managed access to the GPIO using javascript checkout [js-gpiozero](https://github.com/i-am-digital/js-gpiozero).

##Thanks
Massive thanks for the inspiration and idea from [pi-fast-gpio](https://github.com/Tobbe/pi-fast-gpio) 