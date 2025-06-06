// "use strict"; // Not needed in ES modules

import timeprints from './timeprints.js';
import chalk from 'chalk';

export default function(group) {
    var str = "";

    var groupTime = group.totalTime;
    var timers = [];
    for (var key in group.__timers) {
        timers.push(group.__timers[key].output);
    }

    timers.sort(function(a, b) {
        if (a.startTime < b.startTime) return -1;
        if (a.startTime > b.startTime) return 1;
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
        if (progress.length > 2) {
            progress[1] = t.color("-" + progress[1].replace(/_/g, "-") + "-");
            progress = progress.join("");
        } else if (progress.length < 3) {
            progress = progress.join(t.color("-"));
        }

        perc = ~~((t.totalTime / groupTime) * 100);
        str += t.color(_fillStr(t.id, nameLength) + " : ");

        str += progress;

        str += t.color(" " + perc + "%, " + t.fancyTime);

        str += "\n";
    }
    
    console.log(str);
};