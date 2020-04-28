import Ray from '../../features/ray';
import Sphere from '../sphere';
import Transformations from '../../features/transformations';
import Matrix from '../../math/matrices';
import { createPoint, createVector, vectorMagnitude } from '../../math/tuple';
import { equal } from '../../math/operations';

describe(`sphere's transformation and intersection tests`, () => {
    test(`A sphere's default transformation`, () => {
        let s = new Sphere();
        expect(Matrix.equal(s.transform, Matrix.Identity())).toBeTruthy();
    });
    test(`Changing a sphere's transformation`, () => {
        let s = new Sphere();
        let t = Transformations.translation(2, 3 ,4);
        s.transform = t;
        expect(Matrix.equal(s.transform, t)).toBeTruthy();
    });
    test('Intersecting a scaled sphere with a ray', () => {
        let r = new Ray(createPoint(0, 0, -5), createVector(0, 0, 1));
        let s = new Sphere();
        s.transform = Transformations.scaling(2, 2, 2);
        let is = s.intersect(r);
        expect(is.length).toBe(2);
        expect(is[0].t).toBe(3);
        expect(is[1].t).toBe(7);
    });
    test('Intersecting a translated sphere with a ray', () => {
        let r = new Ray(createPoint(0, 0, -5), createVector(0, 0, 1));
        let s = new Sphere();
        s.transform = Transformations.translation(5, 0, 0);
        let is = s.intersect(r);
        expect(is.length).toBe(0);
    });
});

describe('sphere\'s normal tests ', () => {
    let s: Sphere = null;
    beforeEach(() => {
        s = new Sphere();
    })
    test('The normal on a sphere at a point on the X axis', () => {
        let n = s.normalAt(createPoint(1, 0, 0));
        let v = createVector(1, 0, 0);
        expect(n.x).toBe(v.x);
        expect(n.y).toBe(v.y);
        expect(n.z).toBe(v.z);
        expect(n.w).toBe(v.w);
    });
    test('The normal on a sphere at a point on the Y axis', () => {
        let n = s.normalAt(createPoint(0, 1, 0));
        let v = createVector(0, 1, 0);
        expect(n.x).toBe(v.x);
        expect(n.y).toBe(v.y);
        expect(n.z).toBe(v.z);
        expect(n.w).toBe(v.w);
    });
    test('The normal on a sphere at a point on the Z axis', () => {
        let n = s.normalAt(createPoint(0, 0, 1));
        let v = createVector(0, 0, 1);
        expect(n.x).toBe(v.x);
        expect(n.y).toBe(v.y);
        expect(n.z).toBe(v.z);
        expect(n.w).toBe(v.w);
    });
    test('The normal on a sphere at a nonaxial point', () => {
        let n = s.normalAt(createPoint(Math.sqrt(3) / 3, Math.sqrt(3) / 3, Math.sqrt(3) / 3));
        let v = createVector(Math.sqrt(3) / 3, Math.sqrt(3) / 3, Math.sqrt(3) / 3);
        expect(n.x).toBe(v.x);
        expect(n.y).toBe(v.y);
        expect(n.z).toBe(v.z);
        expect(n.w).toBe(v.w);
    });
    test('The normal is a normalized vector', () => {
        let n = s.normalAt(createPoint(Math.sqrt(3) / 3, Math.sqrt(3) / 3, Math.sqrt(3) / 3));
        expect(vectorMagnitude(n)).toBe(1);
    });
    test('Computing the normal on a translated sphere', () => {
        s.transform = Transformations.translation(0, 1, 0);
        let n = s.normalAt(createPoint(0, 1.70711, -0.70711));
        let v = createVector(0, 0.70711, -0.70711);
        expect(equal(n.x, v.x)).toBeTruthy();
        expect(equal(n.y, v.y)).toBeTruthy();
        expect(equal(n.z, v.z)).toBeTruthy();
        expect(n.w).toBe(v.w);
    });
    test('Computing the normal on a transformed sphere', () => {
        s.transform = Transformations.getChainedTransformations(
            Transformations.scaling(1, 0.5, 1),
            Transformations.rotateAroundZ(Math.PI / 5)
        );
        let n = s.normalAt(createPoint(0, Math.SQRT2 / 2, - Math.SQRT2 / 2));
        let v = createVector(0, 0.97014, -0.24254);
        expect(equal(n.x, v.x)).toBeTruthy();
        expect(equal(n.y, v.y)).toBeTruthy();
        expect(equal(n.z, v.z)).toBeTruthy();
        expect(n.w).toBe(v.w);
    });
});
