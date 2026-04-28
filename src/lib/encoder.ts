import { labelToOrdinal } from "./labels";
import { variableToC } from "./variables";
import { pairingFunction } from "./pairingFunc";
import { encodeToString } from "./godel";
import type { Instruction } from "../types";

export function encodeInstruction(instruction: Instruction){
    const a = instruction.label ? labelToOrdinal(instruction.label): 0n;
    const c = variableToC(instruction.variable);
    let b:bigint;
    if (instruction.statementType === "dummy") b= 0n;
    else if (instruction.statementType === "increment") b = 1n;
    else if (instruction.statementType === "decrement") b = 2n;
    else b = labelToOrdinal(instruction.targetLabel!) + 2n;

    const innerFunc = pairingFunction(b, c);
    const instructionCode = pairingFunction(a, innerFunc);

    return { a, b, c, innerFunc, instructionCode};
}

export function encodeProgram(instructions: Instruction[]) {
    const steps = instructions.map((instruction, index) => ({
        instructionIndex: index + 1,
        ...encodeInstruction(instruction),
        instruction: instruction,
    }));
    const instructionCode= steps.map(s => s.instructionCode);
    const qPrimePowerString = encodeToString(instructionCode);
    
    return { steps, instructionCode, qPrimePowerString};
}

// this file takes a list of instructions and turns them into a number
// each instruction gets broken down into a, b, c then paired up into a code
// all the codes get combined into the final prime power string like 2^x * 3^y - 1