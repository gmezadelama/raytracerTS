import { Point, Vector, point, vector, multiplyScalar, add } from '../math/tuple';

export default class Ray {
    private origin: Point;
    private direction: Vector;

    constructor(o: Point, d: Vector) {
        this.origin = o;
        this.direction = d;
    }

    getValues = (): {origin: Point, direction: Vector} => {
        return {
            origin: this.origin,
            direction: this.direction
        }
    }

    getTPoint = (t: number) => add(this.origin, multiplyScalar(this.direction, t))
    
}