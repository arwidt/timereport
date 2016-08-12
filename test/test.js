"use strict";

var tr = require('../index.js');
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

            group.timer('timer1_asdf');
            group.timer('timer2_asd');
            group.timer('timer3_asdf asdf');
            group.timer('timer4_okokok');
            group.timer('timer5_');
            group.timer('timer6_ _ _');

            _.delay(function() { group.timer('timer1_asdf').stop(); }, 100);
            _.delay(function() { group.timer('timer2_asd').stop(); }, 200);
            _.delay(function() { group.timer('timer3_asdf asdf').stop(); }, 300);
            _.delay(function() { group.timer('timer4_okokok').stop(); }, 400);
            _.delay(function() { group.timer('timer5_').stop(); }, 500);
            _.delay(function() { group.timer('timer6_ _ _').stop(); }, 600);

            _.delay(function() { done(); }, 700);

        });

    });

    describe('Output', function() {

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

    describe('TotalTime', function() {

        it('totalTime should be calculated from the first timer starts to when the last timer stops.', function(done) {
            var g1 = tr.group('group1');
            g1.timer('timer1');

            _.delay(function() {
                g1.timer('timer1').stop();

                g1.timer('timer2');

                _.delay(function() {

                    g1.timer('timer2').stop();

                    var totalTime = g1.totalTime;

                    totalTime.should.be.within(980, 1020);

                    g1.print();

                    done();

                }, 500);

            }, 500);

        });
    });

    describe('Timeline', function() {

        it('should be possible to print a timeline instead of a timer overview', function(done) {

            this.timeout(3000);

            var tg1 = tr.group('timeline');
            tg1.timer('timer1');
            _.delay(function() {
                tg1.timer('timer2');

                tg1.timer('short');
                _.defer(function() {
                    tg1.timer('short').stop();
                });
            }, 500);

            _.delay(function() {
                tg1.timer('timer3');
            }, 1000);

            _.delay(function() {
                tg1.timer('timer1').stop();
            }, 1500);

            _.delay(function() {
                tg1.timer('timer2').stop();
            }, 2000);

            _.delay(function() {
                tg1.timer('timer3').stop();

                tg1.print('timeline');

                done();
            }, 2500);

        });

    });

    describe('Output', function() {
        it('should output a test for readme file', function() {

            tr.group('compiler').timer('compile_js');
            tr.group('compiler').timer('compile_sass');

            setTimeout(function() {
                tr.group('compiler').timer('compile_js').stop();

                tr.group('compiler').timer('upload_js');
                setTimeout(function() {
                    tr.group('compiler').timer('upload_js').stop();
                }, 100);
            }, 1000);

            setTimeout(function() {
                tr.group('compiler').timer('compile_sass').stop();

                tr.group('compiler').timer('wrap_things_up');
                setTimeout(function() {
                    tr.group('compiler').timer('wrap_things_up').stop();

                    tr.group('compiler').print();
                    tr.group('compiler').print('timeline');
                }, 100);

            }, 2000);

        });
    });
});
