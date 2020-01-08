import Shape from '../geometry/shape';

export default class Intersection {
    t: number;
    object: Shape;
    constructor(t: number, object: Shape) {
        this.t = t;
        this.object = object;
    }
    equals = (i: Intersection): boolean =>
                this.t === i.t && this.object.equals(i.object)
}

export const aggregateIntersections = (...is: Intersection[]): Intersection[] => is

// todo: implement
export const hit = (is: Intersection[]): Intersection | undefined => {
    if (!is || is.length === 0) return undefined;
    let hits = is.filter((i: Intersection) => i.t > 0);
    return hits.length > 0
        ? hits.sort((i1: Intersection, i2: Intersection) => i1.t - i2.t)[0]
        : undefined;
} 