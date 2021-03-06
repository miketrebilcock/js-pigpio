/*global it describe context */

const assert = require('chai').assert;
const reverse_string_and_clean = require('../js-pigpio/utils.js').reverse_string_and_clean;
const reverse_string = require('../js-pigpio/utils.js').reverse_string;

describe('js-pigpio-utils', () => {

    context('static methods', () => {
        it('cleans and reverses a string', () => {
            const correct = 'a02082';
            const input = '000a0228000000000000000000000011';
            assert(correct, reverse_string_and_clean(input));

        });
        it('reverses a string', () => {
            const correct='11000000000000000000000008220a00';
            const input = '000a0228000000000000000000000011';
            assert(correct, reverse_string(input));

        });
    });
});
