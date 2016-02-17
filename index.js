
var colors = require('colors');
var now = require('performance-now');

var _timer = (function() {

    var _groups = {};
    _groups['default'] = {
        id: 'default',
        timers: []
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

    var _getTimer = function(_opts) {
        var _opts = _opts || {};
        var _inst = {
            opts: function() {
                return _opts;
            },
            start: function() {
                _opts.startTime = now();
            },
            stop: function() {
                _opts.endTime = now();
                _opts.totalTime = (_opts.startTime - _opts.endTime).toFixed(3);
            },
            getTime: function() {
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
            groups: _groups, 
            getTimer: _getTimer,
            outputTime: _outputTime
        },
        createGroup: function(id) {
            if (_groups.hasOwnProperty(id)) {
                console.warn(id + ' is taken as a groupId, please use another!');
                return this;
            }
            _groups[id] = {
                id: id,
                timers: []
            };
            return this;
        },

        printGroup: function(groupId) {
            console.log("printGroup:");

            var timers = _groups[groupId || "default"].timers;
            for (var i = 0, len = timers.length; i < len; i++) {
                timers[i].print();
            }

            return this;
        },
        
        flushAll: function() {
            console.log("Flush all groups and timers");
            _groups = [];
        },

        startTimer: function(timerId, groupId) {
            console.log("startTimer:", timerId, groupId);
            if (!_groups.hasOwnProperty(groupId)) {
                _inst.createGroup(groupId);
            }

            var timer = _getTimer({
                id: timerId,
                startTime: now(),
                endTime: null,
                totalTime: null
            });
            timer.start();
            _groups[groupId || "default"].timers.push(timer);
            return this;
        },

        endTimer: function(timerId, groupId) {
            console.log("endTimer:", timerId);
            var timers = _groups[groupId || "default"].timers;
            for (var i = 0, len = timers.length; i < len; i++) {
                if (timers[i].opts().id === timerId) {
                    timers[i].stop();
                    return this;
                }
            }
        }
    };

    return _inst;


})();

module.exports = _timer;
