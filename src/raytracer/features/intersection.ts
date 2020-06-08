import Shape from '../geometry/shape';
import { Point, Vector, negateVector, dot, add, multiplyScalar, vectorMagnitude, createVector, subtract } from '../math/tuple';
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
    underPoint: Vector;    
    reflectv: Vector;
    n1: number; // refractive index material being exited
    n2: number; // refractive index material being entered
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
    // named in the book as "intersections"
    public static aggregateIntersections = (...is: Intersection[]): Intersection[] => is

    public static hit = (is: Intersection[]): Intersection | undefined => {
        if (!is || is.length === 0) return undefined;
        // the hit will return the lowest nonnegative 't'
        let hits = is.filter((i: Intersection) => i.t > 0);
        return hits.length > 0
            ? hits.sort((i1: Intersection, i2: Intersection) => i1.t - i2.t)[0]
            : undefined;
    }

    public static prepareComputations = (i: Intersection, r: Ray, intersections: Intersection[] = [i]): IntersectionComputations => {
        let point = r.getTPoint(i.t);
        let inside = false;
        let eyev: Vector = negateVector(r.getValues().direction);
        let normalv: Vector = i.object.normalAt(point);
        let reflectv: Vector = reflectLight(r.direction, normalv);
        if (dot(normalv, eyev) < 0) {
            inside = true;
            normalv = negateVector(normalv);
        }
        let containers: Shape[] = [];
        let n1: number = 1;
        let n2: number = 1;
        for(const isx of intersections) {
            let isHit: boolean = isx.equals(i);
            if (isHit) {
                if (containers.length > 0) {
                    n1 = containers[containers.length - 1].material.refractiveIndex;
                } else {
                    n1 = 1;
                }
            }
            let isInContainerList: boolean = containers.some(o => o.equals(isx.object));
            if (isInContainerList) {
                containers = containers.filter(o => !o.equals(isx.object));
            } else {
                containers.push(isx.object);
            }
            if (isHit) {
                if (containers.length > 0) {
                    n2 = containers[containers.length - 1].material.refractiveIndex;
                } else {
                    n2 = 1;
                }
                break;
            }
        }
        return {
            t: i.t,
            object: i.object,
            point: point,
            eyev: eyev,
            normalv: normalv,
            inside: inside,
            overPoint: add(point, multiplyScalar(normalv, EPSILON)),
            underPoint: subtract(point, multiplyScalar(normalv, EPSILON)),
            reflectv: reflectv,
            n1: n1,
            n2: n2
        };
    }

    // Implements the Christophe Schlick´s approximation to Fresnel´s equations
    // return a number between 0 and 1
    public static schlick = (comps: IntersectionComputations): number => {
        // find the cosine of the angle between the eye and normal vectors
        let cos = dot(comps.eyev, comps.normalv);
        // total internal reflection can only occur if n1 > n2
        if (comps.n1 > comps.n2) {
            let n = comps.n1 / comps.n2;
            let sin2T = Math.pow(n, 2) * (1.0 - Math.pow(cos, 2));
            if (sin2T > 1) {
                return 1.0;
            }

            // compute cosine ot t using trig identity
            let cosT = Math.sqrt(1 - sin2T);
            // to be used when n1 > n2
            cos = cosT;
        }

        let r0 = Math.pow((
            (comps.n1 - comps.n2) / (comps.n1 + comps.n2)
        ), 2);
        return r0 + (1 - r0) * Math.pow(1 - cos, 5);
    }

    /** end Static methods */
}
