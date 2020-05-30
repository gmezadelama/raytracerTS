import Matrix from './matrices';
import { equal } from './operations';

type wRange = 0 | 1;

export interface Tuple {
    x: number;
    y: number;
    z: number;
    w: wRange;
}

const tuple = (x: number, y: number, z: number, w: wRange):Tuple => ({
    x: x,
    y: y,
    z: z,
    w: w
});

export const createPoint = (x: number, y: number, z: number):Tuple => tuple(x, y, z, 1);

export const createVector = (x: number, y: number, z: number):Tuple => tuple(x, y, z, 0);

export const createPixelColor = (x: number, y: number, z: number):Tuple => tuple(x, y, z, 0);

export type Point = Tuple;
export type Vector = Tuple;
export type PixelColor = Tuple;
export const BlackColor = createPixelColor(0, 0, 0);
export const WhiteColor = createPixelColor(1, 1, 1);
export const RedColor = createPixelColor(1, 0, 0);
export const GreenColor = createPixelColor(0, 1, 0);
export const BlueColor = createPixelColor(0, 0, 1);


const singleAddition = (a: Tuple, b: Tuple):Tuple | undefined => {
    // it doesn't make sense to add two points!
    if (a.w === 1 && b.w === 1) {
        return undefined;
    }
    return {
        x: a.x + b.x,
        y: a.y + b.y,
        z: a.z + b.z,
        w: (a.w + b.w) as wRange
    }
};

export const add = (...vectors: Tuple[]):Tuple | undefined => {
    if (vectors && vectors.length > 0) {
        let acc = vectors[0];
        for (let i = 1; i < vectors.length; i++) {
            if (!vectors[i]) continue;
            acc = singleAddition(acc, vectors[i]);
        }
        return acc;
    } else {
        return undefined;
    }
};

export const subtract = (a: Tuple, b: Tuple):Tuple | undefined => {
    // it doesn't make sense to subtract a point from a vector
    if (a.w === 0 && b.w === 1) {
        return undefined;
    }
    return {
        x: a.x - b.x,
        y: a.y - b.y,
        z: a.z - b.z,
        w: (a.w - b.w) as wRange
    }
};

export const negateVector = (a: Tuple):Tuple | undefined => ({
    x: a.x === 0 ? 0 : -a.x,
    y: a.y === 0 ? 0 : -a.y,
    z: a.z === 0 ? 0 : -a.z,
    w: 0
})

export const multiplyScalar = (a: Tuple, s: number):Tuple | undefined => {
    if (a.w === 1) {
        return undefined;
    }
    return {
        x: a.x * s,
        y: a.y * s,
        z: a.z * s,
        w: (a.w * s) as wRange 
    }
};

export const dividingByScalar = (a: Tuple, s: number):Tuple | undefined => s !== 0 ? multiplyScalar(a, 1/s) : undefined;

export const vectorMagnitude = (a: Tuple):number | undefined => {
    if (a.w === 1) {
        return undefined;
    }
    return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z + a.w * a.w);
}

export const normalize = (a: Tuple):Tuple | undefined => dividingByScalar(a, vectorMagnitude(a));

export const dot = (a: Tuple, b: Tuple):number | undefined => {
    if (a.w === 1 || b.w === 1) {
        return undefined;
    }
    return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
}

export const cross = (a: Tuple, b: Tuple):Tuple | undefined => {
    if (a.w === 1 || b.w === 1) {
        return undefined;
    }
    return {
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x,
        w: (a.w * b.w) as wRange
    };
}

export const hadamardProduct = (a: Tuple, b: Tuple):Tuple => ({
    x: a.x * b.x,
    y: a.y * b.y,
    z: a.z * b.z,
    w: (a.w * b.w) as wRange
});

export const matrixToTuple = (m: Matrix):Tuple => ({
    x: m.get(0, 0),
    y: m.get(1, 0),
    z: m.get(2, 0),
    w: (m.get(3, 0)) as wRange
})

export const equalTuple = (a: Tuple, b: Tuple): boolean => {
    return equal(a.x, b.x) && equal(a.y, b.y) && equal(a.z, b.z) && a.w === b.w;
}

export const equalPoint = (a: Point, b: Point): boolean => {
    if (a.w !== 1 || b.w !== 1) return false;
    return equalTuple(a, b);
}

export const equalVector = (a: Vector, b: Vector): boolean => {
    if (a.w !== 0 || b.w !== 0) return false;
    return equalTuple(a, b);
}

export const equalPixelColor = (a: PixelColor, b: PixelColor): boolean => {
    if (a.w !== 0 || b.w !== 0) return false;
    return equalTuple(a, b);
}
