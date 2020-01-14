import { Point, Vector, createPoint, createVector, multiplyScalar, add } from '../math/tuple';
import Matrix, { inverse } from '../math/matrices';
import * as Transformation from './transformations';

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
    
    transformRay = (m: Matrix): Ray => (
        new Ray(
            Transformation.multiplyTransformationMatrixPoint(m, this.origin),
            Transformation.multiplyTransformationMatrixPoint(m, this.direction)
        )
    )
}
