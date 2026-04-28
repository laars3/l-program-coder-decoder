import {nthPrime} from "./primes"

export function encodeToString(instructionCodes: bigint[]): string {
    const terms: string[] = [];

    for (let i = 0; i < instructionCodes.length; i++) {
        const exp = instructionCodes[i];
        if (exp === 0n) continue;  
        const prime = nthPrime(i + 1);
        terms.push(`${prime}^${exp}`);
    }

    if (terms.length === 0) return "empty program, #(P) = 0";
    return terms.join(" * ") + " - 1";
}

export function factorizationToExponents(
    factors: { prime: bigint, exp: bigint }[]
): bigint[] {
    if (factors.length === 0) return [];

    const maxPrime = factors.reduce((max, f) => f.prime > max ? f.prime : max, 2n);

    const exponents: bigint[] = [];
    let i = 1;

    while (true) {
        const p = nthPrime(i);
        if (p > maxPrime) break;
        const found = factors.find(f => f.prime === p);
        exponents.push(found ? found.exp : 0n);
        i += 1;
    }

    return exponents;
}

// this file handles the godel number side of things
// encodeToString takes instruction codes and builds the final 2^a * 3^b * ... - 1 string
// factorizationToExponents goes the other way, takes prime factors and pulls out the exponent list