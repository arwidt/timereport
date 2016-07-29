module.exports = function(group) {
    "use strict";

    var timeprints  = require('./timeprints.js');
    var chalk       = require('chalk');

    var str = "";

    var groupTime = group.totalTime;
    var timers = [];
    for (var key in group.__timers) {
        timers.push(group.__timers[key].output);
    }

    timers.sort(function(a, b) {
        if (a.totalTime < b.totalTime) return 1;
        if (a.totalTime > b.totalTime) return -1;
        return 0;
    });

    // Longest name
    var nameLength = group.__opts.id.length;
    for (var i = 0, len = timers.length; i < len; i++) {
        if (nameLength < timers[i].id.length) {
            nameLength = timers[i].id.length;
        }
    }

    var _fillStr = function(str, length) {
        if (str.length >= length) {
            return str;
        }
        return str + Array(length-str.length + 1).join(" ");
    };

    var str = "";

    var totalTimeOutput = "";

    var progressLine = "-------------------------------------------------------------------------";

    totalTimeOutput += chalk.bold.red(_fillStr(group.__opts.id, nameLength));
    totalTimeOutput += chalk.red(" : "+progressLine+" ");
    totalTimeOutput += chalk.red("totalTime: " + timeprints.outputTime(groupTime));
    totalTimeOutput += "\n";

    str += totalTimeOutput;

    // Output the timeline
    var perc = 0,
        t,
        progress;
    for (var i = 0, len = timers.length; i < len; i++) {
        t = timers[i];
        progress = progressLine.replace(/-/g, "_").split('');
        progress[~~((timers[i].startTime/groupTime) * progress.length)] = "X";
        progress[~~(((timers[i].startTime+timers[i].totalTime)/groupTime) * progress.length)] = "X";

        progress = progress.join("").split("X");
        progress[1] = chalk.bold(t.color("-" + progress[1].replace(/_/g, "-") + "-"));
        progress = progress.join("");

        perc = ~~((t.totalTime / groupTime) * 100);
        str += t.color(_fillStr(t.id, nameLength) + " : ");

        str += progress;

        str += t.color(" " + chalk.bold(perc + "%, " + t.fancyTime));

        str += "\n";
    }
    
    console.log(str);
};