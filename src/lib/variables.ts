import type {VariableRef} from "../types";

export function variableToOrdinal(variable: VariableRef): bigint {
    if (variable.kind === "Y"){
        return 1n;
    }

    if(variable.kind === "X"){
        return 2n * BigInt(variable.index);
    }

    if (variable.kind === "Z") {
        return 2n * BigInt(variable.index) + 1n;
    }

    return 1n;
}

export function ordinalToVariable(k:bigint): VariableRef{
    if (k === 1n){
        return { kind: "Y"};
    }

    if(k%2n === 0n){
        return { kind: "X", index: Number(k / 2n)};
    }

    return { kind: "Z", index: Number((k -1n)/ 2n)}
}

export function variableToC(variable: VariableRef): bigint {
    return variableToOrdinal(variable) - 1n;
}

export function cToVariable(c: bigint):VariableRef {
    return ordinalToVariable(c + 1n);
}

export function variableToString(variable: VariableRef): string {
    if(variable.kind === "Y") return "Y";
    if(variable.kind === "X") return `X${variable.index}`;
    return `Z${variable.index}`;
}

// X, Y, Z variables to C in the pairing function <a, <b, c>>