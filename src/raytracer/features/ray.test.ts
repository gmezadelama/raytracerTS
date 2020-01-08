import { Point, Vector, createPoint, createVector } from '../math/tuple';
import Ray from './ray';
import Intersection, { aggregateIntersections, hit } from './intersection'; 
import Sphere from '../geometry/sphere';
import * as Transformation from './transformations';

describe('ray', () => {
    let r: Ray;
    beforeAll(() => {
        r = new Ray(
            createPoint(2, 3, 4),
            createVector(1, 0, 0)
        );
    });
    it('should have right values at 0', () => {
        let p = r.getTPoint(0);
        expect(p.x).toBe(2);
        expect(p.y).toBe(3);
        expect(p.z).toBe(4);
        expect(p.w).toBe(1);
    });
    it('should have right values at 1', () => {
        let p = r.getTPoint(1);
        expect(p.x).toBe(3);
        expect(p.y).toBe(3);
        expect(p.z).toBe(4);
        expect(p.w).toBe(1);
    });
    it('should have right values at -1', () => {
        let p = r.getTPoint(-1);
        expect(p.x).toBe(1);
        expect(p.y).toBe(3);
        expect(p.z).toBe(4);
        expect(p.w).toBe(1);
    });
    it('should have right values at 2.5', () => {
        let p = r.getTPoint(2.5);
        expect(p.x).toBe(4.5);
        expect(p.y).toBe(3);
        expect(p.z).toBe(4);
        expect(p.w).toBe(1);
    });
});

describe('intersection with a sphere', () => {
    let s: Sphere;
    beforeAll(() => {
        s = new Sphere();
    });
    it('should intersect two points', () => {
        let r = new Ray(
            createPoint(0, 0, -5),
            createVector(0, 0, 1)
        );
        let xs = s.intersect(r);
        expect(xs.length).toBe(2);
        expect(xs[0].t).toBe(4);
        expect(xs[1].t).toBe(6);
        expect(xs[0].object.equals(s)).toBeTruthy();
        expect(xs[1].object.equals(s)).toBeTruthy();
    });
    it('should intersect one point', () => {
        let r = new Ray(
            createPoint(0, 1, -5),
            createVector(0, 0, 1)
        );
        let xs = s.intersect(r);
        expect(xs.length).toBe(2);
        expect(xs[0].t).toBe(5);
        expect(xs[1].t).toBe(5);
    });
    it('should miss the sphere', () => {
        let r = new Ray(
            createPoint(0, 2, -5),
            createVector(0, 0, 1)
        );
        let xs = s.intersect(r);
        expect(xs.length).toBe(0);
    });
    test('ray originate inside a sphere', () => {
        let r = new Ray(
            createPoint(0, 0, 0),
            createVector(0, 0, 1)
        );
        let xs = s.intersect(r);
        expect(xs.length).toBe(2);
        expect(xs[0].t).toBe(-1);
        expect(xs[1].t).toBe(1);
    });
    test('sphere behind a ray', () => {
        let r = new Ray(
            createPoint(0, 0, 5),
            createVector(0, 0, 1)
        );
        let xs = s.intersect(r);
        expect(xs.length).toBe(2);
        expect(xs[0].t).toBe(-6);
        expect(xs[1].t).toBe(-4);
    });
});

describe('hit to a sphere', () => {
    let s: Sphere;
    beforeAll(() => {
        s = new Sphere();
    });
    test('The hit, when all intersections have positive t', () => {
        let i1 = new Intersection(1, s);
        let i2 = new Intersection(2, s);
        let is = aggregateIntersections(i2, i1);
        let i: Intersection = hit(is);
        expect(i.equals(i1)).toBeTruthy();
    });
    test('The hit, when some intersections have negative t', () => {
        let i1 = new Intersection(-1, s);
        let i2 = new Intersection(1, s);
        let is = aggregateIntersections(i2, i1);
        let i: Intersection = hit(is);
        expect(i.equals(i2)).toBeTruthy();
    });
    test('The hit, when all intersections have negative t', () => {
        let i1 = new Intersection(-2, s);
        let i2 = new Intersection(-1, s);
        let is = aggregateIntersections(i2, i1);
        let i: Intersection = hit(is);
        expect(i).toBeUndefined();
    });
    test('The hit is always the lowest nonnegative intersection', () => {
        let i1 = new Intersection(5, s);
        let i2 = new Intersection(7, s);
        let i3 = new Intersection(-3, s);
        let i4 = new Intersection(2, s);
        let is = aggregateIntersections(i1, i2, i3, i4);
        let i: Intersection = hit(is);
        expect(i.equals(i4)).toBeTruthy();
    });
});

describe('applying transformations on ray', () => {
    test('Translating a ray', () => {
        let r = new Ray(createPoint(1, 2, 3), createVector(0, 1, 0));
        let m = Transformation.translation(3, 4, 5);
        let r2 = r.transformRay(m);
        const {
            origin: r2Origin,
            direction: r2Direction
        } = r2.getValues();
        expect(r2Origin.x).toBe(4);
        expect(r2Origin.y).toBe(6);
        expect(r2Origin.z).toBe(8);
        expect(r2Direction.x).toBe(0);
        expect(r2Direction.y).toBe(1);
        expect(r2Direction.z).toBe(0);
    });
    test('Scaling a ray', () => {
        let r = new Ray(createPoint(1, 2, 3), createVector(0, 1, 0));
        let m = Transformation.scaling(2, 3, 4);
        let r2 = r.transformRay(m);
        const {
            origin: r2Origin,
            direction: r2Direction
        } = r2.getValues();
        expect(r2Origin.x).toBe(2);
        expect(r2Origin.y).toBe(6);
        expect(r2Origin.z).toBe(12);
        expect(r2Direction.x).toBe(0);
        expect(r2Direction.y).toBe(3);
        expect(r2Direction.z).toBe(0);
    });
});
