import Shape from "./shape";
import Ray from "../features/ray";
import Intersection from "../features/intersection";
import { Point, Vector, createVector } from "../math/tuple";
import { EPSILON } from "../math/operations";

export default class Plane extends Shape {
  constructor() {
    super();
  }

  protected localIntersect = (localRay: Ray): Intersection[] => {
    if (Math.abs(localRay.direction.y) < EPSILON) {
      return [];
    } else {
      // this formula only works when the plane is on XZ
      let t: number = -localRay.origin.y / localRay.direction.y;
      return [new Intersection(t, this)];
    }
  }

  protected localNormalAt = (localPoint: Point): Vector => {
    // since the plane is on XZ, the normal is the vector pointing to Y
    return createVector(0, 1, 0);
  }  
}