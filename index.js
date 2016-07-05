
var chalk = require('chalk');

var _timer = (function() {

    var _groups = {};
    var _colors = [chalk.red, chalk.green, chalk.yellow, chalk.blue, chalk.magenta, chalk.cyan];

    var _getColor = function() {
        _colors.unshift(_colors.pop());
        return _colors[0];
    };

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
    
    var _createGroup = function(opts) {
        var _opts = opts || {};
        var _timers = {};
        var _inst = {
            get __opts() {
                return _opts;
            },

            get __timers() {
                return _timers;
            },
            
            // Stops all timers and
            // flush all data and timers
            flush: function() {
                
            },

            get row() {
                return [];
            },
            
            // Prints the group in a specific style
            print: function(type) {

                var gtime = _inst.totalTime;
                var timers = [];
                for (var key in _timers) {
                    timers.push(_timers[key].output);
                }

                timers.sort(function(a, b) {
                    if (a.time < b.time) return 1;
                    if (a.time > b.time) return -1;
                    return 0;
                });

                var str = "";

                str += chalk.bold.red(_opts.id);
                str += chalk.red(" : ------------- ");
                str += chalk.red("totalTime: " + _outputTime(gtime));
                str += "\n";

                var perc = 0,
                    t;
                for (var i = 0, len = timers.length; i < len; i++) {
                    t = timers[i];
                    perc = ~~((t.time / gtime) * 100);
                    str += t.color(t.id + " : ");
                    str += t.color(Array(perc).join("-")) + " " + chalk.bold(perc + "%, " + t.fancyTime);
                    str += "\n";
                }

                console.log(str);
            },
            
            // Gets the total passed time
            // for all timers, regardless if its
            // active or not.
            get totalTime() {
                var total = 0;
                for (var key in _timers) {
                    total += _timers[key].time;
                }
                return total;
            },
            
            // Gets a timer by id in the scope
            // of this group.
            // If no timer is in this scope
            // one will be created.
            timer: function(id) {
                if (_timers.hasOwnProperty(id)) {
                    return _timers[id];
                }
                _timers[id] = _createTimer({
                    id: id,
                    color: _getColor(),
                    status: 'running',
                    startTime: _now(),
                    endTime: null,
                    totalTime: null
                });
                return _timers[id];
            },
            
            // Stops all active timers.
            stop: function() {
                for (var key in _timers) {
                    _timers[key].stop();
                }
            }
        };
        return _inst;
    };

    var _createTimer = function(_opts) {
        var _opts = _opts || {};
        var _inst = {
            get __opts() {
                return _opts;
            },
            set color(value) {
                _opts.color = value;
                return this;
            },
            get color() {
                return _opts.color;
            },
            start: function() {
                _opts.startTime = _now();
                _opts.status = 'running';
                return this;
            },
            stop: function() {
                _opts.endTime = _now();
                _opts.totalTime = ~(_opts.startTime - _opts.endTime).toFixed(3);
                _opts.status = 'stopped';
                return this;
            },
            get status() {
                return _opts.status;
            },
            get time() {
                if (_opts.endTime) {
                    return _opts.totalTime;
                } else {
                    console.error("TIMER NOT STOPPED");
                    return;
                }
            },
            get output() {
                return {
                    id: _opts.id,
                    time: _opts.totalTime,
                    fancyTime: _outputTime(_opts.totalTime),
                    color: _opts.color
                };
            },
            get row() {
                return [_opts.id, _outputTime(_opts.totalTime), "10%"];
            },
            print: function() {
                console.log(_opts.color("TIMER:", _opts.id, " -> ", _opts.totalTime + " ms"));
            }
        };
        return _inst;
    };

    _groups['default'] = _createGroup('default');

    var _inst = {
        __public_scope: {
            now: _now,
            groups: _groups
        },

        // Prints all groups
        print: function() {

        },

        // groups should create or get a group by a id.
        group: function(id) {
            if (_groups.hasOwnProperty(id)) {
                return _groups[id];
            }
            _groups[id] = _createGroup({
                id: id
            });
            return _groups[id];
        },

        // shorthand function to get a timer.
        // gets a timer by id, regardless of group
        // if more that one timer is created with the same name
        // an array with timers will be returned.
        // groupId is optional, if timerId has no
        // match in any group, it will be created in
        // the default group.
        timer: function(timerId) {
            return _inst.group('default').timer(timerId);
        }
    };

    return _inst;


})();

module.exports = _timer;
