import Ray from '../features/ray';
import Sphere from './sphere';
import * as Transformation from '../features/transformations';
import { equal, Identity } from '../math/matrices';
import { createPoint, createVector } from '../math/tuple';

describe(`sphere's tests`, () => {
    test(`A sphere's default transformation`, () => {
        let s = new Sphere();
        expect(equal(s.getTransform(), Identity())).toBeTruthy();
    });
    test(`Changing a sphere's transformation`, () => {
        let s = new Sphere();
        let t = Transformation.translation(2, 3 ,4);
        s.setTransform(t);
        expect(equal(s.getTransform(), t)).toBeTruthy();
    });
    test('Intersecting a scaled sphere with a ray', () => {
        let r = new Ray(createPoint(0, 0, -5), createVector(0, 0, 1));
        let s = new Sphere();
        s.setTransform(Transformation.scaling(2, 2, 2));
        let is = s.intersect(r);
        expect(is.length).toBe(2);
        expect(is[0].t).toBe(3);
        expect(is[1].t).toBe(7);
    });
    test('Intersecting a translated sphere with a ray', () => {
        let r = new Ray(createPoint(0, 0, -5), createVector(0, 0, 1));
        let s = new Sphere();
        s.setTransform(Transformation.translation(5, 0, 0));
        let is = s.intersect(r);
        expect(is.length).toBe(0);
    });
});
