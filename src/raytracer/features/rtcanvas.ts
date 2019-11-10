import { Tuple, color } from '../math/tuple';

export default class RTCanvas {
    private height: number;
    private width: number;
    private matrix: Tuple[][] = [];
    public constructor(width: number, height: number) {
        this.height = height;
        this.width = width;
        for(let i = 0; i < width; i++) {
            let temp: Tuple[] = [];
            for(let j = 0; j < height; j++) {
                temp.push(color(0, 0, 0));
            }
            this.matrix.push(temp);
        }
    }

    public getHeight = ():number => this.height;

    public getWidth = ():number => this.width;

    public writePixel = (x: number, y: number, color: Tuple):void => {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.matrix[x][y] = color;
        }
    }

    private getPixelValues = ():string => {
        let pixelValues = '';
        for(let j = 0; j < this.height; j++) {
            let line = '';
            for(let i = 0; i < this.width; i++) {
                line += `${Math.round(this.matrix[i][j].x * 255)} ${Math.round(this.matrix[i][j].y * 255)} ${Math.round(this.matrix[i][j].z * 255)}`;
                if (j < this.width - 1) {
                    line += ' ';
                }
            }
            pixelValues += line + '\n';
        }
        return pixelValues;
    }

    public convertToPPM = (): string => {
        let pv = this.getPixelValues();
        return `P3
        ${this.width} ${this.height}
        255
        ${pv}`;
    }
}
