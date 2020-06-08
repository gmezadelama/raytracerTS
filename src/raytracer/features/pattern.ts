import { PixelColor, Point, matrixToTuple, subtract, add, multiplyScalar,
         BlackColor, WhiteColor, RedColor, GreenColor, BlueColor, createPixelColor } from "../math/tuple";
import Matrix from "../math/matrices";
import Shape from "../geometry/shape";

export const BlackPattern = BlackColor;
export const WhitePattern = WhiteColor;
export const RedPattern = RedColor;
export const GreenPattern = GreenColor
export const BluePattern = BlueColor;

export abstract class Pattern {
  private _transform:Matrix;

  constructor() {
    this._transform = Matrix.Identity();
  }

  get transform():Matrix {
    return this._transform;
  }

  set transform(t:Matrix) {
    this._transform = t;
  }

  public abstract setPatternAtPoint(patternPoint: Point): PixelColor;

  public setPatternAtShape = (s: Shape, p: Point): PixelColor => {
    let objectPoint: Point = s.localPoint(p);
    let patternPoint: Point = matrixToTuple(Matrix.multiply(Matrix.inverse(this.transform), Matrix.tupleToMatrix(objectPoint)));
    return this.setPatternAtPoint(patternPoint);
  }
}

export class TestPattern extends Pattern {
  constructor() {
    super();
  }
  public setPatternAtPoint = (patternPoint: Point): PixelColor => {
    return createPixelColor(patternPoint.x, patternPoint.y, patternPoint.z);
  }
}

export class StripePattern extends Pattern {
  private _a:PixelColor;
  private _b:PixelColor;

  constructor(...colors:PixelColor[]) {
    super();
    this._a = colors[0];
    this._b = colors[1];
  }

  get a() {
    return this._a;
  }

  get b() {
    return this._b;
  }

  public setPatternAtPoint = (patternPoint: Point): PixelColor => {
    return Math.floor(patternPoint.x) % 2 === 0 ? this._a : this._b;
  }
}

export class GradientPattern extends Pattern {
  private _a:PixelColor;
  private _b:PixelColor;

  constructor(...colors:PixelColor[]) {
    super();
    this._a = colors[0];
    this._b = colors[1];
  }

  get a() {
    return this._a;
  }

  get b() {
    return this._b;
  }

  public setPatternAtPoint = (patternPoint: Point): PixelColor => {
    let colorDistance: PixelColor = subtract(this._b, this._a);
    let fraction: number = patternPoint.x - Math.floor(patternPoint.x);
    return add(this._a, multiplyScalar(colorDistance, fraction));
  }
}

export class RingPattern extends Pattern {
  private _a:PixelColor;
  private _b:PixelColor;

  constructor(...colors:PixelColor[]) {
    super();
    this._a = colors[0];
    this._b = colors[1];
  }

  get a() {
    return this._a;
  }

  get b() {
    return this._b;
  }

  public setPatternAtPoint = (patternPoint: Point): PixelColor => {
    if (Math.floor(Math.sqrt(patternPoint.x * patternPoint.x + patternPoint.z * patternPoint.z)) % 2 === 0) {
      return this._a;
    } else {
      return this._b;
    }
  }
}

export class CheckersPattern extends Pattern {
  private _a:PixelColor;
  private _b:PixelColor;

  constructor(...colors:PixelColor[]) {
    super();
    this._a = colors[0];
    this._b = colors[1];
  }

  get a() {
    return this._a;
  }

  get b() {
    return this._b;
  }

  public setPatternAtPoint = (patternPoint: Point): PixelColor => {
    if ((Math.floor(patternPoint.x) + Math.floor(patternPoint.y) + Math.floor(patternPoint.z)) % 2 === 0) {
      return this._a;
    } else {
      return this._b;
    }
  }
}
