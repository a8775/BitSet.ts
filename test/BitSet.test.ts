'use strict';

import assert = require('assert');
import chai = require('chai');
var expect = chai.expect;

import {BitSet} from '../BitSet';

describe('BitSet.ts tests...', function() {

    describe('Test toOneZeroString() and set()', function() {
        let l = 16;
        let b: BitSet = new BitSet(l);
        let s: number = 0;

        it('one bit set(0), expect to be equal 0000000000000001', function() {
            b.set(0);
            expect(BitSet.toOneZeroString(b)).to.be.equal("0000000000000001");
        });
        it('two bits set(1), expect to be equal 0000000000000011', function() {
            b.set(1);
            expect(BitSet.toOneZeroString(b)).to.be.equal("0000000000000011");
        });
        it('three bits set(8), expect to be equal 0000000100000011', function() {
            b.set(8);
            expect(BitSet.toOneZeroString(b)).to.be.equal("0000000100000011");
        });
        it('four bits set(15), expect to be equal 1000000100000011', function() {
            b.set(15);
            expect(BitSet.toOneZeroString(b)).to.be.equal("1000000100000011");
        });
    });

    describe('Test toOneZeroString() and fromOneZeroString()', function() {
        let tests: { e: BitSet, es: string, a: BitSet, as: string }[] = [];
        for (let itest = 0; itest < 10; itest++) {
            let e: BitSet = new BitSet(32);
            for (let ibit = 0; ibit < 10; ibit++)
                e.set(Math.round(Math.random() * 32));
            let es: string = BitSet.toOneZeroString(e);
            let a: BitSet = BitSet.fromOneZeroString(es);
            let as: string = BitSet.toOneZeroString(a);

            tests.push({ e, es, a, as });
        }

        tests.forEach(function(test) {
            it('shold be equal ' + test.es, function() {
                expect(test.es).to.be.equal(test.as);
            });
        });
    });
    
    describe('Test Shl(1) and set(n)',function(){
        let tests: { e: BitSet, es: string, a: BitSet, as: string }[] = [];
        for (let itest = 0; itest < 33; itest++) {
            let e: BitSet = new BitSet(32);
            e.set(0);
            let a: BitSet = new BitSet(32);
            for (let ibit = 0; ibit < itest; ibit++) 
                e.shl(1);
            a.set(itest);
            let es: string = BitSet.toOneZeroString(e);
            let as: string = BitSet.toOneZeroString(a);

            tests.push({ e, es, a, as });
        }

        tests.forEach(function(test) {
            it('shold be equal ' + test.es, function() {
                expect(test.es).to.be.equal(test.as);
            });
        });
    });

    describe('Test shl(n) and set(n)',function(){
        let tests: { e: BitSet, es: string, a: BitSet, as: string }[] = [];
        for (let itest = 0; itest < 32; itest++) {
            let e: BitSet = new BitSet(32);
            e.set(0);
            e.shl(itest);
            let a: BitSet = new BitSet(32);
            a.set(itest);
            let es: string = BitSet.toOneZeroString(e);
            let as: string = BitSet.toOneZeroString(a);

            tests.push({ e, es, a, as });
        }

        tests.forEach(function(test) {
            it('shold be equal ' + test.es, function() {
                expect(test.es).to.be.equal(test.as);
            });
        });
    });
});



