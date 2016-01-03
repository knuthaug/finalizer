"use strict";
process.env.NODE_ENV = 'test';

var should  = require('should'),
    mocha   = require('mocha'),
    assert  = require('chai').assert,
    parser     = require('../lib/parser.js');


describe("the parser library", function(){

    describe('parseLine', function(){
        it('should return object with four elements for tab separated line', function(done){
            var foo = parser.parseLine("test\t1\t2,0\t3,0");
            assert.equal(foo.date, "test");
            assert.equal(foo.description, "1");
            assert.equal(foo.out, 2.0);
            assert.equal(foo.in, 3.0);
            done();
        });
        
        it('should return first 4 elements if more than 4', function(done){
            var foo = parser.parseLine("test\t1\t2,0\t3,0\t5\t6");
            assert.equal(foo.date, "test");
            assert.equal(foo.description, "1");
            assert.equal(foo.out, 2.0);
            assert.equal(foo.in, 3.0);
            done();
        });

        it('should return all elements if less than 4', function(done){
            var foo = parser.parseLine("test\t1\t2,0");
            assert.equal(foo.date, "test");
            assert.equal(foo.description, "1");
            assert.equal(foo.out, 2.0);
            assert.equal(foo.in, 0);
            done();
        });

        it('should return first element as YYYYMMDD', function(done){
            var foo = parser.parseLine("31.12.2014\t1\t2,0\t3,0");
            assert.equal(foo.date, "20141231");
            done();
        });

        it('should convert comma to point in numbers and parse floats', function(done){
            var foo = parser.parseLine("31.12.2014\t1\t223,34\t100");
            assert.equal(foo.out, 223.34);
            assert.equal(foo.in, 100.00);
            done();
        });

    });

});
