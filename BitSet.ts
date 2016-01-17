'use strict';

export class BitSetException implements Error {
    public name: string = "BitSetException";
    public message: string = "";

    constructor(m: string) {
        this.message = m;
    }

    public toString(): string {
        return "{" + this.name + "," + this.message + "}";
    }
}

export class BitSet {
    private buf: Uint8Array;
    private len: number;

    constructor(l: number) {
        if (l <= 0)
            throw new BitSetException("BitSet size has to be greater than 0!");

        this.len = l | 0;

        this.buf = new Uint8Array((l + 7) / 8 | 0);
    }

    private assertEQ(b: BitSet): void {
        if (this.len !== b.len)
            throw new BitSetException('Length of two BitSet objects not equal!')
    }

    public clone(): BitSet {
        let l = this.len;
        let r: BitSet = new BitSet(l);
        let rbuf = r.buf;
        let tbuf = this.buf;

        for (let i = 0; i < l; i++)
            rbuf[i] = tbuf[i];

        return r;
    }

    public resize(l: number): BitSet {
        let len: number = this.buf.length;

        if (len === l)
            return this;

        let lc: number = Math.min(len, l);
        let tmpb: Uint8Array = new Uint8Array(l);
        let b: Uint8Array = this.buf;
        for (let i = 0; i < lc; i++)
            tmpb[i] = b[i];
        this.buf = tmpb;

        return this;
    }

    public size(): number {
        return this.len;
    }

    public set(n?: number): BitSet {
        if (n !== undefined) {
            if (n < 0)
                throw new BitSetException("Index has to be greater than 0!");

            if ((((n + 8) / 8) | 0) >= this.len)
                throw new BitSetException("Index out of range!");

            this.buf[(n / 8) | 0] |= (0x01 << (n % 8));
        }
        else {
            this.buf.fill(0xFF);
        }

        return this;
    }

    public unset(n?: number): BitSet {
        if (n) {
            if (n < 0)
                throw new BitSetException("Index has to be greater than 0!");

            if ((((n + 8) / 8) | 0) > this.buf.length)
                throw new BitSetException("Index out of range!");

            this.buf[n / 8] &= ~(0x01 << (n % 8));
        }
        else {
            this.buf.fill(0);
        }

        return this;
    }

    public and(b: BitSet): BitSet {
        this.assertEQ(b);

        let tbuf = this.buf;
        let tlen = tbuf.length;
        let bbuf = b.buf;

        for (let i = 0; i < tlen; i++)
            tbuf[i] &= bbuf[i];

        return this;
    }

    public or(b: BitSet): BitSet {
        this.assertEQ(b);

        let tbuf = this.buf;
        let tlen = tbuf.length;
        let bbuf = b.buf;

        for (let i = 0; i < tlen; i++)
            tbuf[i] |= bbuf[i];

        return this;
    }

    public xor(b: BitSet): BitSet {
        this.assertEQ(b);

        let tbuf = this.buf;
        let tlen = tbuf.length;
        let bbuf = b.buf;

        for (let i = 0; i < tlen; i++)
            tbuf[i] ^= bbuf[i];

        return this;
    }

    public nand(b: BitSet): BitSet {
        return this.and(b).not();
    }

    public nor(b: BitSet): BitSet {
        return this.or(b).not();
    }

    public equal(b: BitSet): boolean {
        this.assertEQ(b);

        let tbuf = this.buf;
        let tlen = tbuf.length;
        let bbuf = b.buf;

        for (let i = 0; i < tlen; i++)
            if (tbuf[i] !== bbuf[i])
                return false;

        return true;
    }

    public not(): BitSet {
        let tbuf = this.buf;
        let tlen = tbuf.length;

        for (let i = 0; i < tlen; i++)
            tbuf[i] = ~tbuf[i];

        return this;
    }

    public is(n: number): boolean {
        if (n < 0)
            throw new BitSetException("Index has to be greater than 0!");

        if ((((n + 8) / 8) | 0) > this.buf.length)
            throw new BitSetException("Index out of range!");

        return (this.buf[(n / 8) | 0] & (0x01 << (n % 8))) === 0 ? false : true;
    }

    public shr(n?: number): BitSet {
        if (!n) n = 1;
        if (n < 0)
            throw new BitSetException("Index has to be greater than 0!");
        if (n === 0)
            return this;

        let tbuf = this.buf;
        let tlen = tbuf.length;
        let nbytes = (n / 8) | 0;
        let nbits = (n % 8);

        if (nbytes > 0) {
            let ibytes = 0;
            for (; ibytes < (tlen - nbytes); ibytes++)
                tbuf[ibytes] = tbuf[ibytes + nbytes];
            for (; ibytes < tlen; ibytes++)
                tbuf[ibytes] = 0x00;
        }

        if (nbits > 0) {
            for (let ibytes = 0; ibytes < tlen; ibytes++) {
                tbuf[ibytes] = tbuf[ibytes] >>> nbits;
                if (ibytes < (tlen - 1))
                    tbuf[ibytes] |= (tbuf[ibytes + 1] << (8 - nbits)) && 0xFF;
            }
        }

        return this;
    }

    public shl(n?: number): BitSet {
        if (n === undefined) n = 1;
        if (n < 0)
            throw new BitSetException("Index has to be greater than 0!");
        if (n === 0)
            return this;

        let tbuf = this.buf;
        let tlen = tbuf.length;
        let nbytes = (n / 8) | 0;
        let nbits = (n % 8);

        if (nbytes > 0) {
            for (let i = tlen - 1; i >= 0; i--) {
                if ((i - nbytes) >= 0)
                    tbuf[i] = tbuf[i - nbytes];
                else
                    tbuf[i] = 0;
            }
        }

        if (nbits > 0) {
            let m: number[] = [0x00, 0x80, 0xC0, 0xE0, 0xF0, 0xF80, 0xFC, 0xFE];
            let r: number = 0;
            for (let i = 0; i < tlen; i++) {
                let rtmp = (tbuf[i] & m[nbits]) >>> (8 - nbits);
                tbuf[i] <<= nbits;
                tbuf[i] |= r;
                r = rtmp;
            }
        }

        return this;
    }

    public range(start: number, end?: number): BitSet {
        return null;
    }

    public isZero(): boolean {
        let l: number = this.buf.length;
        let tbuf = this.buf;
        for (let i = 0; i < l; i++)
            if (tbuf[i] !== 0)
                return false;
        return true;
    }

    public isNotZero(): boolean {
        return !this.isZero();
    }

    public static toOneZeroString(b: BitSet): string {
        let l: number = b.size();
        let ret: string = "";

        for (let i = l - 1; i >= 0; i--) {
            if (b.is(i) === true)
                ret += "1";
            else
                ret += "0";
        }

        return ret;
    }

    public static fromOneZeroString(s: string): BitSet {
        let l = s.length;
        let b: BitSet = new BitSet(l);
        for (let i: number = 0; i < s.length; i++)
            if (s.charAt(i) === "1")
                b.set(l - i - 1);
        return b;
    }
}

