# L-Program Coder / Decoder

A web app that encodes and decodes programs written in the theoretical language **L**.

Built for Theory of Computation course, implements the formal coding and decoding functions covered in class.

## what it does

**Encode:** takes an L-program (a list of instructions) and computes its Gödel number `#(P)`, shown in prime power form.

**Decode:** takes a number and recovers the original L-program, showing every intermediate step.

## how it works

- each instruction is broken down into values `a`, `b`, `c`
- paired using the pairing function `<x, y> = 2^x * (2y + 1) - 1`
- the list of instruction codes is encoded as a Gödel number `2^e1 * 3^e2 * 5^e3 * ... - 1`
- decoding reverses all of these steps

## built with

- React + TypeScript + Vite
- no external libraries — all math implemented from scratch using native `BigInt`

## live

[deployed on Vercel](https://l-program-coder-decoder.vercel.app/)

---

Built by: Lars Ponikvar  
For: Professor Ronald W. Fechter
