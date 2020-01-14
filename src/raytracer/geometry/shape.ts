import Ray from '../features/ray';
import Intersection from '../features/intersection';
import Matrix, { Identity, multiply } from '../math/matrices';

export default abstract class Shape {
    private id: number;
    private transform: Matrix;
    constructor() {
        this.id = (new Date()).getTime();
        this.transform = Identity();
    }
    public abstract intersect(r: Ray): Intersection[];
    public equals = (o: Shape) => this.id === o.id;
    public getTransform = (): Matrix => this.transform;
    public setTransform = (m: Matrix) => {
        this.transform = m;
    }
}