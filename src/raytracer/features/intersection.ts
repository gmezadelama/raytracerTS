import Shape from '../geometry/shape';
import { Point, Vector, negateVector, dot, add, multiplyScalar } from '../math/tuple';
import Ray from './ray';
import { EPSILON } from '../math/operations';
import { reflectLight } from '../shading/light';

export interface IntersectionComputations {
    t: number;
    object: Shape;
    point: Point;
    eyev: Vector;
    normalv: Vector;
    inside: boolean;
    overPoint: Point;
    reflectv: Vector;
}

export default class Intersection {
    t: number;
    object: Shape;
    constructor(t: number, object: Shape) {
        this.t = t;
        this.object = object;
    }
    equals = (i: Intersection): boolean =>
                this.t === i.t && this.object.equals(i.object)

    /** Static methods */
    public static aggregateIntersections = (...is: Intersection[]): Intersection[] => is

    public static hit = (is: Intersection[]): Intersection | undefined => {
        if (!is || is.length === 0) return undefined;
        // the hit will return the lowest nonnegative 't'
        let hits = is.filter((i: Intersection) => i.t > 0);
        return hits.length > 0
            ? hits.sort((i1: Intersection, i2: Intersection) => i1.t - i2.t)[0]
            : undefined;
    }

    public static prepareComputations = (i: Intersection, r: Ray): IntersectionComputations => {
        let point = r.getTPoint(i.t);
        let inside = false;
        let eyev: Vector = negateVector(r.getValues().direction);
        let normalv: Vector = i.object.normalAt(point);
        let reflectv: Vector = reflectLight(r.direction, normalv);
        if (dot(normalv, eyev) < 0) {
            inside = true;
            normalv = negateVector(normalv);
        }
        return {
            t: i.t,
            object: i.object,
            point: point,
            eyev: eyev,
            normalv: normalv,
            inside: inside,
            overPoint: add(point, multiplyScalar(normalv, EPSILON)),
            reflectv: reflectv
        };
    }

    /** end Static methods */
}
 