"use strict";

var assert = require('assert');
var timereport = require('../index.js');

describe('TimeReport.js', function() {
    describe('Public functions', function() {
        it('should return itself when running specific functions', function() {
            assert.equal(timereport.createGroup('test'), timereport);
        });
    });
});
