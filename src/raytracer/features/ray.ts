import { Point, Vector, createPoint, createVector, multiplyScalar, add } from '../math/tuple';
import Matrix from '../math/matrices';
import Transformations from './transformations';

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

    /**
     * This method is the equivalent to the function 'position(ray, t)' from the book
     * */ 
    getTPoint = (t: number) => add(this.origin, multiplyScalar(this.direction, t))
    
    transformRay = (m: Matrix): Ray => (
        new Ray(
            Transformations.multiplyTransformationMatrixPoint(m, this.origin),
            Transformations.multiplyTransformationMatrixPoint(m, this.direction)
        )
    )
}
