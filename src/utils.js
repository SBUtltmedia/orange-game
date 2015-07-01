export function range(n) { return Array.apply(0, Array(n)); }
export function forRange(n, f) { return range(n).map((x, i) => f(i)); }
