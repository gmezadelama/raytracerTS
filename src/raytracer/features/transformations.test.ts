import Transformations from './transformations';
import Matrix from '../math/matrices';
import { Point, Vector, createPoint, createVector } from '../math/tuple';
import { equal } from '../math/operations';
import { addXHours } from '../../ppm/clock';

describe('shearing', () => {
    test('moves x in proportion of y', () => {
        let s = Transformations.shearing(1, 0, 0, 0, 0, 0);
        let p = createPoint(2, 3, 4);
        let newPoint = Transformations.multiplyShearingPoint(s, p);
        expect(newPoint.x).toBe(5);
        expect(newPoint.y).toBe(3);
        expect(newPoint.z).toBe(4);
    });
    test('moves x in proportion of z', () => {
        let s = Transformations.shearing(0, 1, 0, 0, 0, 0);
        let p = createPoint(2, 3, 4);
        let newPoint = Transformations.multiplyShearingPoint(s, p);
        expect(newPoint.x).toBe(6);
        expect(newPoint.y).toBe(3);
        expect(newPoint.z).toBe(4);
    });
    test('moves y in proportion of x', () => {
        let s = Transformations.shearing(0, 0, 1, 0, 0, 0);
        let p = createPoint(2, 3, 4);
        let newPoint = Transformations.multiplyShearingPoint(s, p);
        expect(newPoint.x).toBe(2);
        expect(newPoint.y).toBe(5);
        expect(newPoint.z).toBe(4);
    });
    test('moves y in proportion of z', () => {
        let s = Transformations.shearing(0, 0, 0, 1, 0, 0);
        let p = createPoint(2, 3, 4);
        let newPoint = Transformations.multiplyShearingPoint(s, p);
        expect(newPoint.x).toBe(2);
        expect(newPoint.y).toBe(7);
        expect(newPoint.z).toBe(4);
    });
    test('moves z in proportion of x', () => {
        let s = Transformations.shearing(0, 0, 0, 0, 1, 0);
        let p = createPoint(2, 3, 4);
        let newPoint = Transformations.multiplyShearingPoint(s, p);
        expect(newPoint.x).toBe(2);
        expect(newPoint.y).toBe(3);
        expect(newPoint.z).toBe(6);
    });
    test('moves z in proportion of y', () => {
        let s = Transformations.shearing(0, 0, 0, 0, 0, 1);
        let p = createPoint(2, 3, 4);
        let newPoint = Transformations.multiplyShearingPoint(s, p);
        expect(newPoint.x).toBe(2);
        expect(newPoint.y).toBe(3);
        expect(newPoint.z).toBe(7);
    });
});

describe('translation', () => {
    test('multiplying by a translation matrix', () => {
        let transform: Matrix = Transformations.translation(5, -3, 2);
        let p: Point = createPoint(-3, 4, 5);
        let newPoint: Point = Transformations.multiplyTranslationPoint(transform, p);
        expect(newPoint.x).toBe(2);
        expect(newPoint.y).toBe(1);
        expect(newPoint.z).toBe(7);
        expect(newPoint.w).toBe(1);
    });
    test('multiplying by the inverse of a translation matrix', () => {
        let transform: Matrix = Transformations.translation(5, -3, 2);
        let inv: Matrix = Matrix.inverse(transform);
        let p: Point = createPoint(-3, 4, 5);
        let newPoint: Point = Transformations.multiplyTranslationPoint(inv, p);
        expect(newPoint.x).toBe(-8);
        expect(newPoint.y).toBe(7);
        expect(newPoint.z).toBe(3);
        expect(newPoint.w).toBe(1);
    });
    test('translation does not affect vectors', () => {
        let transform: Matrix = Transformations.translation(5, -3, 2);
        let v: Vector = createVector(-3, 4, 5);
        let newVector: Vector = Transformations.multiplyTranslationPoint(transform, v);
        expect(newVector.x).toBe(v.x);
        expect(newVector.y).toBe(v.y);
        expect(newVector.z).toBe(v.z);
        expect(newVector.w).toBe(0);
    });
});

