'use strict';

import assert = require('assert');
import chai = require('chai');
var expect = chai.expect;

import {BitSet, BitSetSerializeType} from '../BitSet';

describe('BitSet.ts tests...', function() {

    describe('Test default (OneZero not prefixed) stringify() and set()', function() {
        let l = 16;
        let b: BitSet = new BitSet(l);
        let s: number = 0;

        it('none bit set, expect to be equal 0000000000000000', function() {
            expect(BitSet.stringify(b)).to.be.equal("0000000000000000");
        });
        it('one bit set(0), expect to be equal 0000000000000001', function() {
            b.set(0);
            expect(BitSet.stringify(b)).to.be.equal("0000000000000001");
        });
        it('two bits set(1), expect to be equal 0000000000000011', function() {
            b.set(1);
            expect(BitSet.stringify(b)).to.be.equal("0000000000000011");
        });
        it('three bits set(8), expect to be equal 0000000100000011', function() {
            b.set(8);
            expect(BitSet.stringify(b)).to.be.equal("0000000100000011");
        });
        it('four bits set(15), expect to be equal 1000000100000011', function() {
            b.set(15);
            expect(BitSet.stringify(b)).to.be.equal("1000000100000011");
        });
    });

    describe('Test stringify() and fromOneZeroString()', function() {
        let tests: { e: BitSet, es: string, a: BitSet, as: string }[] = [];
        for (let itest = 0; itest < 10; itest++) {
            let e: BitSet = new BitSet(32);
            for (let ibit = 0; ibit < 10; ibit++)
                e.set(Math.round(Math.random() * 32));
            let es: string = BitSet.stringify(e);
            let a: BitSet = BitSet.parse(es);
            let as: string = BitSet.stringify(a);

            tests.push({ e, es, a, as });
        }

        tests.forEach(function(test) {
            it('shold be equal ' + test.es, function() {
                expect(test.es).to.be.equal(test.as);
            });
        });
    });

    describe('Test shift left by 1: shift(1) and set(n)', function() {
        let tests: { e: BitSet, es: string, a: BitSet, as: string }[] = [];
        for (let itest = 0; itest < 33; itest++) {
            let e: BitSet = new BitSet(32);
            e.set(0);
            let a: BitSet = new BitSet(32);
            for (let ibit = 0; ibit < itest; ibit++)
                e.shift(1);
            a.set(itest);
            let es: string = BitSet.stringify(e);
            let as: string = BitSet.stringify(a);

            tests.push({ e, es, a, as });
        }

        tests.forEach(function(test) {
            it('shold be equal ' + test.es, function() {
                expect(test.es).to.be.equal(test.as);
            });
        });
    });

    describe('Test shift left by n: shift(n) and set(n)', function() {
        let tests: { e: BitSet, es: string, a: BitSet, as: string }[] = [];
        for (let itest = 0; itest < 32; itest++) {
            let e: BitSet = new BitSet(32);
            e.set(0);
            e.shift(itest);
            let a: BitSet = new BitSet(32);
            a.set(itest);
            let es: string = BitSet.stringify(e);
            let as: string = BitSet.stringify(a);

            tests.push({ e, es, a, as });
        }

        tests.forEach(function(test) {
            it('shold be equal ' + test.es, function() {
                expect(test.es).to.be.equal(test.as);
            });
        });
    });

    describe('Test shift right by 1: shift(-1) and set(n)', function() {
        let tests: { e: BitSet, es: string, a: BitSet, as: string }[] = [];
        for (let itest = 0; itest < 32; itest++) {
            let e: BitSet = new BitSet(32);
            e.set(31);
            let a: BitSet = new BitSet(32);
            for (let ibit = 0; ibit < itest; ibit++)
                e.shift(-1);
            a.set(31 - itest);
            let es: string = BitSet.stringify(e);
            let as: string = BitSet.stringify(a);

            tests.push({ e, es, a, as });
        }

        tests.forEach(function(test) {
            it('shold be equal ' + test.es, function() {
                expect(test.es).to.be.equal(test.as);
            });
        });
    });

    describe('Test shift right by n: shift(n) and set(n)', function() {
        let tests: { e: BitSet, es: string, a: BitSet, as: string }[] = [];
        for (let itest = 0; itest < 32; itest++) {
            let e: BitSet = new BitSet(32);
            e.set(31);
            e.shift(-itest);
            let a: BitSet = new BitSet(32);
            a.set(31 - itest);
            let es: string = BitSet.stringify(e);
            let as: string = BitSet.stringify(a);

            tests.push({ e, es, a, as });
        }

        tests.forEach(function(test) {
            it('shold be equal ' + test.es, function() {
                expect(test.es).to.be.equal(test.as);
            });
        });
    });

    describe('Test Hex stringify', function() {
        let l = 16;
        let b: BitSet = new BitSet(l);
        let s: number = 0;

        it('none bit set, expect to be equal BitSet:HEX(16):0000', function() {
            expect(BitSet.stringify(b, BitSetSerializeType.Hex)).to.be.equal("BitSet:HEX(16):0000");
        });
        it('one bit set(0), expect to be equal BitSet:HEX(16):0001', function() {
            b.set(0);
            expect(BitSet.stringify(b, BitSetSerializeType.Hex)).to.be.equal("BitSet:HEX(16):0001");
        });
        it('two bits set(1), expect to be equal BitSet:HEX(16):0003', function() {
            b.set(1);
            expect(BitSet.stringify(b, BitSetSerializeType.Hex)).to.be.equal("BitSet:HEX(16):0003");
        });
        it('three bits set(8), expect to be equal BitSet:HEX(16):0103', function() {
            b.set(8);
            expect(BitSet.stringify(b, BitSetSerializeType.Hex)).to.be.equal("BitSet:HEX(16):0103");
        });
        it('four bits set(15), expect to be equal BitSet:HEX(16):8103', function() {
            b.set(15);
            expect(BitSet.stringify(b, BitSetSerializeType.Hex)).to.be.equal("BitSet:HEX(16):8103");
        });
    });

    describe('Test Base64 stringify', function() {
        let l = 16;
        let b: BitSet = new BitSet(l);
        let s: number = 0;

        it('none bit set, expect to be equal BitSet:BASE64(16):AAA=', function() {
            expect(BitSet.stringify(b, BitSetSerializeType.Base64)).to.be.equal("BitSet:BASE64(16):AAA=");
        });
        it('one bit set(0), expect to be equal BitSet:BASE64(16):AQA=', function() {
            b.set(0);
            expect(BitSet.stringify(b, BitSetSerializeType.Base64)).to.be.equal("BitSet:BASE64(16):AQA=");
        });
        it('two bits set(1), expect to be equal BitSet:BASE64(16):AwA=', function() {
            b.set(1);
            expect(BitSet.stringify(b, BitSetSerializeType.Base64)).to.be.equal("BitSet:BASE64(16):AwA=");
        });
        it('three bits set(8), expect to be equal BitSet:BASE64(16):AwE=', function() {
            b.set(8);
            expect(BitSet.stringify(b, BitSetSerializeType.Base64)).to.be.equal("BitSet:BASE64(16):AwE=");
        });
        it('four bits set(15), expect to be equal BitSet:BASE64(16):A4E=', function() {
            b.set(15);
            expect(BitSet.stringify(b, BitSetSerializeType.Base64)).to.be.equal("BitSet:BASE64(16):A4E=");
        });
    });

    describe('Test clone()', function() {
        let tests: { e: BitSet, es: string, a: BitSet, as: string }[] = [];

        for (let itest = 0; itest < 10; itest++) {
            let e: BitSet = new BitSet(32);
            for (let ibit = 0; ibit < 10; ibit++)
                e.set(Math.round(Math.random() * 32));
            let es: string = BitSet.stringify(e);
            let a: BitSet = e.clone();
            let as: string = BitSet.stringify(a);

            tests.push({ e, es, a, as });
        }

        tests.forEach(function(test) {
            it('shold be equal ' + test.es, function() {
                expect(test.es).to.be.equal(test.as);
            });
        });
    });

    describe('Test OneZero prefixed stringify() and set()', function() {
        let l = 16;
        let b: BitSet = new BitSet(l);
        let s: number = 0;

        it('none bit set, expect to be equal BitSet:01(16):0000000000000000', function() {
            expect(BitSet.stringify(b, BitSetSerializeType.OneZero)).to.be.equal("BitSet:01(16):0000000000000000");
        });
        it('one bit set(0), expect to be equal BitSet:01(16):0000000000000001', function() {
            b.set(0);
            expect(BitSet.stringify(b, BitSetSerializeType.OneZero)).to.be.equal("BitSet:01(16):0000000000000001");
        });
        it('two bits set(1), expect to be equal BitSet:01(16):0000000000000011', function() {
            b.set(1);
            expect(BitSet.stringify(b, BitSetSerializeType.OneZero)).to.be.equal("BitSet:01(16):0000000000000011");
        });
        it('three bits set(8), expect to be equal BitSet:01(16):0000000100000011', function() {
            b.set(8);
            expect(BitSet.stringify(b, BitSetSerializeType.OneZero)).to.be.equal("BitSet:01(16):0000000100000011");
        });
        it('four bits set(15), expect to be equal BitSet:01(16):1000000100000011', function() {
            b.set(15);
            expect(BitSet.stringify(b, BitSetSerializeType.OneZero)).to.be.equal("BitSet:01(16):1000000100000011");
        });
    });

    describe('Test OneZero prefixed stringify() and set()', function() {
        let l = 24;
        let b: BitSet = new BitSet(l);
        let s: number = 0;

        it('none bit set, expect to be equal BitSet:01(24):0000000000000000', function() {
            expect(BitSet.stringify(b, BitSetSerializeType.OneZero)).to.be.equal("BitSet:01(24):000000000000000000000000");
        });
        it('one bit set(0), expect to be equal BitSet:01(24):0000000000000001', function() {
            b.set(0);
            expect(BitSet.stringify(b, BitSetSerializeType.OneZero)).to.be.equal("BitSet:01(24):000000000000000000000001");
        });
        it('two bits set(1), expect to be equal BitSet:01(24):0000000000000011', function() {
            b.set(1);
            expect(BitSet.stringify(b, BitSetSerializeType.OneZero)).to.be.equal("BitSet:01(24):000000000000000000000011");
        });
        it('three bits set(8), expect to be equal BitSet:01(24):0000000100000011', function() {
            b.set(8);
            expect(BitSet.stringify(b, BitSetSerializeType.OneZero)).to.be.equal("BitSet:01(24):000000000000000100000011");
        });
        it('four bits set(15), expect to be equal BitSet:01(24):1000000100000011', function() {
            b.set(15);
            expect(BitSet.stringify(b, BitSetSerializeType.OneZero)).to.be.equal("BitSet:01(24):000000001000000100000011");
        });
    });

    describe('Test OneZero prefixed stringify() and fromOneZeroString()', function() {
        let tests: { e: BitSet, es: string, a: BitSet, as: string }[] = [];
        for (let itest = 0; itest < 10; itest++) {
            let e: BitSet = new BitSet(32);
            for (let ibit = 0; ibit < 10; ibit++)
                e.set(Math.round(Math.random() * 32));
            let es: string = BitSet.stringify(e, BitSetSerializeType.OneZero);
            let a: BitSet = BitSet.parse(es);
            let as: string = BitSet.stringify(a, BitSetSerializeType.OneZero);

            tests.push({ e, es, a, as });
        }

        tests.forEach(function(test) {
            it('shold be equal ' + test.es, function() {
                expect(test.es).to.be.equal(test.as);
            });
        });
    });



});



