
var colors = require('colors');
var tto = require('terminal-table-output');

var _timer = (function() {

    var _groups = {};

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
    
    var _createGroup = function(opts) {
        var _opts = opts || {};
        var _timers = [];
        var _inst = {
            get opts() {
                return _opts;
            },
            
            // Stops all timers and
            // flush all data and timers
            flush: function() {
                
            },
            
            // Prints the group in a specific style
            print: function(type) {
                // var group = _groups[groupId || "default"],
                //     timers = group.timers,
                //     total = 0;
                //
                // group.tto.pushrow(["Name", "Time     ", "Percent  "])
                //     .line();
                //
                // var i, len, row;
                // for (i = 0, len = timers.length; i < len; i++) {
                //     total += timers[i].time;
                // }
                // for (i = 0, len = timers.length; i < len; i++) {
                //     row = timers[i].row;
                //     row.push(Math.round((timers[i].time/total)*100) + " %");
                //     group.tto.pushrow(row);
                // }
                // group.tto.line("-");
                // group.tto.pushrow(["Total:", _outputTime(total), "100%"]);
                //
                // group.tto.print(true);    
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
                    startTime: _now(),
                    endTime: null,
                    totalTime: null
                });
                return _timers[id];
            },
            
            // Stops all active timers.
            stop: function() {
                
            }
        };
        return _inst;
    };

    var _createTimer = function(_opts) {
        var _opts = _opts || {};
        var _inst = {
            get opts() {
                return _opts;
            },
            set color(value) {
                _opts.color = value;
                return this;
            },
            start: function() {
                _opts.startTime = _now();
                return this;
            },
            stop: function() {
                _opts.endTime = _now();
                _opts.totalTime = ~(_opts.startTime - _opts.endTime).toFixed(3);
                return this;
            },
            get time() {
                if (_opts.endTime) {
                    return _opts.totalTime;
                } else {
                    console.error("TIMER NOT STOPPED");
                    return;
                }
            },
            get row() {
                return [_opts.id, _outputTime(_opts.totalTime)];
            },
            print: function() {
                console.log("TIMER:", _opts.id, " -> ", _opts.totalTime, " ms");
            }
        };
        return _inst;
    };

    _groups['default'] = _createGroup('default');

    var _inst = {
        public_scope: {
            now: _now,
            groups: _groups
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
        timer: function(timerId, groupId) {
            //console.log("startTimer:", timerId, groupId);

            // There is a timer
            // var group = _groups[groupId];
            // if (group) {
            //     var timers = _groups[groupId || "default"].timers;
            //     for (var i = 0, len = timers.length; i < len; i++) {
            //         if (timers[i].opts.id === timerId) {
            //             return timers[i];
            //         }
            //     }
            // }
            //
            // var timers = _groups[groupId || "default"].timers;
            // for (var i = 0, len = timers.length; i < len; i++) {
            //     if (timers[i].opts.id === timerId) {
            //         return timers[i];
            //     }
            // }
            //
            // if (!_groups.hasOwnProperty(groupId)) {
            //     _inst.createGroup(groupId);
            // }
            // var timer = _getTimer({
            //     id: timerId,
            //     startTime: _now(),
            //     endTime: null,
            //     totalTime: null
            // });
            // timer.start();
            // _groups[groupId || "default"].timers.push(timer);
            // return timer;
        }
    };

    return _inst;


})();

module.exports = _timer;
