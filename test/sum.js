"use strict";
process.env.NODE_ENV = 'test';

var should  = require('should'),
    mocha   = require('mocha'),
    assert  = require('chai').assert,
    sum     = require('../bin/sum.js');


describe("the sum script", function(){

    describe('sortArray', function(){
        it('should order array by date field', function(done){
            var array = [
                {"date": "20141210", "in": 1},
                {"date": "20140101", "in": 1},
                {"date": "20150420", "in": 1},
                {"date": "20140201", "in": 1},
            ];
            var sorted = sum.sortArray(array);
            assert.deepEqual(sorted[0], {"date": "20140101", "in": 1});
            assert.deepEqual(sorted[1], {"date": "20140201", "in": 1});
            assert.deepEqual(sorted[2], {"date": "20141210", "in": 1});
            assert.deepEqual(sorted[3], {"date": "20150420", "in": 1});
            done();
        });
    });

    describe('sumMonths', function(){
        it('should sum values by month', function(done){
                var months = {"01": { in: 0, out: 0}};
            
            var array = [
                {"date": "20140110", "in": 100.29, "out": 0},
                {"date": "20140101", "in": 1200, "out": 40},
                {"date": "20140120", "in": 200, "out": 0},
                {"date": "20140101", "in": 0, "out": 50},
            ];
            
            months["01"] = sum.sumMonths(months["01"], array[0], "01");
            months["01"] = sum.sumMonths(months["01"], array[1], "01");
            months["01"] = sum.sumMonths(months["01"], array[2], "01");
            months["01"] = sum.sumMonths(months["01"], array[3], "01");
            assert.deepEqual(months["01"], {"in": 1500.29, "out": 90 });
            done();
        });
    });

    describe('categorySumsYearly', function(){
        it('should sum values by category', function(done){
            var array = [
                {"date": "20140110", "in": 0, "out": 120, "description": "Rema"},
                {"date": "20140101", "in": 0, "out": 400, "description": "ESSO SKÅRER"},
                {"date": "20140101", "in": 0, "out": 400, "description": "shell SKÅRER"},
                {"date": "20140120", "in": 0, "out": 320, "description": "LØRENSKOG KINO"},
                {"date": "20140101", "in": 0, "out": 500, "description": "AB klipp"},
            ];
            
            var categories = {"Matvarer": [/foo/i, /Rema/i], "Underholdning": [/kino/i], "Transport": [/esso|shell/i]};
            
            var sums = sum.categorySumsYearly(array, categories);
            assert.deepEqual(sums, { "Matvarer": {"value": 120, "percentage": 6.9}, 
                                     "Underholdning": { "value": 320, "percentage": 18.39}, 
                                     "Annet": {"value": 500, "percentage": 28.74}, 
                                     "Transport": {"value": 800, "percentage": 45.98}});
            done();
        });
    });

    describe('categorySumsMonthly', function(){
        it('should sum values by category', function(done){
            var array = [
                {"date": "20140110", "in": 0, "out": 120, "description": "Rema"},
                {"date": "20140101", "in": 0, "out": 400, "description": "ESSO SKÅRER"},
                {"date": "20140201", "in": 0, "out": 400, "description": "ESSO SKÅRER"},
                {"date": "20140101", "in": 0, "out": 400, "description": "shell SKÅRER"},
                {"date": "20140120", "in": 0, "out": 320, "description": "LØRENSKOG KINO"},
                {"date": "20140101", "in": 0, "out": 500, "description": "AB klipp"},
            ];
            
            var categories = {"Matvarer": [/foo/i, /Rema/i], "Underholdning": [/kino/i], "Transport": [/esso|shell/i]};
            
            var sums = sum.categorySumsMonthly(array, categories);
            assert.deepEqual(sums, { "01" : { "Matvarer": {"value": 120, "percentage": 6.9}, 
                                              "Underholdning": { "value": 320, "percentage": 18.39}, 
                                              "Annet": {"value": 500, "percentage": 28.74}, 
                                              "Transport": {"value": 800, "percentage": 45.98}}, 
                                     "02": { "Transport": {"value": 400, "percentage": 100}}});
            done();
        });
    });

});
