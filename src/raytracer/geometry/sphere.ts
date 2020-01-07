import { Point, point, subtract, Vector, vector, dot, multiplyScalar } from '../math/tuple';
import Ray from '../features/ray';

export default class Sphere {
    private origin: Point;
    private radius: number;
    private id: number;
    constructor() {
        this.id = (new Date()).getTime();
        this.origin = point(0, 0, 0);
        this.radius = 1;
    }

    public intersect = (r: Ray): number[] => {
        const {
            origin: rayOrigin,
            direction: rayDirection
        } = r.getValues();
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
                (-b  - sqrtDiscr) / (2 * a),
                (-b  + sqrtDiscr) / (2 * a)
            ];
        }
    }
}