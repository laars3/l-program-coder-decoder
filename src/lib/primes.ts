const primeCache: bigint[] = [2n];

function isPrime(x: bigint): boolean{
    for (const y of primeCache) {
        if (y*y>x) break;
        if(x %y === 0n) return false;
    }
    return true;
}

export function nthPrime(n: number): bigint {
    while(primeCache.length < n){
        let x = primeCache[primeCache.length - 1] + 1n;
        while (!isPrime(x)) {
            x += 1n;
        }
        primeCache.push(x);
    }
    return primeCache[n-1];
}



export function factorizeNumber(n: bigint): {prime: bigint, exp: bigint} [] {
    const factors: { prime: bigint, exp: bigint}[] =[];
    let remaining = n;
    let i = 1;

    while (true){
        const x = nthPrime(i);
        if (x * x > remaining) break;

        let exp = 0n;
        while( remaining%x === 0n){
            remaining = remaining /x;
            exp = exp+ 1n;
        }

        if (exp>0n){
            factors.push({prime: x, exp});
        }
        i += 1;
    }
    if(remaining > 1n){
        factors.push({prime: remaining, exp: 1n});
    }
    return factors;
}

//isPrime checks if a numbre is a prime number
//nthPrime is used to return the nth prime number in order
//factorizeNumber repeates division to find all of the prime numbers that fit into a specific number using the helpers listed above