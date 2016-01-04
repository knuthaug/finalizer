
function processYear(year) {
    var months = {};
    
    year.forEach(function(element) {
        var month = element.date.substr(4,2);
        if(!months[month]) {
            months[month] = { in: 0, out: 0};
        }
        months[month] = sumMonths(months[month], element, month);
    });

    console.log(months);
    console.log(categorySumsYearly(year, categories));
    //console.log(categorySumsMonthly(year, categories));
}

function sumMonths(existing, object, month) {
    var tmp = existing;
    tmp.in += object.in;
    tmp.out += object.out;
    return tmp;
}

function categorySumsMonthly(entries, categories) {
    var sums = {},
        monthTotals = {};
    
    entries.forEach(function(entry) {
        var month = entry.date.substr(4,2);
        var category = findCategory(entry, categories);
        
        if (!monthTotals[month]) {
            monthTotals[month] = 0;
        }

        if(!sums[month]) {
            sums[month] = {};
        }
        
        if(!sums[month][category]) {
            sums[month][category] = { value: 0};
        }
        sums[month][category].value += entry.out;
        monthTotals[month] += entry.out;
    });
    
    //calculate percentages
    Object.keys(sums).forEach(function(month){
        Object.keys(sums[month]).forEach(function(category) {
            sums[month][category].percentage = round10(sums[month][category].value / monthTotals[month] * 100, -2);
        });
    });

    return sums;
}

function categorySumsYearly(entries, categories) {
    var sums = {},
        yearTotal = 0;
    
    entries.forEach(function(entry) {
        var category = findCategory(entry, categories);
        if(!sums[category]) {
            sums[category] = {};
            sums[category].value = 0.0;
        }
        sums[category].value += entry.out;
        yearTotal += entry.out;
    });
    
    //calculate percentages
    Object.keys(sums).forEach(function(sum){
        sums[sum].percentage = round10(sums[sum].value / yearTotal * 100, -2);
    });

    return sums;
}

function findCategory(entry, categories) {
    var match = Object.keys(categories).filter(function(category){
        return categories[category].find(function(regex){
            return entry.description.match(regex);
        });
    });

    if(match[0]) {
        return match[0];
    }
    
    //console.log("unmatched entry: " + entry.description);
    return "Annet";
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


function round10(value, exp) {
    return decimalAdjust('round', value, exp);
}

function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}


module.exports.processYear = processYear;
module.exports.sortArray = sortArray;
module.exports.sumMonths = sumMonths;
module.exports.categorySumsYearly = categorySumsYearly;
module.exports.categorySumsMonthly = categorySumsMonthly;

