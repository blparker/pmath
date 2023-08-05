function decimalToInt(...args) {
    function shift(x) {
        const parts = x.toString().split('.');
        return parts.length < 2 ? 1 : Math.pow(10, parts[1].length);
    }

    return args.reduce((p, n) => p === undefined || n === undefined ? undefined : Math.max(p, shift(n)), -Infinity);
}


export function pSubtract(l, r) {
    const f = decimalToInt(l, r);
    return (l * f - r * f) / f;
}


export function pAdd(...args) {
    const f = decimalToInt(...args);
    return args.reduce((acc, v) => acc + f * v, 0) / f;
}


export function pMultiply(...args) {
    const f = decimalToInt(...args);
    return args.reduce((acc, v) => (acc * f) * (v * f) / (f * f), 1) / f;
}


export function pDivide(l, r) {
    const f = decimalToInt(l, r);
    return (l * f) / (r * f);
}
