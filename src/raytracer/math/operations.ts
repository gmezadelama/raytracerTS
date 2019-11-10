export const EPSILON = 0.00001;

export const equal = (a: number, b: number):boolean => Math.abs(a - b) < EPSILON;