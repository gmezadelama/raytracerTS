import { Point, Vector, createPoint, createVector, multiplyScalar, add } from '../math/tuple';
import Matrix from '../math/matrices';
import Transformations from './transformations';

export default class Ray {
    private _origin: Point;
    private _direction: Vector;

    constructor(o: Point, d: Vector) {
        this._origin = o;
        this._direction = d;
    }

    getValues = (): {origin: Point, direction: Vector} => {
        return {
            origin: this._origin,
            direction: this._direction
        }
    }

    get origin(): Point {
        return this._origin;
    }

    get direction(): Vector {
        return this._direction;
    }

    /**
     * This method is the equivalent to the function 'position(ray, t)' from the book
     * */ 
    getTPoint = (t: number) => add(this._origin, multiplyScalar(this._direction, t))
    
    transformRay = (m: Matrix): Ray => (
        new Ray(
            Transformations.multiplyTransformationMatrixPoint(m, this._origin),
            Transformations.multiplyTransformationMatrixPoint(m, this._direction)
        )
    )
}
