import Shape from '../geometry/shape';
import { Point, Vector, negateVector, dot, PixelColor } from '../math/tuple';
import Ray from './ray';
import World from './world';
import { lighting } from '../shading/light';

export interface IntersectionComputations {
    t: number;
    object: Shape;
    point: Point;
    eyev: Vector;
    normalv: Vector;
    inside: boolean;
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
            inside: inside
        };
    }

    public static shadeHit = (world: World, comps: IntersectionComputations): PixelColor => {
        return lighting(comps.object.material, world.lightSource, comps.point, comps.eyev, comps.normalv);
    }
    /** end Static methods */
}
 