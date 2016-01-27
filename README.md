# BitSet.ts
TypeScript implementation of a bitset data structure that compactly stores bits. 
This is Node.js implementation, will not work in a browser without modyfications.

BitSet implementation is based on Uint8Array: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays. 
The bit position in the array is calculated in the following way: 
- select a byte in the array: `buf[n/8]`
- select a bit in the selected byte: `0x01 << (n % 8)`
Bytes are in little-endian order, the least significiant bits are positioned in lower bytes: https://en.wikipedia.org/wiki/Endianness

_Warning_: the size of BitSet has to be multiply of 8 bits

## Can I use it?
Yes, but not for production, as code is not stabilized and not fully tested.

## Examples

## Dependency
No external dependencies, only for testing mocha and chai are required.

## Installation
Run commands:

`git clone https://github.com/a8775/BitSet.ts`

in working directory:

`npm install`

`tsd install`


