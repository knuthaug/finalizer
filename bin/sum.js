
var fs = require('fs'),
    lines = require('line-reader'),
    year = [], 
    file = process.argv[2];


fs.exists(file, function(exists) {
    lines.eachLine(file, function(line, last) {
        var entry = parseLine(line);
        year.push(entry)
        if(last) {
            processYear(year);
        }
    });
});

function processYear(year) {
    
}

function parseLine(line) {
    var parts = line.split('\t');
    return {"date": parts[0], 
            "description": parts[1], 
            "out": parts[2],
            "in": parts[3]}
}

module.exports.parseLine = parseLine;
