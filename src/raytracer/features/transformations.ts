import Matrix from '../math/matrices';
import { Tuple, createPoint, matrixToTuple } from '../math/tuple';

const translation = (x: number, y: number, z: number):Matrix => {
    let m = new Matrix(4, 4);
    m.setMatrix(
        [
            [1, 0, 0, x],
            [0, 1, 0, y],
            [0, 0, 1, z],
            [0, 0, 0, 1]
        ]
    );
    return m;
}

const scaling = (x: number, y: number, z: number):Matrix => {
    let m = new Matrix(4, 4);
    m.setMatrix(
        [
            [x, 0, 0, 0],
            [0, y, 0, 0],
            [0, 0, z, 0],
            [0, 0, 0, 1]
        ]
    );
    return m;
}

const rotateAroundX = (radians: number):Matrix => {
    let m = new Matrix(4, 4);
    m.setMatrix(
        [
            [1, 0, 0, 0],
            [0, Math.cos(radians), -Math.sin(radians), 0],
            [0, Math.sin(radians), Math.cos(radians), 0],
            [0, 0, 0, 1]
        ]
    );
    return m;
}

const rotateAroundY = (radians: number):Matrix => {
    let m = new Matrix(4, 4);
    m.setMatrix(
        [
            [Math.cos(radians), 0, Math.sin(radians), 0],
            [0, 1, 0, 0],
            [-Math.sin(radians), 0, Math.cos(radians), 0],
            [0, 0, 0, 1]
        ]
    );
    return m;
}

const rotateAroundZ = (radians: number):Matrix => {
    let m = new Matrix(4, 4);
    m.setMatrix(
        [
            [Math.cos(radians), -Math.sin(radians), 0, 0],
            [Math.sin(radians), Math.cos(radians), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]
    );
    return m;
}

const shearing = (xy: number, xz: number, yx: number, yz: number, zx: number, zy: number):Matrix => {
    let m = new Matrix(4, 4);
    m.setMatrix(
        [
            [1, xy, xz, 0],
            [yx, 1, yz, 0],
            [zx, zy, 1, 0],
            [0, 0, 0, 1]
        ]
    );
    return m;
}

const multiplyTransformationMatrixPoint = (m: Matrix, point: Tuple):Tuple | undefined => {
    let pm = Matrix.tupleToMatrix(point);
    let prod = Matrix.multiply(m, pm);
    if (!prod) return undefined;
    return matrixToTuple(prod);
}

const multiplyInvTransformationMatrixPoint = (m: Matrix, point: Tuple):Tuple | undefined => {
    return multiplyTransformationMatrixPoint(Matrix.inverse(m), point);
}

const multiplyTranslationPoint =
    (m: Matrix, point: Tuple):Tuple | undefined => multiplyTransformationMatrixPoint(m, point);

const multiplyScalingPoint =
    (m: Matrix, point: Tuple):Tuple | undefined => multiplyTransformationMatrixPoint(m, point);

const multiplyRotationPoint =
    (m: Matrix, point: Tuple):Tuple | undefined => multiplyTransformationMatrixPoint(m, point);

const multiplyShearingPoint =
    (m: Matrix, point: Tuple):Tuple | undefined => multiplyTransformationMatrixPoint(m, point);

const applyChainedTransformations = (matrices: Matrix[], point: Tuple):Tuple | undefined => {
    if (!matrices || matrices.length === 0) return undefined;
    return matrices.reverse().reduce((acc: Tuple, m: Matrix) => (
        multiplyTranslationPoint(m, acc)
    ), point);
}

export enum TransformationType {
    Translation = 'translation',
    Scaling = 'scaling',
    Rotation = 'rotation'
}

const Transformations = {
    translation,
    scaling,
    rotateAroundX,
    rotateAroundY,
    rotateAroundZ,
    shearing,
    multiplyTransformationMatrixPoint,
    multiplyInvTransformationMatrixPoint,
    multiplyTranslationPoint,
    multiplyScalingPoint,
    multiplyRotationPoint,
    multiplyShearingPoint,
    applyChainedTransformations
};

export default Transformations;