import { Point, createPoint, subtract, Vector, createVector, dot, multiplyScalar, normalize } from '../math/tuple';
import Ray from '../features/ray';
import Intersection from '../features/intersection';
import Shape from './shape';
import Matrix from '../math/matrices';

export default class Sphere extends Shape {
    private origin: Point;
    private radius: number;
    constructor() {
        super();
        this.origin = createPoint(0, 0, 0);
        this.radius = 1;
    }

    public intersect = (r: Ray): Intersection[] => {
        let r2 = r.transformRay(Matrix.inverse(this.getTransform()));
        const {
            origin: rayOrigin,
            direction: rayDirection
        } = r2.getValues();
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

    public normalAt = (p: Point): Vector => {
        // Since it's a unit sphere the vector will
        // be normalized by default but the calculation
        // is still indicated.
        return normalize(subtract(p, this.origin));
    }
}
