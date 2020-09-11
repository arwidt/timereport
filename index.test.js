"use strict";

var tr = require('./index.js');
var _ = require('lodash');
const print_default = require('./print_default.js');

describe('TimeReport.js', function() {

    describe('Current time', function() {

        it('should return correct time', function(done) {

            var t = tr.__public_scope.now();
            setTimeout(function() {
                var _t = ~~(tr.__public_scope.now() - t);
                if (_t > 990 && _t < 1010) {
                    _t = 1000;
                }
                expect(_t).toBe(1000);
                done();
            }, 1000);

        });

    });

    describe('Groups', function() {

        it('should have a default group setup from start named default', function() {
            expect(tr.__public_scope.groups['default']).toBeDefined();
        });

        it('should create a group if no group with that id is created before', function() {
            var group = tr.group('g1');
            expect(group).toHaveProperty('__opts');
            expect(group.__opts.id).toBe('g1');
        });

        it('should return the group if a group with that id is created before', function() {
            expect(tr.group('g1')).toBe(tr.__public_scope.groups['g1']);
        });

        it('should be possible to flush a group to reset all timers', function(done) {
            var group = tr.group('g1_flush');
            group.timer('g1_flush_t1');
            
            _.delay(() => {
                expect(tr.__public_scope.groups['g1_flush'].startTime).toBeDefined();

                group.flush();
                
                expect(tr.__public_scope.groups['g1_flush'].__timers).not.toHaveProperty('g1_flush_t1');
                expect(tr.__public_scope.groups['g1_flush'].startTime).not.toBeDefined();
                
                group.timer('g1_flush_t1');

                _.delay(() => {

                    group.timer('g1_flush_t1').stop();

                    expect(tr.__public_scope.groups['g1_flush'].__timers).toHaveProperty('g1_flush_t1');
                    expect(tr.__public_scope.groups['g1_flush'].__timers['g1_flush_t1'].status).toBe('stopped');
                    expect(tr.__public_scope.groups['g1_flush'].startTime).toBeDefined();

                    done();

                }, 500);
            }, 500);
        });

    });

    describe('Timers', function() {

        it ('groups should have timer function', function() {
            var group = tr.group('g1');
            expect(group).toHaveProperty('timer');
        });

        it('when calling timer on a group, with a undefined timer id, it should start a timer', function(done) {
            var t1 = tr.group('g1').timer('t1');
            _.delay(function() {
                t1.stop();
                var t = t1.time;
                if (t < 1010 && t > 990) {
                    t = 1000;
                }
                expect(t).toBe(1000);
                done();
            }, 1000);
        });
        
        it('when fetching a already created timer it should not start', function() {
            var t1 = tr.group('g1').timer('t1');
            expect(t1.status).toBe('stopped');
        });

        it('when calling timer func directly without group, timer should be placed in default group', function() {
            var d_t1 = tr.timer('d_t1');
            expect(d_t1).toBe(tr.__public_scope.groups['default'].__timers['d_t1']);
        });

        it('when calling timer with started id, it should return the timer object', function() {
            var dt_1 = tr.timer('d_t1');
            expect(dt_1).toBe(tr.__public_scope.groups['default'].__timers['d_t1']);
        });

        it('should be possible to start a timer inside a group', function() {
            var g1_t1 = tr.group('g1').timer('g1_t1');
            expect(g1_t1).toBe(tr.__public_scope.groups['g1'].__timers['g1_t1']);
        });

        it('should be possible to access a started timer from a group', function() {
            var g1_t1 = tr.group('g1').timer('g1_t1');
            expect(g1_t1).toBe(tr.__public_scope.groups['g1'].__timers['g1_t1']);
        });

        it('group.stop(), should stop all timers in a group', function() {
            var g1 = tr.group('g1');
            g1.stop();

            _.forEach(g1.__timers, function(timer) {
                expect(timer.status).toBe('stopped');
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

                    expect(totalTime).toBeGreaterThan(990);
                    expect(totalTime).toBeLessThan(1010);

                    g1.print();

                    done();

                }, 500);

            }, 500);

        });
    });

    describe('Timeline', function() {

        it('should be possible to print a timeline instead of a timer overview', function(done) {

            // this.timeout(3000);

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
