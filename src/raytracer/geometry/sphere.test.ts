import Ray from '../features/ray';
import Sphere from './sphere';
import Transformations from '../features/transformations';
import Matrix from '../math/matrices';
import { createPoint, createVector } from '../math/tuple';

describe(`sphere's tests`, () => {
    test(`A sphere's default transformation`, () => {
        let s = new Sphere();
        expect(Matrix.equal(s.getTransform(), Matrix.Identity())).toBeTruthy();
    });
    test(`Changing a sphere's transformation`, () => {
        let s = new Sphere();
        let t = Transformations.translation(2, 3 ,4);
        s.setTransform(t);
        expect(Matrix.equal(s.getTransform(), t)).toBeTruthy();
    });
    test('Intersecting a scaled sphere with a ray', () => {
        let r = new Ray(createPoint(0, 0, -5), createVector(0, 0, 1));
        let s = new Sphere();
        s.setTransform(Transformations.scaling(2, 2, 2));
        let is = s.intersect(r);
        expect(is.length).toBe(2);
        expect(is[0].t).toBe(3);
        expect(is[1].t).toBe(7);
    });
    test('Intersecting a translated sphere with a ray', () => {
        let r = new Ray(createPoint(0, 0, -5), createVector(0, 0, 1));
        let s = new Sphere();
        s.setTransform(Transformations.translation(5, 0, 0));
        let is = s.intersect(r);
        expect(is.length).toBe(0);
    });
});
