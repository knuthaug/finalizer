
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
    var months = {
        "01": { "in": 0, "out": 0}, "02": { "in": 0, "out": 0}, 
        "03": { "in": 0, "out": 0}, "04": { "in": 0, "out": 0}, 
        "05": { "in": 0, "out": 0}, "06": { "in": 0, "out": 0}, 
        "07": { "in": 0, "out": 0}, "08": { "in": 0, "out": 0}, 
        "09": { "in": 0, "out": 0}, "10": { "in": 0, "out": 0}, 
        "11": { "in": 0, "out": 0}, "12": { "in": 0, "out": 0}
    };
    
    year.forEach(function(element) {
        months = sumMonths(months, element);
    });

    console.log(months);

    //console.log(sortArray(year);

}

function sumMonths(months, object) {
    var month = object.date.substr(4,2);
    //console.log(object)
    months[month].in += object.in;
    months[month].out += object.out;
    return months;
}

function categorySumsYearly(entries, categories) {
    var sums = {};
    entries.forEach(function(entry) {
        var category = findCategory(entry, categories);
        if(!sums[category]) {
            sums[category] = 0.0;
        }
        sums[category] += entry.out;
    });
    return sums;
}

function findCategory(entry, categories) {
    var match = Object.keys(categories).filter(function(category){
        return categories[category].find(function(regex){
            return entry.description.match(regex);
        });
    });

    return match[0] ? match[0] : "Annet";
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
    return {"date": parts[0], 
            "description": parts[1], 
            "out": parts[2],
            "in": parts[3]}
}

module.exports.parseLine = parseLine;
module.exports.sortArray = sortArray;
module.exports.sumMonths = sumMonths;
module.exports.categorySumsYearly = categorySumsYearly;
