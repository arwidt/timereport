"use strict";

var assert = require('assert');
var timereport = require('../index.js');

describe('TimeReport.js', function() {
    describe('Public functions', function() {
        it('should return itself when running specific functions', function() {
            assert.equal(timereport.createGroup('test'), timereport);
            assert.equal(timereport.printGroup('test'), timereport);
            assert.equal(timereport.startTimer('testtimer', 'test'), timereport);
            assert.equal(timereport.endTimer('testtimer', 'test'), timereport);
        });
    });

    describe('outputTime', function() {
        it('should return x ms when less then 1 s', function() {
            assert.equal(timereport.public_scope.outputTime(456), "456 ms");
        }); 
        it('should return x s when more than 1 s and less than 1 m', function() {
            assert.equal(timereport.public_scope.outputTime(23123), "23.123 s");
        }); 
    });
});
