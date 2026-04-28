import type { Instruction } from "../types";
import { factorizeNumber } from "./primes";
import { factorizationToExponents } from "./godel";
import { reversePairingFunction } from "./pairingFunc";
import { ordinalToLabel } from "./labels";
import { cToVariable } from "./variables";

export function decodeInstructionCode(code: bigint, index: number) {
    const { x: a, y: pairBC } = reversePairingFunction(code);
    const { x: b, y: c } = reversePairingFunction(pairBC);
    const label = a === 0n ? undefined : ordinalToLabel(a);
    const variable = cToVariable(c);

    let instruction: Instruction;
    if (b === 0n) {
        instruction = { label, variable, statementType: "dummy" };
    } else if (b === 1n) {
        instruction = { label, variable, statementType: "increment" };
    } else if (b === 2n) {
        instruction = { label, variable, statementType: "decrement" };
    } else {
        const targetLabel = ordinalToLabel(b - 2n);
        instruction = { label, variable, statementType: "Goto", targetLabel };
    }

    return { instructionIndex: index, code, a, b, c, pairBC, instruction };
}

export function decodeQ(q: bigint) {
    const n = q + 1n;
    const factorization = factorizeNumber(n);
    const instructionCodes = factorizationToExponents(factorization);
    const steps = instructionCodes.map((code, index) => decodeInstructionCode(code, index + 1));

    return {
        q,
        n,
        factorization,
        instructionCodes,
        steps,
        instructions: steps.map(s => s.instruction),
    };
}
// this file takes a number q and works backwards to get the original program
// it adds 1, factorizes, pulls out the exponents as instruction codes
// then unpairs each code to recover a, b, c and rebuilds the instructions
