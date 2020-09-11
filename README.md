#TIMEREPORT

Keep time of your tasks or code. Great for tracking what gulp/grunt tasks take the most time and try to optimize from there.

[![NPM](https://nodei.co/npm/timereport.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/timereport/)

## Installation

	npm install timereport
	
## Usage

	var timereport = require('timereport');
	
	timereport.group('compiler').timer('compile_js');
    timereport.group('compiler').timer('compile_sass');

    setTimeout(function() {
        timereport.group('compiler').timer('compile_js').stop();

        timereport.group('compiler').timer('upload_js');
        setTimeout(function() {
            timereport.group('compiler').timer('upload_js').stop();
        }, 100);
    }, 1000);

    setTimeout(function() {
        timereport.group('compiler').timer('compile_sass').stop();

        timereport.group('compiler').timer('wrap_things_up');
        setTimeout(function() {
            timereport.group('compiler').timer('wrap_things_up').stop();

            timereport.group('compiler').print();
            timereport.group('compiler').print('timeline');
        }, 100);

    }, 2000);
	
The example above should output the following. (but with nice colors)

Default print

	compiler       : ------------- totalTime: 2.11 s
    compile_sass   : ---------------------------------------------- 94%, 2.004 s
    compile_js     : ---------------------- 47%, 1.004 s
    wrap_things_up : - 4%, 104 ms
    upload_js      : - 4%, 102 ms

Timeline print

    compiler       : ------------------------------------------------------------------------- totalTime: 2.11 s
    compile_js     : -----------------------------------______________________________________ 47%, 1.004 s
    compile_sass   : ----------------------------------------------------------------------___ 94%, 2.004 s
    upload_js      : __________________________________-----__________________________________ 4%, 102 ms
    wrap_things_up : _____________________________________________________________________---- 4%, 104 ms
	
## Contribute

The project uses Jest for testing, clone project and run `npm i; npm test` or `jest` if you have installed globally.
