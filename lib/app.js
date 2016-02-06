/*jshint node:true, strict:true */
"use strict";

var Promise = require('bluebird'), 
    express = require('express'), 
    exphbs  = require('express-handlebars'),
    Db      = require('../lib/db'),
    app = express(),
    server, db;


Promise.longStackTraces();

module.exports.start  = function start() {

    db = new Db('localhost');
    app.engine('handlebars', exphbs({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');
    app.get('/', serveIndexPage);
    app.get('/favicon.ico', function(req, res){res.send("");});
    app.get('/api/v1/monthly/:year/:account', monthlySums);
    app.get('/api/v1/categories/monthly/:year/:account', categoryMonthlySums);
    app.get('/api/v1/categories/yearly/:year/:account', categoryYearlySums);

    var serverUrl = 'http://localhost:8080' +   '/';
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Server started on ' + serverUrl);
    server = app.listen(8080);
};


function serveIndexPage(req, res){
    res.render('index');
}

function monthlySums(req, res){
    db.getMonthlySums(req.params.year, req.params.account).then(function(result){
        res.send(result);
    }).catch(function(error){
        console.log("Error when fetching monthly sums:" + error);
        res.send(error).status(500);
    });
}

function categoryMonthlySums(req, res){

}

function categoryYearlySums(req, res){

}