describe('scaling', () => {
    test('a scaling matrix applied to a point', () => {
        let transform = Transformations.scaling(2, 3, 4);
        let p: Point = createPoint(-4, 6, 8);
        let newPoint: Point = Transformations.multiplyScalingPoint(transform, p);
        expect(newPoint.x).toBe(-8);
        expect(newPoint.y).toBe(18);
        expect(newPoint.z).toBe(32);
        expect(newPoint.w).toBe(1);
    });
    test('a scaling matrix applied to a vector', () => {
        let transform = Transformations.scaling(2, 3, 4);
        let v: Vector = createVector(-4, 6, 8);
        let newVector: Vector = Transformations.multiplyScalingPoint(transform, v);
        expect(newVector.x).toBe(-8);
        expect(newVector.y).toBe(18);
        expect(newVector.z).toBe(32);
        expect(newVector.w).toBe(0);
    });
    test('multiplying by the inverse of a scaling matrix', () => {
        let transform: Matrix = Transformations.scaling(2, 3, 4);
        let inv: Matrix = Matrix.inverse(transform);
        let v: Vector = createVector(-4, 6, 8);
        let newVector: Vector = Transformations.multiplyScalingPoint(inv, v);
        expect(newVector.x).toBe(-2);
        expect(newVector.y).toBe(2);
        expect(newVector.z).toBe(2);
        expect(newVector.w).toBe(0);
    });
    test('reflection is scaling by a negative value', () => {
        let transform = Transformations.scaling(-1, 1, 1);
        let p: Point = createPoint(2, 3, 4);
        let newPoint: Point = Transformations.multiplyScalingPoint(transform, p);
        expect(newPoint.x).toBe(-2);
        expect(newPoint.y).toBe(3);
        expect(newPoint.z).toBe(4);
        expect(newPoint.w).toBe(1);
    });
});

describe('rotation', () => {
    test('rotating a point around the x axis', () => {
        let p: Point = createPoint(0, 1, 0);
        let halfQuarter: Matrix = Transformations.rotateAroundX(Math.PI / 4);
        let fullQuarter: Matrix = Transformations.rotateAroundX(Math.PI / 2);
        let hqRotated = Transformations.multiplyRotationPoint(halfQuarter, p);
        let fqRotated = Transformations.multiplyRotationPoint(fullQuarter, p);
        expect(equal(hqRotated.x, 0)).toBeTruthy();
        expect(equal(hqRotated.y, Math.SQRT2 / 2)).toBeTruthy();
        expect(equal(hqRotated.z, Math.SQRT2 / 2)).toBeTruthy();
        expect(hqRotated.w).toBe(1);
        expect(equal(fqRotated.x, 0)).toBeTruthy();
        expect(equal(fqRotated.y, 0)).toBeTruthy();
        expect(equal(fqRotated.z, 1)).toBeTruthy();
        expect(fqRotated.w).toBe(1);
    });
    test('the inverse of an x-rotation rotates in the opposite direction', () => {
        let p: Point = createPoint(0, 1, 0);
        let halfQuarter: Matrix = Transformations.rotateAroundX(Math.PI / 4);
        let inv: Matrix = Matrix.inverse(halfQuarter);
        let hqInvRotated = Transformations.multiplyRotationPoint(inv, p);
        expect(equal(hqInvRotated.x, 0)).toBeTruthy();
        expect(equal(hqInvRotated.y, Math.SQRT2 / 2)).toBeTruthy();
        expect(equal(hqInvRotated.z, -Math.SQRT2 / 2)).toBeTruthy();
        expect(hqInvRotated.w).toBe(1);
    });
    test('rotating a point around the y axis', () => {
        let p: Point = createPoint(0, 0, 1);
        let halfQuarter: Matrix = Transformations.rotateAroundY(Math.PI / 4);
        let fullQuarter: Matrix = Transformations.rotateAroundY(Math.PI / 2);
        let hqRotated = Transformations.multiplyRotationPoint(halfQuarter, p);
        let fqRotated = Transformations.multiplyRotationPoint(fullQuarter, p);
        expect(equal(hqRotated.x, Math.SQRT2 / 2)).toBeTruthy();
        expect(equal(hqRotated.y, 0)).toBeTruthy();
        expect(equal(hqRotated.z, Math.SQRT2 / 2)).toBeTruthy();
        expect(hqRotated.w).toBe(1);
        expect(equal(fqRotated.x, 1)).toBeTruthy();
        expect(equal(fqRotated.y, 0)).toBeTruthy();
        expect(equal(fqRotated.z, 0)).toBeTruthy();
        expect(fqRotated.w).toBe(1);
    });
    test('rotating a point around the z axis', () => {
        let p: Point = createPoint(0, 1, 0);
        let halfQuarter: Matrix = Transformations.rotateAroundZ(Math.PI / 4);
        let fullQuarter: Matrix = Transformations.rotateAroundZ(Math.PI / 2);
        let hqRotated = Transformations.multiplyRotationPoint(halfQuarter, p);
        let fqRotated = Transformations.multiplyRotationPoint(fullQuarter, p);
        expect(equal(hqRotated.x, -Math.SQRT2 / 2)).toBeTruthy();
        expect(equal(hqRotated.y, Math.SQRT2 / 2)).toBeTruthy();
        expect(equal(hqRotated.z, 0)).toBeTruthy();
        expect(hqRotated.w).toBe(1);
        expect(equal(fqRotated.x, -1)).toBeTruthy();
        expect(equal(fqRotated.y, 0)).toBeTruthy();
        expect(equal(fqRotated.z, 0)).toBeTruthy();
        expect(fqRotated.w).toBe(1);
    });
});

