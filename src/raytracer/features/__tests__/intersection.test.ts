import { createPoint, createVector, equalVector } from '../../math/tuple';
import Sphere from '../../geometry/sphere';
import Shape from '../../geometry/shape';
import Ray from '../ray';
import Intersection, { IntersectionComputations } from '../intersection';
import Transformations from '../transformations';
import { EPSILON, equal } from '../../math/operations';
import Plane from '../../geometry/plane';
import { glassMaterial } from '../../shading/material';

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
  test('Precomputing the reflection vector', () => {
    let shape: Shape = new Plane();
    let r: Ray = new Ray(createPoint(0, 1, -1), createVector(0, -Math.SQRT2 / 2, Math.SQRT2 / 2));
    let i: Intersection = new Intersection(Math.SQRT2, shape);
    let comps: IntersectionComputations = Intersection.prepareComputations(i, r);
    expect(equalVector(comps.reflectv, createVector(0, Math.SQRT2 / 2, Math.SQRT2 / 2))).toBeTruthy();
  });
});

describe('Testing determination of n1 and n2', () => {
  let sphereA: Sphere;
  let sphereB: Sphere;
  let sphereC: Sphere;
  let r: Ray;
  let xs: Intersection[];
  beforeAll(() => {
    sphereA = new Sphere();
    sphereA.material = glassMaterial();
    sphereA.transform = Transformations.translation(2, 2, 2);
    sphereB = new Sphere();
    sphereB.material = glassMaterial();
    sphereB.material.refractiveIndex = 2.0;
    sphereB.transform = Transformations.translation(0, 0, -0.25);
    sphereC = new Sphere();
    sphereC.material = glassMaterial();
    sphereC.material.refractiveIndex = 2.5;
    sphereC.transform = Transformations.translation(0, 0, 0.25);
    r = new Ray(createPoint(0, 0, -4), createVector(0, 0, 1));
    xs = Intersection.aggregateIntersections(
          new Intersection(2, sphereA),
          new Intersection(2.75, sphereB),
          new Intersection(3.25, sphereC),
          new Intersection(4.75, sphereB),
          new Intersection(5.25, sphereC),
          new Intersection(6, sphereA)
         );
  });
  test('n1 and n2 determination on sphere A and intersection t = 2', () => {
    let comps: IntersectionComputations = Intersection.prepareComputations(xs[0], r, xs);
    expect(equal(comps.n1, 1.0)).toBeTruthy();
    expect(equal(comps.n2, 1.5)).toBeTruthy();
  });
  test('n1 and n2 determination on sphere B and intersection t = 2.75', () => {
    let comps: IntersectionComputations = Intersection.prepareComputations(xs[1], r, xs);
    expect(equal(comps.n1, 1.5)).toBeTruthy();
    expect(equal(comps.n2, 2.0)).toBeTruthy();
  });
  test('n1 and n2 determination on sphere C and intersection t = 3.25', () => {
    let comps: IntersectionComputations = Intersection.prepareComputations(xs[2], r, xs);
    expect(equal(comps.n1, 2.0)).toBeTruthy();
    expect(equal(comps.n2, 2.5)).toBeTruthy();
  });
  test('n1 and n2 determination on sphere B and intersection t = 4.75', () => {
    let comps: IntersectionComputations = Intersection.prepareComputations(xs[3], r, xs);
    expect(equal(comps.n1, 2.5)).toBeTruthy();
    expect(equal(comps.n2, 2.5)).toBeTruthy();
  });
  test('n1 and n2 determination on sphere C and intersection t = 5.25', () => {
    let comps: IntersectionComputations = Intersection.prepareComputations(xs[4], r, xs);
    expect(equal(comps.n1, 2.5)).toBeTruthy();
    expect(equal(comps.n2, 1.5)).toBeTruthy();
  });
  test('n1 and n2 determination on sphere A and intersection t = 6', () => {
    let comps: IntersectionComputations = Intersection.prepareComputations(xs[5], r, xs);
    expect(equal(comps.n1, 1.5)).toBeTruthy();
    expect(equal(comps.n2, 1.0)).toBeTruthy();
  });
});

describe('Intersections for calculations important to compute refraction', () => {
  test('the under point is offset below the surface', () => {
    let r: Ray = new Ray(createPoint(0, 0, -5), createVector(0, 0, 1));
    let shape: Shape = new Sphere();
    shape.material = glassMaterial();
    shape.transform = Transformations.translation(0, 0, 1);
    let i: Intersection = new Intersection(5, shape);
    let xs: Intersection[] = Intersection.aggregateIntersections(i);
    let comps: IntersectionComputations = Intersection.prepareComputations(i, r, xs); // TODO: test default value
    expect(comps.underPoint.z).toBeGreaterThan(EPSILON / 2);
    expect(comps.point.z).toBeLessThan(comps.underPoint.z);
  });
});