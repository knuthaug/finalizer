"use strict";

var parser = require('../lib/parser.js'),
    sum = require('../lib/sum.js'),
    Db = require('../lib/db.js'),
    file = process.argv[2],
    year = process.argv[3],
    account = process.argv[4];

parser.parseFile(file, storeYear);

function storeYear(yearData) {
    var db = new Db('localhost');
    //store sums also
    db.storeYear(year, account, yearData).then(function(reply){
        console.log("stored data to database");
        process.exit();
    }).catch(function(error){
        console.error("Error when saving data to database:" + error);
    });
}

