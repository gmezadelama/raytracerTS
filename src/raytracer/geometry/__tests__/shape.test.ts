import Shape from "../shape";
import Ray from "../../features/ray";
import Intersection from "../../features/intersection";
import { Vector, subtract, dot, Point, createPoint, equalVector, createVector } from "../../math/tuple";
import Transformations from "../../features/transformations";
import { equal } from "../../math/operations";
import Matrix from "../../math/matrices";

// using sphere implementations
class TestShape extends Shape {
  protected localIntersect = (localRay: Ray): Intersection[] => {
    const {
        origin: rayOrigin,
        direction: rayDirection
    } = localRay.getValues();
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
            new Intersection((-b  - sqrtDiscr) / (2 * a), this),
            new Intersection((-b  + sqrtDiscr) / (2 * a), this)
        ];
    }
  }

  protected localNormalAt = (localPoint: Point): Vector => {
      return subtract(localPoint, createPoint(0, 0, 0));
  }
}

describe('Testing default shape', () => {
  test('Computing the normal on a translated shape', () => {
    let s: Shape = new TestShape();
    s.transform = Transformations.translation(0, 1, 0);
    let n: Vector = s.normalAt(createPoint(0, 1.70711, -0.70711));
    expect(equalVector(n, createVector(0, 0.70711, -0.70711))).toBeTruthy();
  });
  test('Computing the normal on a transformed shape', () => {
    let s: Shape = new TestShape();
    let m: Matrix = Matrix.multiply(Transformations.scaling(1, 0.5, 1), Transformations.rotateAroundZ(Math.PI / 5));
    s.transform = m;
    let n: Vector = s.normalAt(createPoint(0, Math.SQRT2 / 2, -Math.SQRT2 / 2));
    expect(equalVector(n, createVector(0, 0.97014, -0.24254))).toBeTruthy();
  });
});