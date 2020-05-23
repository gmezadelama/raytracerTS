import { createPixelColor, PixelColor, Point, matrixToTuple } from "../math/tuple";
import Matrix from "../math/matrices";
import Shape from "../geometry/shape";

export const BlackPattern = createPixelColor(0, 0, 0);
export const WhitePattern = createPixelColor(1, 1, 1);

export abstract class Pattern {
  private _transform:Matrix;

  constructor() {
    this._transform = Matrix.Identity();
  }

  public get transform():Matrix {
    return this._transform;
  }

  public set transform(t:Matrix) {
    this._transform = t;
  }

  public abstract setPatternAtPoint(p: Point): PixelColor;

  public abstract setPatternAtShape(s: Shape, p: Point): PixelColor;
}

export class StripePattern extends Pattern {
  private _a:PixelColor;
  private _b:PixelColor;

  constructor(...colors:PixelColor[]) {
    super();
    this._a = colors[0];
    this._b = colors[1];
  }

  public get a() {
    return this._a;
  }

  public get b() {
    return this._b;
  }

  public setPatternAtPoint = (p: Point): PixelColor => {    
    return Math.floor(p.x) % 2 === 0 ? this._a : this._b;
  }

  public setPatternAtShape = (s: Shape, p: Point): PixelColor => {    
    let objectPoint: Point = s.localPoint(p);
    let patternPoint: Point = matrixToTuple(Matrix.multiply(Matrix.inverse(this.transform), Matrix.tupleToMatrix(objectPoint)));
    return this.setPatternAtPoint(patternPoint);
  }
}


