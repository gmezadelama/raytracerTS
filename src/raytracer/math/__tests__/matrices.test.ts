
import Matrix from '../matrices';
import { equal } from '../operations';

test('m[1][2] to be equal to 3', () => {
    let m = new Matrix(2, 3);
    m.set(1, 2, 3);
    expect(m.get(1, 2)).toBe(3);
});

describe('M3x3', () => {
    let m = new Matrix(3, 3);
    beforeAll(() => {
        m.set(0, 0, 1);
        m.set(0, 1, 2);
        m.set(0, 2, 6);
        m.set(1, 0, -5);
        m.set(1, 1, 8);
        m.set(1, 2, -4);
        m.set(2, 0, 2);
        m.set(2, 1, 6);
        m.set(2, 2, 4);
    });
    test('cofactor(0, 0) to be equal 56', () => {
        expect(Matrix.cofactor(m, 0, 0)).toBe(56);
    });
    test('cofactor(0, 1) to be equal 12', () => {
        expect(Matrix.cofactor(m, 0, 1)).toBe(12);
    });
    test('cofactor(0, 2) to be equal -46', () => {
        expect(Matrix.cofactor(m, 0, 2)).toBe(-46);
    });
    test('det|M3x3| to be equal to -196', () => {
        expect(Matrix.determinant(m)).toBe(-196);
    });    
});

describe('M4x4', () => {
    let m = new Matrix(4, 4);
    beforeAll(() => {        
        m.set(0, 0, -2);
        m.set(0, 1, -8);
        m.set(0, 2, 3);
        m.set(0, 3, 5);
        m.set(1, 0, -3);
        m.set(1, 1, 1);
        m.set(1, 2, 7);
        m.set(1, 3, 3);
        m.set(2, 0, 1);
        m.set(2, 1, 2);
        m.set(2, 2, -9);
        m.set(2, 3, 6);
        m.set(3, 0, -6);
        m.set(3, 1, 7);
        m.set(3, 2, 7);
        m.set(3, 3, -9);
    });
    test('cofactor(0, 0) to be equal 690', () => {
        expect(Matrix.cofactor(m, 0, 0)).toBe(690);
    });
    test('cofactor(0, 1) to be equal 447', () => {
        expect(Matrix.cofactor(m, 0, 1)).toBe(447);
    });
    test('cofactor(0, 2) to be equal 210', () => {
        expect(Matrix.cofactor(m, 0, 2)).toBe(210);
    });
    test('cofactor(0, 3) to be equal 51', () => {
        expect(Matrix.cofactor(m, 0, 3)).toBe(51);
    });
    test('det|M4x4| to be equal to -4071', () => {
        expect(Matrix.determinant(m)).toBe(-4071);
    });
});

