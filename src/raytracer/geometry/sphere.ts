import { Point, createPoint, subtract, Vector, createVector, dot, multiplyScalar, normalize, matrixToTuple } from '../math/tuple';
import Ray from '../features/ray';
import Intersection from '../features/intersection';
import Shape from './shape';
import Matrix from '../math/matrices';

export default class Sphere extends Shape {
    private radius: number;
    constructor() {
        super();
        this.origin = createPoint(0, 0, 0);
        this.radius = 1;
    }

    protected localIntersect = (localRay: Ray): Intersection[] => {
        const {
            origin: rayOrigin,
            direction: rayDirection
        } = localRay.getValues();
        let sphereToRay: Vector = subtract(rayOrigin, this.origin);
        let a = dot(rayDirection, rayDirection);
        let b = 2 * dot(rayDirection, sphereToRay);
        let c = dot(sphereToRay, sphereToRay) - 1;
        let discriminant = b * b - 4 * a * c;
        if (discriminant < 0) {
            return [];
        } else {
            let sqrtDiscr = Math.sqrt(discriminant);
            return [
                new Intersection((-b  - sqrtDiscr) / (2 * a), this),
                new Intersection((-b  + sqrtDiscr) / (2 * a), this)
            ];
        }
    }

    protected localNormalAt = (localPoint: Point): Vector => {
        return subtract(localPoint, createPoint(0, 0, 0));
    }
}
