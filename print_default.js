// "use strict"; // Not needed in ES modules

import timeprints from './timeprints.js';
import chalk from 'chalk';

export default function(group) {
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

    str += chalk.bold.red(_fillStr(group.__opts.id, nameLength));
    str += chalk.red(" : ------------- ");
    str += chalk.red("totalTime: " + timeprints.outputTime(groupTime));
    str += "\n";

    var perc = 0,
        t;
    for (var i = 0, len = timers.length; i < len; i++) {
        t = timers[i];
        perc = ~~((t.totalTime / groupTime) * 100);
        str += t.color(_fillStr(t.id, nameLength) + " : ");
        str += t.color(Array(~~(Math.max(0, perc/2))).join("-")) + " " + chalk.bold(perc + "%, " + t.fancyTime);
        str += "\n";
    }

    console.log(str);
};