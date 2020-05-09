import { createPoint, createVector } from '../../math/tuple';
import Sphere from '../../geometry/sphere';
import Shape from '../../geometry/shape';
import Ray from '../ray';
import Intersection, { IntersectionComputations } from '../intersection';
import Transformations from '../transformations';
import { EPSILON } from '../../math/operations';

describe('Intersections', () => {
  test('Precomputing the state of an intersection', () => {
    let r: Ray = new Ray(createPoint(0, 0, -5), createVector(0, 0, 1));
    let shape: Shape = new Sphere();
    let i: Intersection = new Intersection(4, shape);
    let comps = Intersection.prepareComputations(i, r);
    expect(comps.t).toBe(4);
    expect(comps.point.x).toBe(0);
    expect(comps.point.y).toBe(0);
    expect(comps.point.z).toBe(-1);
    expect(comps.point.w).toBe(1);
    expect(comps.eyev.x).toBe(0);
    expect(comps.eyev.y).toBe(0);
    expect(comps.eyev.z).toBe(-1);
    expect(comps.eyev.w).toBe(0);
    expect(comps.normalv.x).toBe(0);
    expect(comps.normalv.y).toBe(0);
    expect(comps.normalv.z).toBe(-1);
    expect(comps.normalv.w).toBe(0);
  });
  test('The hit, when an intersection occurs on the outside', () => {
    let r: Ray = new Ray(createPoint(0, 0, -5), createVector(0, 0, 1));
    let shape: Shape = new Sphere();
    let i: Intersection = new Intersection(4, shape);
    let comps = Intersection.prepareComputations(i, r);
    expect(comps.inside).toBeFalsy();
  });
  test('The hit, when an intersection occurs on the inside', () => {
    let r: Ray = new Ray(createPoint(0, 0, 0), createVector(0, 0, 1));
    let shape: Shape = new Sphere();
    let i: Intersection = new Intersection(1, shape);
    let comps = Intersection.prepareComputations(i, r);
    expect(comps.point.x).toBe(0);
    expect(comps.point.y).toBe(0);
    expect(comps.point.z).toBe(1);
    expect(comps.point.w).toBe(1);
    expect(comps.eyev.x).toBe(0);
    expect(comps.eyev.y).toBe(0);
    expect(comps.eyev.z).toBe(-1);
    expect(comps.eyev.w).toBe(0);
    expect(comps.inside).toBeTruthy();
    expect(comps.normalv.x).toBe(0);
    expect(comps.normalv.y).toBe(0);
    expect(comps.normalv.z).toBe(-1);
    expect(comps.normalv.w).toBe(0);
  });
  test('The hit should offset the point', () => {
    let r: Ray = new Ray(createPoint(0, 0, -5), createVector(0, 0, 1));
    let shape: Shape = new Sphere();
    shape.transform = Transformations.translation(0, 0, 1);
    let i: Intersection = new Intersection(5, shape);
    let comps: IntersectionComputations = Intersection.prepareComputations(i, r);
    expect(comps.overPoint.z).toBeLessThan(-EPSILON / 2);
    expect(comps.point.z).toBeGreaterThan(comps.overPoint.z);
  });
});