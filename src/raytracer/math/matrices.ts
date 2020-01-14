import { Tuple } from './tuple';
import * as Transformations from '../features/transformations';

export default class Matrix {
    private matrix:number[][] = [];
    private columns: number;
    private rows: number;

    public getNumCols = ():number => this.columns;

    public getNumRows = ():number => this.rows;

    constructor(rows: number, columns: number) {
        this.matrix = [];
        this.columns = columns;
        this.rows = rows;
        for(let i = 0; i < rows; i++) {
            let temp: number[] = [];
            for(let j = 0; j < columns; j++) {
                temp.push(0);
            }
            this.matrix.push(temp);
        }
    }

    public setMatrix = (m: number[][]) => {
        this.rows = m.length;
        this.columns = m[0].length;
        this.matrix = m;
    }

    public getMatrixValues = () => this.matrix;

    public print = () => {
        for (let i = 0; i < this.rows; i++) {
            let row = '|';
            for (let j = 0; j < this.columns; j++) {
                row += ` ${this.matrix[i][j]} |`;
            }
            console.log(row);
        }
    }

    public get = (i: number, j: number):number => this.matrix[i][j];

    public getRow = (i: number):number[] => this.matrix[i];

    public getColumn = (col: number):number[] => {
        let column:number[] = [];
        for (let i = 0; i < this.rows; i++) {
            column.push(this.matrix[i][col]);
        }
        return column;
    }

    public set = (i: number, j: number, value: number) => {
        if (i >= 0 && i < this.rows && j >= 0 && j < this.columns) {
            this.matrix[i][j] = value;
        }
    }

    public transpose = ():Matrix | undefined => {
        if (this.columns !== this.rows) {
            return undefined;
        }
        let t = new Matrix(this.rows, this.columns);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                t.set(j, i, this.matrix[i][j]);
            }
        }
        return t;
    }

    public translation = (x: number, y: number, z: number):Matrix => {
        let transfMat = Transformations.translation(x, y, z);
        let m = multiply(transfMat, this);
        // this.setMatrix(m.getMatrixValues()); todo: ?
        return m;
    }

    public scaling = (x: number, y: number, z: number):Matrix => {
        let transfMat = Transformations.scaling(x, y, z);
        let m = multiply(transfMat, this);
        // this.setMatrix(m.getMatrixValues()); todo: ?
        return m;
    }

    public rotateAroundX = (radians: number):Matrix => {
        let transfMat = Transformations.rotateAroundX(radians);
        let m = multiply(transfMat, this);
        // this.setMatrix(m.getMatrixValues()); todo: ?
        return m;
    }

    public rotateAroundY = (radians: number):Matrix => {
        let transfMat = Transformations.rotateAroundY(radians);
        let m = multiply(transfMat, this);
        // this.setMatrix(m.getMatrixValues()); todo: ?
        return m;
    }

    public rotateAroundZ = (radians: number):Matrix => {
        let transfMat = Transformations.rotateAroundZ(radians);
        let m = multiply(transfMat, this);
        // this.setMatrix(m.getMatrixValues()); todo: ?
        return m;
    }

    public shearing = (xy: number, xz: number, yx: number, yz: number, zx: number, zy: number):Matrix => {
        let transfMat = Transformations.shearing(xy, xz, yx, yz, zx, zy);
        let m = multiply(transfMat, this);
        // this.setMatrix(m.getMatrixValues()); todo: ?
        return m;
    }

}

const dot = (a: number[], b: number[]):number | undefined => {
    if (a.length !== b.length) {
        return undefined;
    }
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result += a[i] * b[i];
    }
    return result;
}

export const equal = (a: Matrix, b: Matrix):boolean => {
    if (a.getNumCols() !== b.getNumCols() || a.getNumRows() !== b.getNumRows()) {
        return false;
    }
    for(let i = 0; i < a.getNumCols(); i++) {
        for(let j = 0; j < a.getNumRows(); j++) {
            if (a.get(i, j) !== b.get(i, j)) {
                return false;
            }
        }
    }
    return true;
}

export const multiply = (a: Matrix, b: Matrix):Matrix | undefined => {
    if (a.getNumCols() !== b.getNumRows()) {
        return undefined;
    }

    let m = new Matrix(a.getNumRows(), b.getNumCols());
    for(let i = 0; i < m.getNumRows(); i++) {
        for(let j = 0; j < m.getNumCols(); j++) {
            m.set(i, j, dot(a.getRow(i), b.getColumn(j)));
        }
    }
    return m;
}

export const Identity = (dim: number = 4):Matrix => {
    let id = new Matrix(dim, dim);
    for(let i = 0; i < dim; i++) {
        id.set(i, i, 1);
    }
    return id;
}

export const subMatrix = (m: Matrix, x: number, y: number):Matrix => {
    let s = new Matrix(m.getNumRows() - 1, m.getNumCols() - 1);
    for(let i = 0; i < m.getNumRows(); i++) {
        if (i === x) continue;
        for(let j = 0; j < m.getNumCols(); j++) {
            if (j === y) continue;
            let row = i < x ? i : i - 1;
            let col = j < y ? j : j - 1;
            s.set(row, col, m.get(i, j));
        }
    }
    return s;
}

export const cofactor = (m: Matrix, i: number, j: number) => ((i + j) % 2 === 0 ? 1 : -1) * determinant(subMatrix(m, i, j));

export const determinant = (m: Matrix):number | undefined => {
    if (m.getNumCols() !== m.getNumRows()) {
        return undefined;
    }
    let size = m.getNumCols();
    let det = 0;
    if (size === 2) {
        det = m.get(0, 0) * m.get(1, 1) - m.get(0, 1) * m.get(1, 0);
    } else {
        for (let j = 0; j < size; j++) {
            det += m.get(0, j) * cofactor(m, 0, j);
        }
    }
    return det;
}

export const inverse = (m: Matrix):Matrix | undefined => {
    if (m.getNumCols() !== m.getNumRows()) {
        return undefined;
    }
    try {
        // matrix of cofactors
        let c = new Matrix(m.getNumRows(), m.getNumCols());
        // inverted matrix
        let m2 = new Matrix(m.getNumRows(), m.getNumCols());
        let d = determinant(m);
        for (let i = 0; i < m.getNumRows(); i++) {
            for (let j = 0; j < m.getNumCols(); j++) {
                c.set(i, j, cofactor(m, i, j));
                m2.set(j, i, c.get(i, j) / d);
            }
        }
        return m2;
    } catch(e) {
        return undefined;
    }
}

export const tupleToMatrix = (t: Tuple):Matrix => {
    let m = new Matrix(0, 0);
    m.setMatrix(
        [
            [ t.x ],
            [ t.y ],
            [ t.z ],
            [ t.w ]
        ]
    );
    return m;
}
