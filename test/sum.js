"use strict";
process.env.NODE_ENV = 'test';

var should  = require('should'),
    mocha   = require('mocha'),
    assert  = require('chai').assert,
    sum     = require('../bin/sum.js');


describe("the sum script", function(){

    describe('parseLine', function(){
        it('should return object with four elements for tab separated line', function(done){
            var foo = sum.parseLine("test\t1\t2,0\t3,0");
            assert.equal(foo.date, "test");
            assert.equal(foo.description, "1");
            assert.equal(foo.out, 2.0);
            assert.equal(foo.in, 3.0);
            done();
        });
        
        it('should return first 4 elements if more than 4', function(done){
            var foo = sum.parseLine("test\t1\t2,0\t3,0\t5\t6");
            assert.equal(foo.date, "test");
            assert.equal(foo.description, "1");
            assert.equal(foo.out, 2.0);
            assert.equal(foo.in, 3.0);
            done();
        });

        it('should return all elements if less than 4', function(done){
            var foo = sum.parseLine("test\t1\t2,0");
            assert.equal(foo.date, "test");
            assert.equal(foo.description, "1");
            assert.equal(foo.out, 2.0);
            assert.equal(foo.in, 0);
            done();
        });

        it('should return first element as YYYYMMDD', function(done){
            var foo = sum.parseLine("31.12.2014\t1\t2,0\t3,0");
            assert.equal(foo.date, "20141231");
            done();
        });

        it('should convert comma to point in numbers and parse floats', function(done){
            var foo = sum.parseLine("31.12.2014\t1\t223,34\t100");
            assert.equal(foo.out, 223.34);
            assert.equal(foo.in, 100.00);
            done();
        });

    });

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
                var months = {
                    "01": { "in": 0, "out": 0}, "02": { "in": 0, "out": 0}, 
                    "03": { "in": 0, "out": 0}, "04": { "in": 0, "out": 0}, 
                    "05": { "in": 0, "out": 0}, "06": { "in": 0, "out": 0}, 
                    "07": { "in": 0, "out": 0}, "08": { "in": 0, "out": 0}, 
                    "09": { "in": 0, "out": 0}, "10": { "in": 0, "out": 0}, 
                    "11": { "in": 0, "out": 0}, "12": { "in": 0, "out": 0}
                };
            
            var array = [
                {"date": "20140110", "in": 100.29, "out": 0},
                {"date": "20140101", "in": 1200, "out": 40},
                {"date": "20140120", "in": 200, "out": 0},
                {"date": "20140101", "in": 0, "out": 50},
            ];
            
            months = sum.sumMonths(months, array[0]);
            months = sum.sumMonths(months, array[1]);
            months = sum.sumMonths(months, array[2]);
            months = sum.sumMonths(months, array[3]);
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
});
