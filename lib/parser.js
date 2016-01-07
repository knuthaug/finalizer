var lines = require('line-reader'), 
    fs = require('fs');


function parseFile(filename, callback) {
    var year = [];
    fs.exists(filename, function(exists) {
        lines.eachLine(filename, function(line, last) {
            var entry = parseLine(line);
            if(entry.date !== "Dato") {
                year.push(entry);
            }
            
            if(last) {
                callback(year);
            }
        });
    });
}

function parseLine(line) {
    var parts = line.split('\t');

    if(parts[0].indexOf(".") > -1) {
        var dateParts = parts[0].split(".");
        parts[0] = dateParts[2] + dateParts[1] + dateParts[0];
    }

    if(parts[2]) {
        parts[2] = Number.parseFloat(parts[2].replace(",", "."));
    } else {
        parts[2] = 0;
    }

    if(parts[3]) {
        parts[3] = Number.parseFloat(parts[3].replace(",", "."));
    } else {
        parts[3] = 0;
    }
    return {
        "date": parts[0], 
        "description": parts[1], 
        "out": parts[2],
        "in": parts[3]
    };
}


module.exports.parseFile = parseFile;
module.exports.parseLine = parseLine;
