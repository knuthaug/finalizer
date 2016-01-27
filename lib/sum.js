/*jshint node:true, strict:true */
"use strict";

var categories = {"Matvarer": { regex: [/gulating|isbilen|prix|Rema|meny|coop|kiwi|bunnpris/i, 
                               /rimi|joker|ica|spar|vinmonopolet|maximat|gottebiten|euro cash/i] }, 
                  "Underholdning/kultur": { regex: [/nordisk film|nasjonalgall|donald duck|leos leke/i,
                                           /fetsund lenser|kino|norli|ark|svensk film|tanum/i, 
                                           /museu|norsk tekni|vitensenter|NRK lisens|boklageret|kino/i, 
                                           /forskerfabrikken|tusenfryd|saga|liseberg|akvarium/i] }, 
                  "Restaurant/Kafe": { regex: [/pressbyr|7 - eleven|kroa|peppes|upper crust|point|egon/i, 
                                      /yummy|sushi|deli de luca|narvesen|cafe|kafe|vilspise/i, 
                                      /YOGURT HEAVEN|waynes|kaffebrenneriet|dropsen/i] }, 
                  "Hus": { regex: [/panduro|stoff & stil|obos|asko|hafslund|skogen II|ikea|møbelringen/i, 
                          /belringen|princess|kid inte|maxbo|rafens|nille|clas ohl|kitchn/i] }, 
                  "Klær/sko": { regex: [/skogstad|h&m|kappahl|lindex|eurosko|cubus|skoringen|sportshopen|skopunkten/i] }, 
                  "Bredbånd/Data/telefon": { regex: [/get|phonect|tele2|teliasonera|one call/i] }, 
                  "Elektronikk/div": { regex: [/elkjøp|jernia|elkj|komplett/i] },
                  "Forsikring": { regex: [/gjensidige|if/i] }, 
                  "skole": { regex: [/lørenskog|skolemelk/i] },
                  "Helse": { regex: [/legesen|apote|klipp/i] },
                  "Ferie": { regex: [/duty free|forex|ving|apollo|thomas cook|ilios palas|eikelandsosen/i, 
                            /beito|fusa|haukeli|seljord|trysil|strömstad|strømstad/i] },
                  "Post": { regex: [/post/i] },
                  "Arnold": { regex: [/dyrego/i] },
                  "Gebyrer": { regex: [/trans\(er\)|rebestilling|gebyr/i] },
                  "Avis": { regex: [/romerikes blad|aftenposten|dagens Nærings/i] },
                  "Fritid": { regex: [/speider|turistforening|checkinno|badet|klatreverket|bowling/i] },
                  "Sparing": { regex: [/SHB liv/i] }, 
                  "Strøm": { regex: [/Ustekveikja/i] }, 
                  "Sport/Fritid": { regex: [/intersport|g-max|xxl|g-sport|super- g|super g/i] }, 
                  "Transport": { regex: [/randsfjord dekk|landbill|fjord1|bilettsalg|billettsalg|bilettbod/i, 
                                /norled|M\/?F|MS tidebris|birger n haug|biltema|torshov bil|esso/i, 
                                /shell|bilrekv|fjellinjen|nsb|ruter|statoil|garasjen|yx|vianor|tollregion oslo|bilpleie/i]}};


function processYear(year) {
    var completeYear = {};
    var months = {};
    
    console.log(year);

    year.forEach(function(element) {
        var month = element.date.substr(4,2);
        if(!months[month]) {
            months[month] = { in: 0, out: 0};
        }
        months[month] = sumMonths(months[month], element, month);
    });

    completeYear.months = months;
    completeYear.entries = year;
    completeYear.categoriesYearly = categorySumsYearly(year, categories);
    completeYear.categoriesMonthly = categorySumsMonthly(year, categories);
    console.log(JSON.stringify(completeYear));
    return completeYear;
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
        var subCategory;

        if(category !== "Annet" && categories[category].hasOwnProperty("sub")) {
            subCategory = findCategory(entry, categories[category].sub);
        } else {
            subCategory = "Annet";
        }

        if(!sums[category]) {
            sums[category] = {};
            sums[category].value = 0.0;
            sums[category].sub = {};
        }

        if (!sums[category].sub[subCategory]) {
           sums[category].sub[subCategory] = {};
           sums[category].sub[subCategory].value = 0;
        }
        sums[category].value += entry.out;
        sums[category].sub[subCategory].value += entry.out;
        yearTotal += entry.out;
    });
    
    //calculate percentages
    Object.keys(sums).forEach(function(sum){
        sums[sum].percentage = round10(sums[sum].value / yearTotal * 100, -2);
        //sub percentages
        Object.keys(sums[sum].sub).forEach(function(subSum){
            sums[sum].sub[subSum].percentage = round10(sums[sum].sub[subSum].value / sums[sum].value * 100, -2);            
        });

    });

    return sums;
}

function findCategory(entry, categories) {
    var match = Object.keys(categories).filter(function(category){
        return categories[category].regex.find(function(regex){
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

