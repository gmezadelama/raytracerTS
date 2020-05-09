import Plane from "../plane";
import { Vector, createPoint, equalVector, createVector } from "../../math/tuple";
import Ray from "../../features/ray";
import Intersection from "../../features/intersection";

describe('Plane implementation', () => {
  test('The normal of a plane is constante everywhere', () => {
    let p: Plane = new Plane();
    let n1: Vector = p.normalAt(createPoint(0, 0, 0));
    let n2: Vector = p.normalAt(createPoint(10, 0, -10));
    let n3: Vector = p.normalAt(createPoint(-5, 0, 150));
    expect(equalVector(n1, createVector(0, 1, 0)));
    expect(equalVector(n2, createVector(0, 1, 0)));
    expect(equalVector(n3, createVector(0, 1, 0)));
  });
  test('Intersect with a ray parallel to the plane', () => {
    let p: Plane = new Plane();
    let r: Ray = new Ray(createPoint(0, 10, 0), createVector(0, 0, 1));
    let xs: Intersection[] = p.intersect(r);
    expect(xs.length).toBe(0);
  });
  test('Intersect with a coplanar ray', () => {
    let p: Plane = new Plane();
    let r: Ray = new Ray(createPoint(0, 0, 0), createVector(0, 0, 1));
    let xs: Intersection[] = p.intersect(r);
    expect(xs.length).toBe(0);
  });
  test('A ray intersecting a plane from above', () => {
    let p: Plane = new Plane();
    let r: Ray = new Ray(createPoint(0, 1, 0), createVector(0, -1, 0));
    let xs: Intersection[] = p.intersect(r);
    expect(xs.length).toBe(1);
    expect(xs[0].object.id).toBe(p.id);
  });
  test('A ray intersecting a plane from below', () => {
    let p: Plane = new Plane();
    let r: Ray = new Ray(createPoint(0, -1, 0), createVector(0, 1, 0));
    let xs: Intersection[] = p.intersect(r);
    expect(xs.length).toBe(1);
    expect(xs[0].object.id).toBe(p.id);
  });
});