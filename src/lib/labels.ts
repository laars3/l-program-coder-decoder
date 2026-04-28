const LABELS = ["A", "B", "C", "D", "E"]; 

export function labelToOrdinal(label: string): bigint{
    const letter = label[0];
    const n = parseInt(label.slice(1));
    const letterPos = LABELS.indexOf(letter) + 1;
    return BigInt((5 * (n-1)) + letterPos);
}

export function ordinalToLabel(ordinal: bigint): string{
    const zeroBased = ordinal - 1n;
    const letter = LABELS[Number(zeroBased % 5n)]
    const n = Number(zeroBased / 5n) + 1;
    return `${letter}${n}`;
}

export function isValidLabel(label: string): boolean{
    return /^[A-E][1-9]\d*$/.test(label);
}

// labels file for [A1, B1, C1, ... etc] -> encoded 'a' in pairing func, and vice versa for decoding