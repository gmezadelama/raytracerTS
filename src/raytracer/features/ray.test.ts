import { Point, Vector, point, vector } from '../math/tuple';
import Ray from './ray';
import Sphere from '../geometry/sphere';

describe('ray', () => {
    let r: Ray;
    beforeAll(() => {
        r = new Ray(
            point(2, 3, 4),
            vector(1, 0, 0)
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
            point(0, 0, -5),
            vector(0, 0, 1)
        );
        let xs = s.intersect(r);
        expect(xs.length).toBe(2);
        expect(xs[0]).toBe(4);
        expect(xs[1]).toBe(6);
    });
    it('should intersect one point', () => {
        let r = new Ray(
            point(0, 1, -5),
            vector(0, 0, 1)
        );
        let xs = s.intersect(r);
        expect(xs.length).toBe(2);
        expect(xs[0]).toBe(5);
        expect(xs[1]).toBe(5);
    });
    it('should miss the sphere', () => {
        let r = new Ray(
            point(0, 2, -5),
            vector(0, 0, 1)
        );
        let xs = s.intersect(r);
        expect(xs.length).toBe(0);
    });
    test('ray originate inside a sphere', () => {
        let r = new Ray(
            point(0, 0, 0),
            vector(0, 0, 1)
        );
        let xs = s.intersect(r);
        expect(xs.length).toBe(2);
        expect(xs[0]).toBe(-1);
        expect(xs[1]).toBe(1);
    });
    test('sphere behind a ray', () => {
        let r = new Ray(
            point(0, 0, 5),
            vector(0, 0, 1)
        );
        let xs = s.intersect(r);
        expect(xs.length).toBe(2);
        expect(xs[0]).toBe(-6);
        expect(xs[1]).toBe(-4);
    });
});
