
var fs = require('fs'),
    lines = require('line-reader'),
    year = [], 
    file = process.argv[2], 
    categories = {"Matvarer": [/gulating|isbilen|prix|Rema|meny|coop|kiwi|bunnpris|rimi|joker|ica|spar|vinmonopolet|maximat|gottebiten|euro cash/i], 
                  "Underholdning/kultur": [/nordisk film|nasjonalgall|donald duck|leos leke|fetsund lenser|kino|norli|ark|svensk film|tanum|museu|norsk tekni|vitensenter|NRK lisens|boklageret|kino|forskerfabrikken|tusenfryd|saga|liseberg|akvarium/i], 
                  "Restaurant/Kafe": [/pressbyr|7 - eleven|kroa|peppes|upper crust|point|egon|yummy|sushi|deli de luca|narvesen|cafe|kafe|vilspise|YOGURT HEAVEN|waynes|kaffebrenneriet|dropsen/i], 
                  "Hus": [/panduro|stoff & stil|obos|asko|hafslund|skogen II|ikea|møbelringen|belringen|princess|kid inte|maxbo|rafens|nille|clas ohl|kitchn/i], 
                  "Klær/sko": [/skogstad|h&m|kappahl|lindex|eurosko|cubus|skoringen|sportshopen|skopunkten/i], 
                  "Bredbånd/Data/telefon": [/get|komplett|phonect|tele2|teliasonera|one call/i], 
                  "Elektronikk/div": [/elkjøp|jernia|elkj/i],
                  "Forsikring": [/gjensidige|if/i], 
                  "skole": [/lørenskog|skolemelk/i],
                  "Helse": [/legesen|apote|klipp/i],
                  "Ferie": [/duty free|forex|ving|apollo|thomas cook|ilios palas|eikelandsosen|beito|fusa|haukeli|seljord|trysil|strömstad|strømstad/i],
                  "Post": [/post/i],
                  "Arnold": [/dyrego/i],
                  "Gebyrer": [/trans\(er\)|rebestilling|gebyr/i],
                  "Avis": [/romerikes blad|aftenposten|dagens Nærings/i],
                  "Fritid": [/speider|turistforening|checkinno|badet|klatreverket|bowling/i],
                  "Sparing": [/SHB liv/i], 
                  "Strøm": [/Ustekveikja/i], 
                  "Sport/Fritid": [/intersport|g-max|xxl|g-sport|super- g|super g/i], 
                  "Transport": [/randsfjord dekk|landbill|fjord1|bilettsalg|billettsalg|bilettbod|norled|M\/?F|MS tidebris|birger n haug|biltema|torshov bil|esso|shell|bilrekv|fjellinjen|nsb|ruter|statoil|garasjen|yx|vianor|tollregion oslo|bilpleie/i]};


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
    console.log(categorySumsYearly(year, categories));

}

function sumMonths(months, object) {
    var month = object.date.substr(4,2);
    //console.log(object)
    months[month].in += object.in;
    months[month].out += object.out;
    return months;
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
    console.log("unmatched entry: " + entry.description);
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


function round10(value, exp) {
    return decimalAdjust('round', value, exp);
};

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


module.exports.parseLine = parseLine;
module.exports.sortArray = sortArray;
module.exports.sumMonths = sumMonths;
module.exports.categorySumsYearly = categorySumsYearly;
