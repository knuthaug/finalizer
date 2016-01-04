"use strict";

var parser = require('../lib/parser.js'),
    sum = require('../lib/sum.js'),
    file = process.argv[2];

parser.parseFile(file, sum.processYear);