describe('chaining transformations', () => {
    test('individual transformations are applied in sequence', () => {
        let p: Point = createPoint(1, 0, 1);
        let rotMatA: Matrix = Transformations.rotateAroundX(Math.PI / 2);
        let scalMatB: Matrix = Transformations.scaling(5, 5, 5);
        let transMatC: Matrix = Transformations.translation(10, 5, 7);
        let p2: Point = Transformations.multiplyTranslationPoint(rotMatA, p);
        let p3: Point = Transformations.multiplyScalingPoint(scalMatB, p2);
        let p4: Point = Transformations.multiplyRotationPoint(transMatC, p3);
        expect(equal(p2.x, 1)).toBeTruthy();
        expect(equal(p2.y, -1)).toBeTruthy();
        expect(equal(p2.z, 0)).toBeTruthy();
        expect(p2.w).toBe(1);
        expect(equal(p3.x, 5)).toBeTruthy();
        expect(equal(p3.y, -5)).toBeTruthy();
        expect(equal(p3.z, 0)).toBeTruthy();
        expect(p3.w).toBe(1);
        expect(equal(p4.x, 15)).toBeTruthy();
        expect(equal(p4.y, 0)).toBeTruthy();
        expect(equal(p4.z, 7)).toBeTruthy();
        expect(p4.w).toBe(1);
    });
    test('chained transformations must be applied in reverse order', () => {
        let p: Point = createPoint(1, 0, 1);
        let rotMatA: Matrix = Transformations.rotateAroundX(Math.PI / 2);
        let scalMatB: Matrix = Transformations.scaling(5, 5, 5);
        let transMatC: Matrix = Transformations.translation(10, 5, 7);
        let p4: Point = Transformations.applyChainedTransformations(
            [transMatC, scalMatB, rotMatA],
            p
        );
        expect(equal(p4.x, 15)).toBeTruthy();
        expect(equal(p4.y, 0)).toBeTruthy();
        expect(equal(p4.z, 7)).toBeTruthy();
        expect(p4.w).toBe(1);
    });
    test('testing fluid API', () => {
        let transform = Matrix.Identity(4)
                        .rotateAroundX(Math.PI / 2)
                        .scaling(5, 5, 5)
                        .translation(10, 5, 7);
        let p: Point = createPoint(1, 0, 1);
        let pTransf = Transformations.multiplyTransformationMatrixPoint(transform, p);
        expect(equal(pTransf.x, 15)).toBeTruthy();
        expect(equal(pTransf.y, 0)).toBeTruthy();
        expect(equal(pTransf.z, 7)).toBeTruthy();
        expect(pTransf.w).toBe(1);
    });
    test('clock test', () => {
        // clock Y axis oriented
        // const ClockCenter: Point = createPoint(0, 0, 0);
        const TwelveOClock: Point = createPoint (0, 0, 1);
        const ThreeOClock: Point = createPoint (1, 0, 0);

        let newTime: Point = addXHours(TwelveOClock, 3);
        expect(equal(newTime.x, ThreeOClock.x)).toBeTruthy();
        expect(equal(newTime.y, ThreeOClock.y)).toBeTruthy();
        expect(equal(newTime.z, ThreeOClock.z)).toBeTruthy();
        expect(newTime.w).toBe(1);
    });
});