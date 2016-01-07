var Promise = require('bluebird'),
    mongo   = Promise.promisifyAll(require('mongoose')),
    conn, 
    Year;


function Db(connection) {
    if(connection){
        conn = connection;
    } else {
        mongo.connect('mongodb://' + hosts + '/finalizer');
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


function addBuildSchema() {
    var yearSchema = mongo.Schema({
        account: String,
        year: Number,
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


Jira.prototype.storeYear = function storeYear(year, data){
    return;
};

module.exports = Db;

