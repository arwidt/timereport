"use strict";

var tr = require('../index.js');
var colors = require('colors');
var should = require('should');
var _ = require('lodash');

describe('TimeReport.js', function() {

    describe('Current time', function() {

        it('should return correct time', function(done) {

            var t = tr.__public_scope.now();
            setTimeout(function() {
                var _t = ~~(tr.__public_scope.now() - t);
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
            should.exist(tr.__public_scope.groups['default']);
        });

        it('should create a group if no group with that id is created before', function() {
            var group = tr.group('g1');
            group.should.have.ownProperty('__opts');
            group.__opts.id.should.equal('g1');
        });

        it('should return the group if a group with that id is created before', function() {
            tr.group('g1').should.equal(tr.__public_scope.groups['g1']);
        });

    });

    describe('Timers', function() {

        it ('groups should have timer function', function() {
            var group = tr.group('g1');
            group.should.have.hasOwnProperty('timer');
        });

        it('when calling timer on a group, with a undefined timer id, it should start a timer', function(done) {
            var t1 = tr.group('g1').timer('t1');
            _.delay(function() {
                t1.stop();
                var t = t1.time;
                if (t < 1010 && t > 990) {
                    t = 1000;
                }
                t.should.equal(1000);
                done();
            }, 1000);
        });
        
        it('when fetching a already created timer it should not start', function() {
            var t1 = tr.group('g1').timer('t1');
            t1.status.should.equal('stopped');
        });

        it('when calling timer func directly without group, timer should be placed in default group', function() {
            var d_t1 = tr.timer('d_t1');
            d_t1.should.equal(tr.__public_scope.groups['default'].__timers['d_t1']);
        });

        it('when calling timer with started id, it should return the timer object', function() {
            var dt_1 = tr.timer('d_t1');
            dt_1.should.equal(tr.__public_scope.groups['default'].__timers['d_t1']);
        });

        it('should be possible to start a timer inside a group', function() {
            var g1_t1 = tr.group('g1').timer('g1_t1');
            g1_t1.should.equal(tr.__public_scope.groups['g1'].__timers['g1_t1']);
        });

        it('should be possible to access a started timer from a group', function() {
            var g1_t1 = tr.group('g1').timer('g1_t1');
            g1_t1.should.equal(tr.__public_scope.groups['g1'].__timers['g1_t1']);
        });

        it('group.stop(), should stop all timers in a group', function() {
            var g1 = tr.group('g1');
            g1.stop();

            _.forEach(g1.__timers, function(timer) {
                timer.status.should.equal('stopped');
            });
        });

        it('should create a test timer for output part', function(done) {
            var group = tr.group('output');

            group.timer('timer1');
            group.timer('timer2');
            group.timer('timer3');
            group.timer('timer4');
            group.timer('timer5');
            group.timer('timer6');

            _.delay(function() { group.timer('timer1').stop(); }, 100);
            _.delay(function() { group.timer('timer2').stop(); }, 200);
            _.delay(function() { group.timer('timer3').stop(); }, 300);
            _.delay(function() { group.timer('timer4').stop(); }, 400);
            _.delay(function() { group.timer('timer5').stop(); }, 500);
            _.delay(function() { group.timer('timer6').stop(); }, 600);

            _.delay(function() { done(); }, 700);

        });

    });

    describe('Output', function() {

        it('groups should have correct totalTime', function() {
            var totaltime = tr.group('output').totalTime;
            var timers = tr.group('output').__timers;
            var timers_total = 0;
            _.forEach(timers, function(t) {
                 timers_total += t.time;
            });
            totaltime.should.equal(timers_total);
        });

        it('should be possible to print a single timer', function() {
            var timers = tr.group('output').__timers;
            _.forEach(timers, function(t) {
                t.print();
            });

        });

        it('should be possible to print a whole group', function() {

            tr.group('output').print();

        });


    });

    // describe('Output-time', function() {
    //
    //     it('should return x ms when less then 1 s', function() {
    //         should(timereport.__public_scope.outputTime(456)).equal("456 ms");
    //     });
    //
    //     it('should return x s when more than 1 s and less than 1 m', function() {
    //         should(timereport.__public_scope.outputTime(23123)).equal("23.123 s");
    //     });
    //
    //     it('should return x m and x s when more than 1 m but less than 1 h', function() {
    //         should(timereport.__public_scope.outputTime(60000*3+12345)).equal("3 m and 12.345 s");
    //     });
    //
    //     it('should return a funny text because you really should not use this on that long processes.', function() {
    //         should(timereport.__public_scope.outputTime(60000*123), "looong time!");
    //     });
    //
    // });
    //
    // describe('Groups', function() {
    //
    //     it('should create a new group when it is not created before', function() {
    //         timereport.createGroup('testgroup1');
    //         should(timereport.__public_scope.groups['testgroup1'].id).equal('testgroup1');
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
    //         should.exist(timereport.__public_scope.groups['specialgroup1']);
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
    //         should(timereport.__public_scope.groups['testgroup1'].timers.length).equal(2);
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
    //             should(timereport.__public_scope.groups['group1'].timers.length).equal(3);
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
