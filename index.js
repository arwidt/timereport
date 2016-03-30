
var colors = require('colors');

var _timer = (function() {

    var _groups = {};
    _groups['default'] = {
        id: 'default',
        timers: []
    };
    //var _groupBuffer;
    var _output = (function() {
        var _inst = function() {
            return {
                output: [[]],

                row: function() {
                    this.output.push([]);
                    return this;
                },

                col: function(s) {
                    this.output[this.output.length-1].push(s);
                    if (this.output.length > 1) {
                        this.output.forEach(function(lines) {
                            lines.forEach(function(line) {
                                console.log(line);
                            });
                        });
                    }
                    return this;
                },

                print: function() {
                    var str = "";
                    this.output.forEach(function(lines) {
                        lines.forEach(function(line, i, arr) {
                            str += line;
                            if (i < arr.length-1) {
                                str += " ";
                            }
                        });
                    });
                    return str;
                }
            };
        };

        return {
            create: function() {
                return _inst();
            }
        };
    })();    

    var _outputTime = function(t) {
        switch(true) {
            case (t < 1000):
                return t + " ms";
            case (t > 1000 && t < 60000):
                return t/1000 + " s";
            case (t > 60000 && t < 60000*60):
                return ~~(t/60000) + " m" + " and " + t%60000/1000 + " s";
            case (t >= 60000*60):
                return "looong time!";
        }
    };

    var _outputProgress = function(id, perc, time) {

        var str = " " + id + ": ";
        str += (Array(Math.round(30*perc)).join(" ")).black.bgWhite;
        str += " " + Math.round(perc*100) + "%";
        str += " " +  _outputTime(time);

        //(Array(Math.round(30*perc)).join(b)).black.bgWhite

        console.log(str);
    };

    var _now = (function() {
        var getNanoSeconds, hrtime, loadTime;

        if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
            return function() {
                return performance.now();
            };
        } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {

            hrtime = process.hrtime;
            getNanoSeconds = function() {
                var hr;
                hr = hrtime();
                return hr[0] * 1e9 + hr[1];
            };
            loadTime = getNanoSeconds();
            return function() {
                return (getNanoSeconds() - loadTime) / 1e6;
            };
        } else if (Date.now) {
            loadTime = Date.now();
            return function() {
                return Date.now() - loadTime;
            };
        } else {
            loadTime = new Date().getTime();
            return function() {
                return new Date().getTime() - loadTime;
            };
        }

    })();

    var _getTimer = function(_opts) {
        var _opts = _opts || {};
        var _inst = {
            get opts() {
                return _opts;
            },
            start: function() {
                _opts.startTime = _now();
            },
            stop: function() {
                _opts.endTime = _now();
                _opts.totalTime = ~(_opts.startTime - _opts.endTime).toFixed(3);
            },
            get time() {
                if (_opts.endTime) {
                    return _opts.totalTime;
                } else {
                    console.error("TIMER NOT STOPPED");
                    return;
                }
            },
            print: function() {
                console.log("TIMER:", _opts.id, " -> ", _opts.totalTime, " ms");
            }
        };
        return _inst;
    };

    var _inst = {
        public_scope: {
            now: _now,
            groups: _groups, 
            getTimer: _getTimer,
            outputTime: _outputTime,
            output: _output
        },

        createGroup: function(id) {
            if (_groups.hasOwnProperty(id)) {
                //console.warn(id + ' is taken as a groupId, please use another!');
                return this;
            }
            _groups[id] = {
                id: id,
                timers: []
            };
            return this;
        },

        //outputGroup: function(groupId) {
        //    var timers = _groups[groupId || "default"].timers;
        //    _groupBuffer = timers;
        //    return this;
        //},
        //
        //print: function() {
        //    if (_groupBuffer) {
        //       for (var i = 0, len = _groupBuffer.length; i < len; i++) {
        //            _groupBuffer[i].print();
        //
        //       }
        //    }
        //},

        printGroup: function(groupId) {
            //console.log("printGroup:", groupId);

            var timers = _groups[groupId || "default"].timers,
                total = 0;

            for (var i = 0, len = timers.length; i < len; i++) {
                //timers[i].print();
                //console.log(timers[i]);
                total += timers[i].time;
            }

            var str = " " + id + ": ";
            str += (Array(Math.round(30*perc)).join(" ")).black.bgWhite;
            str += " " + Math.round(perc*100) + "%";
            str += " " +  _outputTime(time);

            _output.create()
                .indent(1)
                .line("Total:")
                .print();

            _outputProgress("Total", 1, total);

            for (i = 0, len = timers.length; i < len; i++) {
                timers[i].opts.perc = timers[i].time / total;
                _outputProgress(timers[i].opts.id, timers[i].opts.perc, timers[i].time);
            }



            return this;
        },

        flush: function() {
            //console.log("Flush all groups and timers");
            _groups = [];
        },

        startTimer: function(timerId, groupId) {
            //console.log("startTimer:", timerId, groupId);
            if (!_groups.hasOwnProperty(groupId)) {
                _inst.createGroup(groupId);
            }

            var timer = _getTimer({
                id: timerId,
                startTime: _now(),
                endTime: null,
                totalTime: null
            });
            timer.start();
            _groups[groupId || "default"].timers.push(timer);
            return this;
        },

        endTimer: function(timerId, groupId) {
            //console.log("endTimer:", timerId);
            var timers = _groups[groupId || "default"].timers;
            for (var i = 0, len = timers.length; i < len; i++) {
                if (timers[i].opts.id === timerId) {
                    timers[i].stop();
                    return this;
                }
            }
        }
    };

    return _inst;


})();

module.exports = _timer;
