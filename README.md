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
	}, 1000);
	
	setTimeout(function() {
		timereport.group('compiler').timer('compile_sass').stop();
	}, 2000);
	
	setTimeout(function() {
		timereport.group('compiler').print();
	}, 2001);
	
The example above should output the following. (but with nice colors)

	compiler : ------------- totalTime: 2.998 s
	compile_sass : ----------------------------------------------------------------- 66%, 1.999 s
	compile_js : -------------------------------- 33%, 999 ms
	
