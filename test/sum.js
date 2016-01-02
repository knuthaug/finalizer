"use strict";
process.env.NODE_ENV = 'test';

var should  = require('should'),
    mocha   = require('mocha'),
    assert  = require('chai').assert,
    sum     = require('../bin/sum.js');


describe("the sum script", function(){

    describe('parseLine', function(){
        it('should return object with four elements for tab separated line', function(done){
            var foo = sum.parseLine("test\t1\t2\t3");
            assert.equal(foo.date, "test");
            assert.equal(foo.description, "1");
            assert.equal(foo.out, "2");
            assert.equal(foo.in, "3");
            done();
        });
        
        it('should return first 4 elements if more than 4', function(done){
            var foo = sum.parseLine("test\t1\t2\t3\t5\t6");
            assert.equal(foo.date, "test");
            assert.equal(foo.description, "1");
            assert.equal(foo.out, "2");
            assert.equal(foo.in, "3");
            done();
        });

        it('should return all elements if less than 4', function(done){
            var foo = sum.parseLine("test\t1\t2");
            assert.equal(foo.date, "test");
            assert.equal(foo.description, "1");
            assert.equal(foo.out, "2");
            assert.equal(foo.in, undefined);
            done();
        });

        it('should return first element as YYYYMMDD', function(done){
            var foo = sum.parseLine("31.12.2014\t1\t2");
            assert.equal(foo.date, "20141231");
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
});
