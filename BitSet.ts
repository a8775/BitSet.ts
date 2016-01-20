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

    constructor(o: number);
    constructor(o: BitSet);
    constructor(o: any) {
        if (typeof o === 'number') {
            if (o <= 0)
                throw new BitSetException("BitSet size has to be greater than 0!");
            this.len = o | 0;
            this.buf = new Uint8Array((o + 7) / 8 | 0);
        }
        else if (typeof o === 'BitSet') {
            this.len = o.len;
            this.buf = new Uint8Array(o.buf.length);
            for (let i = 0; i < o.buf.length; i++) {
                this.buf[i] = o.buf[i];
            }
        }
        else {
            throw new BitSetException('Constructor for that type is not implemented!')
        }
    }
    
    /**
     * check the size of this and b are equal to perform operations
     * @param  {BitSet} b
     * @returns void
     */
    private assertEQ(b: BitSet): void {
        if (this.len !== b.len)
            throw new BitSetException('Length of two BitSet objects not equal!')
    }

    /**
     * create a copy of BitSet
     * @returns BitSet
     */
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

    /** 
     * size in bits of BitSet
     * @returns number
     */
    public length(): number {
        return this.len;
    }
    
    /** 
     * size in bytes of BitSet
     * @returns number
     */
    public size(): number {
        return this.buf.length;
    }

    /** 
     * set selected bit, if bit not selected set every bit in buffor
     * @param  {number} n?
     * @returns BitSet
     */
    public set(n?: number): BitSet {
        if (n !== undefined) {
            if (n < 0)
                throw new BitSetException("Index out of range: index has to be greater than 0!");
            if( n > this.len)
                throw new BitSetException("Index out of range: index has to be lower than length!");

            this.buf[(n / 8) | 0] |= (0x01 << (n % 8));
        }
        else {
            this.buf.fill(0xFF);
        }

        return this;
    }

    /** 
     * unset selected bit, if bit not selected unset every bit in buffor
     * @param  {number} n?
     * @returns BitSet
     */
    public unset(n?: number): BitSet {
        if (n) {
            if (n < 0)
                throw new BitSetException("Index out of range: index has to be greater than 0!");
            if( n > this.len)
                throw new BitSetException("Index out of range: index has to be lower than length!");

            this.buf[n / 8] &= ~(0x01 << (n % 8));
        }
        else {
            this.buf.fill(0);
        }

        return this;
    }

    /** 
     * logical operator AND
     * @param  {BitSet} b
     * @returns BitSet
     */
    public and(b: BitSet): BitSet {
        this.assertEQ(b);

        let tbuf = this.buf;
        let tlen = tbuf.length;
        let bbuf = b.buf;

        for (let i = 0; i < tlen; i++)
            tbuf[i] &= bbuf[i];

        return this;
    }

    /** 
     * logical operator OR
     * @param  {BitSet} b
     * @returns BitSet
     */
    public or(b: BitSet): BitSet {
        this.assertEQ(b);

        let tbuf = this.buf;
        let tlen = tbuf.length;
        let bbuf = b.buf;

        for (let i = 0; i < tlen; i++)
            tbuf[i] |= bbuf[i];

        return this;
    }

    /** 
     * logical operator XOR
     * @param  {BitSet} b
     * @returns BitSet
     */
    public xor(b: BitSet): BitSet {
        this.assertEQ(b);

        let tbuf = this.buf;
        let tlen = tbuf.length;
        let bbuf = b.buf;

        for (let i = 0; i < tlen; i++)
            tbuf[i] ^= bbuf[i];

        return this;
    }

    /** 
     * logical operator NAND
     * @param  {BitSet} b
     * @returns BitSet
     */
    public nand(b: BitSet): BitSet {
        return this.and(b).not();
    }
    
    /** 
     * logical operator NOR
     * @param  {BitSet} b
     * @returns BitSet
     */
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
    
    /**
     * logical operator NOT 
     * @returns BitSet
     */
    public not(): BitSet {
        let tbuf = this.buf;
        let tlen = tbuf.length;

        for (let i = 0; i < tlen; i++)
            tbuf[i] = ~tbuf[i];

        return this;
    }

    /** 
     * check if is selected bit is set, if not selected check if any bit is set
     * @param  {number} n?
     * @returns boolean
     */
    public isset(n?: number): boolean {
        if (n === undefined) {
            let l: number = this.buf.length;
            let tbuf = this.buf;
            for (let i = 0; i < l; i++)
                if (tbuf[i] !== 0)
                    return true;
            return false;
        }
        if (n < 0)
            throw new BitSetException("Index has to be greater than 0!");

        if ((((n + 8) / 8) | 0) > this.buf.length)
            throw new BitSetException("Index out of range!");

        return (this.buf[(n / 8) | 0] & (0x01 << (n % 8))) === 0 ? false : true;
    }
    
    /** 
     * shift the buffor left (if n is positive) or right (if n is negative)
     * @param  {number} n?
     * @returns BitSet
     */
    public shift(n?: number): BitSet {
        if (n === undefined)
            n = 1;
        if (n === 0)
            return this;

        let tbuf = this.buf;
        let tlen = tbuf.length;

        let nbytes = ((n > 0 ? n : -n) / 8) | 0;
        let nbits = ((n > 0 ? n : -n) % 8);

        if (n > 0) { // shift left
            if (nbytes > 0) {
                for (let i = tlen - 1; i >= 0; i--) {
                    if ((i - nbytes) >= 0)
                        tbuf[i] = tbuf[i - nbytes];
                    else
                        tbuf[i] = 0;
                }
            }

            if (nbits > 0) {
                let m: number[] = [0x00, 0x80, 0xC0, 0xE0, 0xF0, 0xF8, 0xFC, 0xFE];
                let r: number = 0;
                for (let i = 0; i < tlen; i++) {
                    let rtmp = (tbuf[i] & m[nbits]) >>> (8 - nbits);
                    tbuf[i] <<= nbits;
                    tbuf[i] |= r;
                    r = rtmp;
                }
            }
        }
        else { // shift right
            if (nbytes > 0) {
                let ibytes = 0;
                for (; ibytes < (tlen - nbytes); ibytes++)
                    tbuf[ibytes] = tbuf[ibytes + nbytes];
                for (; ibytes < tlen; ibytes++)
                    tbuf[ibytes] = 0x00;
            }

            if (nbits > 0) {
                let m: number[] = [0x00, 0x01, 0x03, 0x07, 0x0F, 0x1F, 0x3F, 0x7F];
                let r: number = 0;
                for (let i = tlen - 1; i >= 0; i--) {
                    let rtmp = (tbuf[i] & m[nbits]) << (8 - nbits);
                    tbuf[i] >>>= nbits;
                    tbuf[i] |= r;
                    r = rtmp;
                }
            }
        }

        return this;
    }

    public range(start: number, end?: number): BitSet {
        return null;
    }

    public static toOneZeroString(b: BitSet): string {
        let l: number = b.length();
        let ret: string = "";

        for (let i = l - 1; i >= 0; i--) {
            if (b.isset(i) === true)
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

