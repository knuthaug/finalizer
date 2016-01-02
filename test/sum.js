"use strict";
process.env.NODE_ENV = 'test';

var should  = require('should'),
    mocha   = require('mocha'),
    assert  = require('chai').assert,
    sum     = require('../bin/sum.js');


describe("the sum scripte", function(){

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
    });
});
