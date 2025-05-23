// "use strict"; // Not needed in ES modules, they are strict by default.

const timeprints = {
    outputTime: function(t) {
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
    }
};

export default timeprints;