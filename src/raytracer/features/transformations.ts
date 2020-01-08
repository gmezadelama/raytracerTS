import Matrix, { tupleToMatrix, multiply as multiplyMatrices, inverse } from './matrices';
import { Tuple, createPoint, matrixToTuple } from '../math/tuple';

export const translation = (x: number, y: number, z: number):Matrix => {
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

export const scaling = (x: number, y: number, z: number):Matrix => {
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

export const rotateAroundX = (radians: number):Matrix => {
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

export const rotateAroundY = (radians: number):Matrix => {
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

export const rotateAroundZ = (radians: number):Matrix => {
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

export const shearing = (xy: number, xz: number, yx: number, yz: number, zx: number, zy: number):Matrix => {
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

export const multiplyTransformationMatrixPoint = (m: Matrix, point: Tuple):Tuple | undefined => {
    let pm = tupleToMatrix(point);
    let prod = multiplyMatrices(m, pm);
    if (!prod) return undefined;
    return matrixToTuple(prod);
}

export const multiplyInvTransformationMatrixPoint = (m: Matrix, point: Tuple):Tuple | undefined => {
    return multiplyTransformationMatrixPoint(inverse(m), point);
}

export const multiplyTranslationPoint =
    (m: Matrix, point: Tuple):Tuple | undefined => multiplyTransformationMatrixPoint(m, point);

export const multiplyScalingPoint =
    (m: Matrix, point: Tuple):Tuple | undefined => multiplyTransformationMatrixPoint(m, point);

export const multiplyRotationPoint =
    (m: Matrix, point: Tuple):Tuple | undefined => multiplyTransformationMatrixPoint(m, point);

export const multiplyShearingPoint =
    (m: Matrix, point: Tuple):Tuple | undefined => multiplyTransformationMatrixPoint(m, point);

export const applyChainedTransformations = (matrices: Matrix[], point: Tuple):Tuple | undefined => {
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