describe('inverse M4x4 (1)', () => {
    let m = new Matrix(4, 4);
    let invM = new Matrix(4, 4);
    beforeAll(() => {
        m.set(0, 0, 8);
        m.set(0, 1, -5);
        m.set(0, 2, 9);
        m.set(0, 3, 2);
        m.set(1, 0, 7);
        m.set(1, 1, 5);
        m.set(1, 2, 6);
        m.set(1, 3, 1);
        m.set(2, 0, -6);
        m.set(2, 1, 0);
        m.set(2, 2, 9);
        m.set(2, 3, 6);
        m.set(3, 0, -3);
        m.set(3, 1, 0);
        m.set(3, 2, -9);
        m.set(3, 3, -4);

        invM = Matrix.inverse(m);
        // invM.set(0, 0, -0.15385);
        // invM.set(0, 1, -0.15385);
        // invM.set(0, 2, -0.28205);
        // invM.set(0, 3, -0.53846);
        // invM.set(1, 0, -0.07692);
        // invM.set(1, 1, 0.12308);
        // invM.set(1, 2, 0.02564);
        // invM.set(1, 3, 0.03077);
        // invM.set(2, 0, 0.35897);
        // invM.set(2, 1, 0.35897);
        // invM.set(2, 2, 0.43590);
        // invM.set(2, 3, 0.92308);
        // invM.set(3, 0, -0.69231);
        // invM.set(3, 1, -0.69231);
        // invM.set(3, 2, -0.76923);
        // invM.set(3, 3, -1.92308);
    });
    test('invM(0,0) to be equal -0.15385', () => {
        expect(equal(invM.get(0, 0), -0.15385)).toBeTruthy();
    });
    test('invM(0,1) to be equal -0.15385', () => {
        expect(equal(invM.get(0, 1), -0.15385)).toBeTruthy();
    });
    test('invM(0,2) to be equal -0.28205', () => {
        expect(equal(invM.get(0, 2), -0.28205)).toBeTruthy();
    });
    test('invM(0,3) to be equal -0.53846', () => {
        expect(equal(invM.get(0, 3), -0.53846)).toBeTruthy();
    });
    test('invM(1,0) to be equal -0.07692', () => {
        expect(equal(invM.get(1, 0), -0.07692)).toBeTruthy();
    });
    test('invM(1,1) to be equal 0.12308', () => {
        expect(equal(invM.get(1, 1), 0.12308)).toBeTruthy();
    });
    test('invM(1,2) to be equal 0.02564', () => {
        expect(equal(invM.get(1, 2), 0.02564)).toBeTruthy();
    });
    test('invM(1,2) to be equal 0.03077', () => {
        expect(equal(invM.get(1, 3), 0.03077)).toBeTruthy();
    });
    test('invM(2,0) to be equal 0.35897', () => {
        expect(equal(invM.get(2, 0), 0.35897)).toBeTruthy();
    });
    test('invM(2,1) to be equal 0.35897', () => {
        expect(equal(invM.get(2, 1), 0.35897)).toBeTruthy();
    });
    test('invM(2,2) to be equal 0.43590', () => {
        expect(equal(invM.get(2, 2), 0.43590)).toBeTruthy();
    });
    test('invM(2,3) to be equal 0.92308', () => {
        expect(equal(invM.get(2, 3), 0.92308)).toBeTruthy();
    });
    test('invM(3,0) to be equal -0.69231', () => {
        expect(equal(invM.get(3, 0), -0.69231)).toBeTruthy();
    });
    test('invM(3,1) to be equal -0.69231', () => {
        expect(equal(invM.get(3, 1), -0.69231)).toBeTruthy();
    });
    test('invM(3,2) to be equal -0.76923', () => {
        expect(equal(invM.get(3, 2), -0.76923)).toBeTruthy();
    });
    test('invM(3,3) to be equal -1.92308', () => {
        expect(equal(invM.get(3, 3), -1.92308)).toBeTruthy();
    });
});

