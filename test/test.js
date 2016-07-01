"use strict";

var tr = require('../index.js');
var colors = require('colors');
var should = require('should');

describe('TimeReport.js', function() {

    describe('Current time', function() {

        it('should return correct time', function(done) {

            var t = tr.public_scope.now();
            setTimeout(function() {
                var _t = ~~(tr.public_scope.now() - t);
                if (_t > 990 && _t < 1010) {
                    _t = 1000;
                }
                should(_t).equal(1000);
                done();
            }, 1000);

        });

    });

    describe('Groups', function() {

        it('should have a default group setup from start named default', function() {
            should.exist(tr.public_scope.groups['default']);
        });

        it('should create a group if no group with that id is created before', function() {
            var group = tr.group('g1');
            group.should.have.ownProperty('opts');
            group.opts.id.should.equal('g1');
        });

        it('should return the group if a group with that id is created before', function() {
            tr.group('g1').should.equal(tr.public_scope.groups['g1']);
        });

    });

    describe('Timers', function() {

        it('when calling timer func directly without group, timer should be placed in default group', function() {
            tr.timer('d_t1').should.equal(tr.public_scope.groups['default'].timers['d_t1']);
        });

        it('when calling timer with started id, it should return the timer object', function() {
            var dt_1 = tr.timer('d_t1');
            dt_1.should.equal(tr.public_scope.groups['default'].timers['d_t1']);
        });

        it('should be possible to start a timer inside a group', function() {
            var g1_t1 = tr.group('g1').timer('g1_t1');
            g1_t1.should.equal(tr.public_scope.groups['g1'].timers['g1_t1']);
        });

        it('should be possible to access a started timer from a group', function() {
            var g1_t1 = tr.group('g1').timer('g1_t1');
            g1_t1.should.equal(tr.public_scope.groups['g1'].timers['g1_t1']);
        });



    });

    // describe('Output-time', function() {
    //
    //     it('should return x ms when less then 1 s', function() {
    //         should(timereport.public_scope.outputTime(456)).equal("456 ms");
    //     });
    //
    //     it('should return x s when more than 1 s and less than 1 m', function() {
    //         should(timereport.public_scope.outputTime(23123)).equal("23.123 s");
    //     });
    //
    //     it('should return x m and x s when more than 1 m but less than 1 h', function() {
    //         should(timereport.public_scope.outputTime(60000*3+12345)).equal("3 m and 12.345 s");
    //     });
    //
    //     it('should return a funny text because you really should not use this on that long processes.', function() {
    //         should(timereport.public_scope.outputTime(60000*123), "looong time!");
    //     });
    //
    // });
    //
    // describe('Groups', function() {
    //
    //     it('should create a new group when it is not created before', function() {
    //         timereport.createGroup('testgroup1');
    //         should(timereport.public_scope.groups['testgroup1'].id).equal('testgroup1');
    //     });
    //
    //     it('should be possible to ad a color from colors string prototype as a base color', function() {
    //        timereport.setColor(colors.red, 'testgroup1');
    //     });
    //
    //     it('should create a group from startTimer functions if that group is not created before', function() {
    //         timereport.startTimer('grouptimer1', 'specialgroup1');
    //
    //         timereport.endTimer('grouptimer1', 'specialgroup1');
    //
    //         should.exist(timereport.public_scope.groups['specialgroup1']);
    //     });
    //
    //     it('should not create a new group if a group is already created', function() {
    //         timereport.startTimer('testtimer', 'testgroup1');
    //         timereport.startTimer('testtimer2', 'testgroup1');
    //
    //         timereport.endTimer('testtimer', 'testgroup1');
    //         timereport.endTimer('testtimer2', 'testgroup1');
    //
    //         timereport.createGroup('testgroup1');
    //
    //         should(timereport.public_scope.groups['testgroup1'].timers.length).equal(2);
    //     });
    //
    // });
    //
    // describe('Timers', function() {
    //
    //     it('should start a timer when a timer is started', function(done) {
    //         timereport.startTimer('timer1', 'group1');
    //
    //         setTimeout(function() {
    //             timereport.startTimer('timer2', 'group1');
    //         }, 100);
    //
    //         setTimeout(function() {
    //             timereport.startTimer('timer3', 'group1');
    //         }, 200);
    //
    //         setTimeout(function() {
    //             timereport.endTimer('timer1', 'group1');
    //             timereport.endTimer('timer2', 'group1');
    //             timereport.endTimer('timer3', 'group1');
    //
    //             should(timereport.public_scope.groups['group1'].timers.length).equal(3);
    //             done();
    //         }, 300);
    //
    //     });
    //
    // });
    //
    // describe('Colors', function() {
    //
    //     it('it should be possible to set colors on a group', function() {
    //        timereport.setGroupColor(colors.red, 'testgroup1');
    //     });
    //
    // });
    //
    // describe("Flush", function() {
    //
    //     it("Flush function should clear all groups and kill all timers.", function() {
    //         //timereport.flush();
    //     });
    //
    // });
    //
    // describe('Prints', function() {
    //     it('should print the output in a nice way', function() {
    //        timereport.printGroup('group1');
    //     });
    // });

});
