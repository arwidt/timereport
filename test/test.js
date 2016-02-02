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
        it('should return x m and x s when more than 1 m but less than 1 h', function() {
            assert.equal(timereport.public_scope.outputTime(60000*3+12345), "3 m and 12.345 s");
        }); 
        it('should return a funny text because you really should not use this on that long processes.', function() {
            assert.equal(timereport.public_scope.outputTime(60000*123), "looong time!");
        }); 
    });

    describe('Groups', function() {
        it('', function() {
        
        }); 
        it('should create a new group when it is not created before', function() {
            timereport.createGroup('testgroup1');
            assert.equal(timereport.public_scope.groups['testgroup1'].id, 'testgroup1'); 
        }); 
        it('should not create a new group if a group is already created', function() {
            timereport.startTimer('testtimer', 'testgroup1');
            timereport.startTimer('testtimer2', 'testgroup1');

            timereport.endTimer('testtimer', 'testgroup1');
            timereport.endTimer('testtimer2', 'testgroup1');
            
            timereport.createGroup('testgroup1');

            assert.equal(timereport.public_scope.groups['testgroup1'].timers.length, 2);
        }); 
    });

});
