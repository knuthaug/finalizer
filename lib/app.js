/*jshint node:true, strict:true */
"use strict";

var Promise = require('bluebird'), 
    express = require('express'), 
    exphbs  = require('express-handlebars'),
    app = express(),
    server;


Promise.longStackTraces();

module.exports.start  = function start() {

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

}

function categoryMonthlySums(req, res){

}

function categoryYearlySums(req, res){

}
