"use strict";

var parser = require('../lib/parser.js'),
    sum = require('../lib/sum.js'),
    db = require('../lib/db.js'),
    file = process.argv[2];
    year = process.argv[3];

parser.parseFile(file, storeYear);

function storeYear(yearData) {
    
}

