/*jshint node:true, strict:true */
"use strict";

var parser = require('../lib/parser.js'),
    sum = require('../lib/sum.js'),
    Db = require('../lib/db.js'),
    file = process.argv[2],
    year = process.argv[3],
    account = process.argv[4];

parser.parseFile(file, storeYear);

function storeYear(yearData) {
    var completeYear = sum.processYear(yearData);
    var db = new Db('localhost');

    db.storeYear(year, account, completeYear).then(function(reply){
        console.log("stored data to database");
        process.exit();
    }).catch(function(error){
        console.error("Error when saving data to database:" + error);
        process.exit();
    });
}

