export function pairingFunction(x: bigint, y: bigint): bigint {
    return ((2n ** x) * (2n * y + 1n) - 1n);
}

export function reversePairingFunction(n: bigint): {x: bigint, y: bigint} {
    let m = n+1n;
    let x = 0n;
    while (m % 2n == 0n){
        m = m / 2n;
        x = x + 1n;
    }
    const y = (m -1n) /2n;
    return { x, y };
}

// pairing function for encoding: <x, y> = 2^x * (2y + 1) - 1
// reverse pairing function for decoding by factoring powers of 2 from n+1