"use strict";

var timereport = require('../index.js');
var should = require('should');

describe('TimeReport.js', function() {
    describe('Public functions', function() {

        it('should return itself when running specific functions', function() {
            should(timereport.createGroup('test')).equal(timereport);
            should(timereport.printGroup('test')).equal(timereport);
            should(timereport.startTimer('testtimer', 'test')).equal(timereport);
            should(timereport.endTimer('testtimer', 'test')).equal(timereport);
        });

    });

    describe('outputTime', function() {

        it('should return x ms when less then 1 s', function() {
            should(timereport.public_scope.outputTime(456)).equal("456 ms");
        });
        it('should return x s when more than 1 s and less than 1 m', function() {
            should(timereport.public_scope.outputTime(23123)).equal("23.123 s");
        });
        it('should return x m and x s when more than 1 m but less than 1 h', function() {
            should(timereport.public_scope.outputTime(60000*3+12345)).equal("3 m and 12.345 s");
        });
        it('should return a funny text because you really should not use this on that long processes.', function() {
            should(timereport.public_scope.outputTime(60000*123), "looong time!");
        });

    });

    describe('Groups', function() {

        it('should create a new group when it is not created before', function() {
            timereport.createGroup('testgroup1');
            should(timereport.public_scope.groups['testgroup1'].id).equal('testgroup1');
        });

        it('should create a group from startTimer functions if that group is not created before', function() {
            timereport.startTimer('grouptimer1', 'specialgroup1');

            timereport.endTimer('grouptimer1', 'specialgroup1');

            should.exist(timereport.public_scope.groups['specialgroup1']);
        });

        it('should not create a new group if a group is already created', function() {
            timereport.startTimer('testtimer', 'testgroup1');
            timereport.startTimer('testtimer2', 'testgroup1');

            timereport.endTimer('testtimer', 'testgroup1');
            timereport.endTimer('testtimer2', 'testgroup1');

            timereport.createGroup('testgroup1');

            should(timereport.public_scope.groups['testgroup1'].timers.length).equal(2);
        });

    });

    describe('Timers', function() {

        it('should start a timer when a timer is started', function(done) {
            timereport.startTimer('timer1', 'group1');

            setTimeout(function() {
                timereport.startTimer('timer2', 'group1');
            }, 100);

            setTimeout(function() {
                timereport.startTimer('timer3', 'group1');
            }, 200);

            setTimeout(function() {
                timereport.endTimer('timer1', 'group1');
                timereport.endTimer('timer2', 'group1');
                timereport.endTimer('timer3', 'group1');

                should(timereport.public_scope.groups['group1'].timers.length).equal(3);
                done(); 
            }, 300);

        });

    });

    describe('Prints', function() {
        it('should print the output in a nice way', function() {
           timereport.outputGroup('group1').print(); 
           timereport.outputGroup('group1')
        });
    });

});
