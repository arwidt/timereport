
var colors = require('colors');
var now = require('performance-now');

var _timer = (function() {

    var _groups = {};
    _groups['default'] = {
        id: 'default',
        timers: []
    };
        
    var _outputTime = function(m) {
        switch(true) {
            case (m < 1000):
                return m + "ms";
            case (m > 1000 && m < 60000):
                return m/1000 + "s";
            case (m > 60000 && m < 60000*60):
                return m;
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
        createGroup: function(id) {
            if (_groups.hasOwnProperty(id)) {
                console.log(id + ' is taken as a groupId, please use another!');
                return;
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

        startTimer: function(timerId, groupId) {
            console.log("startTimer:", timerId, groupId);
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
                    return;
                }
            }
        }
    };

    return _inst;


})();

module.exports = _timer;