describe('inverse M4x4 (2)', () => {
    let m = new Matrix(4, 4);
    let invM = new Matrix(4, 4);
    beforeAll(() => {
        m.set(0, 0, 9);
        m.set(0, 1, 3);
        m.set(0, 2, 0);
        m.set(0, 3, 9);
        m.set(1, 0, -5);
        m.set(1, 1, -2);
        m.set(1, 2, -6);
        m.set(1, 3, -3);
        m.set(2, 0, -4);
        m.set(2, 1, 9);
        m.set(2, 2, 6);
        m.set(2, 3, 4);
        m.set(3, 0, -7);
        m.set(3, 1, 6);
        m.set(3, 2, 6);
        m.set(3, 3, 2);

        invM = Matrix.inverse(m);
        // invM.set(0, 0, -0.04074);
        // invM.set(0, 1, -0.07778);
        // invM.set(0, 2, 0.14444);
        // invM.set(0, 3, -0.22222);
        // invM.set(1, 0, -0.07778);
        // invM.set(1, 1, 0.03333);
        // invM.set(1, 2, 0.36667);
        // invM.set(1, 3, -0.33333);
        // invM.set(2, 0, -0.02901);
        // invM.set(2, 1, -0.14630);
        // invM.set(2, 2, -0.10926);
        // invM.set(2, 3, 0.12963);
        // invM.set(3, 0, 0.17778);
        // invM.set(3, 1, 0.06667);
        // invM.set(3, 2, -0.26667);
        // invM.set(3, 3, 0.33333);
    });
    test('invM(0,0) to be equal -0.04074', () => {
        expect(equal(invM.get(0, 0), -0.04074)).toBeTruthy();
    });
    test('invM(0,1) to be equal -0.07778', () => {
        expect(equal(invM.get(0, 1), -0.07778)).toBeTruthy();
    });
    test('invM(0,2) to be equal 0.14444', () => {
        expect(equal(invM.get(0, 2), 0.14444)).toBeTruthy();
    });
    test('invM(0,3) to be equal -0.22222', () => {
        expect(equal(invM.get(0, 3), -0.22222)).toBeTruthy();
    });
    test('invM(1,0) to be equal -0.07778', () => {
        expect(equal(invM.get(1, 0), -0.07778)).toBeTruthy();
    });
    test('invM(1,1) to be equal 0.03333', () => {
        expect(equal(invM.get(1, 1), 0.03333)).toBeTruthy();
    });
    test('invM(1,2) to be equal 0.36667', () => {
        expect(equal(invM.get(1, 2), 0.36667)).toBeTruthy();
    });
    test('invM(1,2) to be equal -0.33333', () => {
        expect(equal(invM.get(1, 3), -0.33333)).toBeTruthy();
    });
    test('invM(2,0) to be equal -0.02901', () => {
        expect(equal(invM.get(2, 0), -0.02901)).toBeTruthy();
    });
    test('invM(2,1) to be equal -0.14630', () => {
        expect(equal(invM.get(2, 1), -0.14630)).toBeTruthy();
    });
    test('invM(2,2) to be equal -0.10926', () => {
        expect(equal(invM.get(2, 2), -0.10926)).toBeTruthy();
    });
    test('invM(2,3) to be equal 0.12963', () => {
        expect(equal(invM.get(2, 3), 0.12963)).toBeTruthy();
    });
    test('invM(3,0) to be equal 0.17778', () => {
        expect(equal(invM.get(3, 0), 0.17778)).toBeTruthy();
    });
    test('invM(3,1) to be equal 0.06667', () => {
        expect(equal(invM.get(3, 1), 0.06667)).toBeTruthy();
    });
    test('invM(3,2) to be equal -0.26667', () => {
        expect(equal(invM.get(3, 2), -0.26667)).toBeTruthy();
    });
    test('invM(3,3) to be equal 0.33333', () => {
        expect(equal(invM.get(3, 3), 0.33333)).toBeTruthy();
    });
});

