import Ray from '../features/ray';
import { Point, Vector } from '../math/tuple';
import Intersection from '../features/intersection';
import Matrix from '../math/matrices';

export default abstract class Shape {
    private id: number;
    private transform: Matrix;
    constructor() {
        this.id = (new Date()).getTime();
        this.transform = Matrix.Identity();
    }
    public equals = (o: Shape) => this.id === o.id;
    public getTransform = (): Matrix => this.transform;
    public setTransform = (m: Matrix) => {
        this.transform = m;
    }
    public abstract intersect(r: Ray): Intersection[];
    public abstract normalAt(p: Point): Vector;
}