import * as Transformations from './transformations';
import { Tuple, point } from '../math/tuple';

describe('shearing', () => {
    test('moves x in proportion of y', () => {
        let s = Transformations.shearing(1, 0, 0, 0, 0, 0);
        let p = point(2, 3, 4);
        let newPoint = Transformations.multiplyTranslationPoint(s, p);
        expect(newPoint.x).toBe(5);
        expect(newPoint.y).toBe(3);
        expect(newPoint.z).toBe(4);
    });
    test('moves x in proportion of z', () => {
        let s = Transformations.shearing(0, 1, 0, 0, 0, 0);
        let p = point(2, 3, 4);
        let newPoint = Transformations.multiplyTranslationPoint(s, p);
        expect(newPoint.x).toBe(6);
        expect(newPoint.y).toBe(3);
        expect(newPoint.z).toBe(4);
    });
    test('moves y in proportion of x', () => {
        let s = Transformations.shearing(0, 0, 1, 0, 0, 0);
        let p = point(2, 3, 4);
        let newPoint = Transformations.multiplyTranslationPoint(s, p);
        expect(newPoint.x).toBe(2);
        expect(newPoint.y).toBe(5);
        expect(newPoint.z).toBe(4);
    });
    test('moves y in proportion of z', () => {
        let s = Transformations.shearing(0, 0, 0, 1, 0, 0);
        let p = point(2, 3, 4);
        let newPoint = Transformations.multiplyTranslationPoint(s, p);
        expect(newPoint.x).toBe(2);
        expect(newPoint.y).toBe(7);
        expect(newPoint.z).toBe(4);
    });
    test('moves z in proportion of x', () => {
        let s = Transformations.shearing(0, 0, 0, 0, 1, 0);
        let p = point(2, 3, 4);
        let newPoint = Transformations.multiplyTranslationPoint(s, p);
        expect(newPoint.x).toBe(2);
        expect(newPoint.y).toBe(3);
        expect(newPoint.z).toBe(6);
    });
    test('moves z in proportion of y', () => {
        let s = Transformations.shearing(0, 0, 0, 0, 0, 1);
        let p = point(2, 3, 4);
        let newPoint = Transformations.multiplyTranslationPoint(s, p);
        expect(newPoint.x).toBe(2);
        expect(newPoint.y).toBe(3);
        expect(newPoint.z).toBe(7);
    });
});
