/*jshint node:true, strict:true */
"use strict";

var Promise = require('bluebird'),
    mongo   = Promise.promisifyAll(require('mongoose')),
    Schema = mongo.Schema,
    conn, 
    Year, 
    db;

Promise.longStackTraces();

function Db(host, connection) {
    if(connection){
        conn = connection;
    } else {
        mongo.connect('mongodb://' + host + '/finalizer');
        db = mongo.connection;

        db.on('error', function(err) {
            console.log('Mongodb connection error:' + err);
            process.exit();
        });
        
        db.once('open', function (callback) {
            console.info("connected to mongodb on " + host);
        });
        
        addYearSchema();
        return this; 
    }        
}


function addYearSchema() {
    var yearSchema = mongo.Schema({
        account: String,
        year: Number,
        months: Schema.Types.Mixed,
        categoriesYearly: Schema.Types.Mixed,
        categoriesMonthly: Schema.Types.Mixed,
        entries:[
            { date: Date,
              description: String,
              out: Number,
              in: Number
            }
        ]
    });

    Year = mongo.model('Year', yearSchema);
    Promise.promisifyAll(Year);
    Promise.promisifyAll(Year.prototype);
}

Db.prototype.getMonthlySums = function getMonthlySums(year, account) {
    return Year.findOneAsync({year: year, account: account}).then(function(result){
        return Promise.resolve(result.months);
    }).catch(function(error){
        return Promise.reject("Could not find monthly sums for " + year + " " + account);
    });
};

Db.prototype.storeYear = function storeYear(year, account, data){
    //console.log(data.months);

    return Year.findOneAsync({year: year, account: account}).then(function(result) {
        //found existing year, replace it
        if(result) {
            //console.log(result.months);
            result.data = convertDates(data.entries);
            result.months = data.months;
            result.categoriesMonthly = data.categoriesMonthly;
            result.categoriesYearly = data.categoriesYearly;
            return result.saveAsync();
        } else {
            return new Year({
                year: year, 
                account: account,
                entries: convertDates(data.entries),
                months: data.months,
                categoriesMonthly: data.categoriesMonthly,
                categoriesYearly: data.categoriesYearly

            }).saveAsync();
        }
    });

};

function convertDates(data){
    var newData = [];
    data.forEach(function(el){
        var year = el.date.substr(0,4);
        var month = el.date.substr(4, 2);
        var day = el.date.substr(6,2);
        //console.log(year + "-" + month + "-" + day);
        newData.push({
            date: new Date(year, (month - 1), day),
            description: el.desctiption, 
            in: el.in,
            out: el.out
        });
    });

    return newData;
}

module.exports = Db;

