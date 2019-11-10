import { Tuple } from '../math/tuple';

export default class Matrix {
    private matrix:number[][] = [];
    private columns: number;
    private rows: number;

    public getNumCols = ():number => this.columns;

    public getNumRows = ():number => this.rows;

    constructor(columns: number, rows: number) {
        this.matrix = [];
        this.columns = columns;
        this.rows = rows;
        for(let i = 0; i < columns; i++) {
            let temp: number[] = [];
            for(let j = 0; j < rows; j++) {
                temp.push(0);
            }
            this.matrix.push(temp);
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
}

const dot = (a: number[], b: number[]):number | undefined {
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
    for(let i = 0; i < m.getNumCols(); i++) {
        for(let j = 0; j < m.getNumRows(); j++) {
            m.set(i, j, dot(a.getRow(i), b.getColumn(j)));
        }
    }
    return m;
}

export const Identity = (dim: number):Matrix => {
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



