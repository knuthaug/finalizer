
var fs = require('fs'),
    lines = require('line-reader'),
    year = [], 
    file = process.argv[2];


fs.exists(file, function(exists) {
    lines.eachLine(file, function(line, last) {
        var entry = parseLine(line);
        if(entry.date !== "Dato") {
            year.push(entry)
        }

        if(last) {
            processYear(year);
        }
    });
});

function processYear(year) {
    console.log(sortArray(year)
);
}

function sortArray(array) {
    return array.sort(compare);
}

function compare(a, b) {
  if (a.date < b.date)
    return -1;
  if (a.date > b.date)
    return 1;
  return 0;
}

function parseLine(line) {
    var parts = line.split('\t');
    if(parts[0].indexOf("\.") > -1) {
        var dateParts = parts[0].split(".");
        parts[0] = dateParts[2] + dateParts[1] + dateParts[0];
    }
    return {"date": parts[0], 
            "description": parts[1], 
            "out": parts[2],
            "in": parts[3]}
}

module.exports.parseLine = parseLine;
module.exports.sortArray = sortArray;
