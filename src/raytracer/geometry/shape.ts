import { v4 as uuidv4 } from 'uuid';
import Ray from '../features/ray';
import { Point, Vector, matrixToTuple, normalize, createPoint } from '../math/tuple';
import Intersection from '../features/intersection';
import Matrix from '../math/matrices';
import Material from '../shading/material';

export default abstract class Shape {
    private _id: string;
    protected origin: Point;
    private _transform: Matrix;
    private _material: Material;
    constructor() {
        this._id = uuidv4();
        this._transform = Matrix.Identity();
        this._material = new Material();
        this.origin = createPoint(0, 0, 0);
    }
    public equals = (o: Shape) => this.id === o.id;
    protected abstract localIntersect(localRay: Ray): Intersection[];
    protected abstract localNormalAt(p: Point): Vector;

    public localPoint = (worldPoint: Point): Point => matrixToTuple(Matrix.multiply(Matrix.inverse(this._transform), Matrix.tupleToMatrix(worldPoint)));

    public intersect = (r: Ray): Intersection[] => {
        let localRay = r.transformRay(Matrix.inverse(this.transform));
        return this.localIntersect(localRay);
    }

    public normalAt = (worldPoint: Point): Vector => {
        // There are some shapes like the unit sphere where the vector
        // will be normalized by default but the calculation
        // is still indicated for any other shape.
        let localPoint: Point = this.localPoint(worldPoint);
        let objectNormal: Vector = this.localNormalAt(localPoint);
        let worldNormal: Vector = matrixToTuple(Matrix.multiply(Matrix.inverse(this.transform).transpose(), Matrix.tupleToMatrix(objectNormal)));
        worldNormal.w = 0;
        return normalize(worldNormal);
    }

    get id(): string {
        return this._id;
    }

    get transform(): Matrix {
        return this._transform;
    }

    set transform(m: Matrix) {
        this._transform = m;
    }

    get material(): Material {
        return this._material;
    }

    set material(m: Material) {
        this._material = m;
    }
}