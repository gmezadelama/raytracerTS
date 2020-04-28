import Ray from '../features/ray';
import { Point, Vector } from '../math/tuple';
import Intersection from '../features/intersection';
import Matrix from '../math/matrices';
import Material from '../shading/material';

export default abstract class Shape {
    private id: number;
    private _transform: Matrix;
    private _material: Material;
    constructor() {
        this.id = (new Date()).getTime();
        this._transform = Matrix.Identity();
        this._material = new Material();
    }
    public equals = (o: Shape) => this.id === o.id;
    public abstract intersect(r: Ray): Intersection[];
    public abstract normalAt(p: Point): Vector;

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