describe('Multiplying product by its inverse', () => {
    let a = new Matrix(4, 4);
    let b = new Matrix(4, 4);
    let aProd:Matrix;
    beforeAll(() => {
        a.set(0, 0, 3);
        a.set(0, 1, -9);
        a.set(0, 2, 7);
        a.set(0, 3, 3);
        a.set(1, 0, 3);
        a.set(1, 1, -8);
        a.set(1, 2, 2);
        a.set(1, 3, -9);
        a.set(2, 0, -4);
        a.set(2, 1, 4);
        a.set(2, 2, 4);
        a.set(2, 3, 1);
        a.set(3, 0, -6);
        a.set(3, 1, 5);
        a.set(3, 2, -1);
        a.set(3, 3, 1);

        b.set(0, 0, 8);
        b.set(0, 1, 2);
        b.set(0, 2, 2);
        b.set(0, 3, 2);
        b.set(1, 0, 3);
        b.set(1, 1, -1);
        b.set(1, 2, 7);
        b.set(1, 3, 0);
        b.set(2, 0, 7);
        b.set(2, 1, 0);
        b.set(2, 2, 5);
        b.set(2, 3, 4);
        b.set(3, 0, 6);
        b.set(3, 1, -2);
        b.set(3, 2, 0);
        b.set(3, 3, 5);

        let c = Matrix.multiply(a, b);
        let invB = Matrix.inverse(b);
        aProd = Matrix.multiply(c, invB);
    });
    test('(C * invB)(0,0) to be equal a(0,0)', () => {
        expect(equal(aProd.get(0, 0), a.get(0, 0))).toBeTruthy();
    });
    test('(C * invB)(0,1) to be equal a(0,1)', () => {
        expect(equal(aProd.get(0, 1), a.get(0, 1))).toBeTruthy();
    });
    test('(C * invB)(0,2) to be equal a(0,2)', () => {
        expect(equal(aProd.get(0, 2), a.get(0, 2))).toBeTruthy();
    });
    test('(C * invB)(0,3) to be equal a(0,3)', () => {
        expect(equal(aProd.get(0, 3), a.get(0, 3))).toBeTruthy();
    });
    test('(C * invB)(1,0) to be equal a(1,0)', () => {
        expect(equal(aProd.get(1, 0), a.get(1, 0))).toBeTruthy();
    });
    test('(C * invB)(1,1) to be equal a(1,1)', () => {
        expect(equal(aProd.get(1, 1), a.get(1, 1))).toBeTruthy();
    });
    test('(C * invB)(1,2) to be equal a(1,2)', () => {
        expect(equal(aProd.get(1, 2), a.get(1, 2))).toBeTruthy();
    });
    test('(C * invB)(1,3) to be equal a(1,3)', () => {
        expect(equal(aProd.get(1, 3), a.get(1, 3))).toBeTruthy();
    });
    test('(C * invB)(2,0) to be equal a(2,0)', () => {
        expect(equal(aProd.get(2, 0), a.get(2, 0))).toBeTruthy();
    });
    test('(C * invB)(2,1) to be equal a(2,1)', () => {
        expect(equal(aProd.get(2, 1), a.get(2, 1))).toBeTruthy();
    });
    test('(C * invB)(2,2) to be equal a(2,2)', () => {
        expect(equal(aProd.get(2, 2), a.get(2, 2))).toBeTruthy();
    });
    test('(C * invB)(2,3) to be equal a(2,3)', () => {
        expect(equal(aProd.get(2, 3), a.get(2, 3))).toBeTruthy();
    });
    test('(C * invB)(3,0) to be equal a(3,0)', () => {
        expect(equal(aProd.get(3, 0), a.get(3, 0))).toBeTruthy();
    });
    test('(C * invB)(3,1) to be equal a(3,1)', () => {
        expect(equal(aProd.get(3, 1), a.get(3, 1))).toBeTruthy();
    });
    test('(C * invB)(3,2) to be equal a(3,2)', () => {
        expect(equal(aProd.get(3, 2), a.get(3, 2))).toBeTruthy();
    });
    test('(C * invB)(3,3) to be equal a(3,3)', () => {
        expect(equal(aProd.get(3, 3), a.get(3, 3))).toBeTruthy();
    });
});

describe('Testing setMatrix', () => {
    let m = new Matrix(0, 0);
    beforeAll(() => {
        m.setMatrix(
            [
                [1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12],
                [13, 14, 15, 16]
            ]
        );
    });
    it('m[0,0] equals to 1', () => {
        expect(m.get(0, 0)).toBe(1);
    });
    it('m[0,1] equals to 2', () => {
        expect(m.get(0, 1)).toBe(2);
    });
    it('m[0,2] equals to 3', () => {
        expect(m.get(0, 2)).toBe(3);
    });
    it('m[0,3] equals to 4', () => {
        expect(m.get(0, 3)).toBe(4);
    });
    it('m[1,0] equals to 5', () => {
        expect(m.get(1, 0)).toBe(5);
    });
    it('m[1,1] equals to 6', () => {
        expect(m.get(1, 1)).toBe(6);
    });
    it('m[1,2] equals to 7', () => {
        expect(m.get(1, 2)).toBe(7);
    });
    it('m[1,3] equals to 8', () => {
        expect(m.get(1, 3)).toBe(8);
    });
    it('m[2,0] equals to 9', () => {
        expect(m.get(2, 0)).toBe(9);
    });
    it('m[2,1] equals to 10', () => {
        expect(m.get(2, 1)).toBe(10);
    });
    it('m[2,2] equals to 11', () => {
        expect(m.get(2, 2)).toBe(11);
    });
    it('m[2,3] equals to 12', () => {
        expect(m.get(2, 3)).toBe(12);
    });
    it('m[3,0] equals to 13', () => {
        expect(m.get(3, 0)).toBe(13);
    });
    it('m[3,1] equals to 14', () => {
        expect(m.get(3, 1)).toBe(14);
    });
    it('m[3,2] equals to 15', () => {
        expect(m.get(3, 2)).toBe(15);
    });
    it('m[3,3] equals to 16', () => {
        expect(m.get(3, 3)).toBe(16);
    });
});
