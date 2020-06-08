import Matrix from "../math/matrices";
import Ray from "./ray";
import { createPoint, createVector, Point, matrixToTuple, normalize, subtract, Vector, PixelColor } from "../math/tuple";
import Transformations from "./transformations";
import RTCanvas from "../../ppm/rtcanvas";
import World from "./world";

export default class Camera {
  private _hSize: number;
  private _vSize: number;
  private _fieldOfView: number;
  private _transform: Matrix;
  private _pixelSize: number;
  private _halfHeight: number;
  private _halfWidth: number;
  constructor(hs: number, vs: number, fov: number) {
    this._hSize = hs;
    this._vSize = vs;
    this._fieldOfView = fov;
    this._transform = Matrix.Identity();
    this.calculatePixelSize();
  }

  private calculatePixelSize = () => {
    let halfView = Math.tan(this._fieldOfView / 2);
    let aspectRatio = this._hSize / this._vSize;
    let halfWidth = 0;
    let halfHeight = 0;
    if (aspectRatio >= 1) {
      halfWidth = halfView;
      halfHeight = halfView / aspectRatio;
    } else {
      halfWidth = halfView * aspectRatio;
      halfHeight = halfView;
    }
    this._halfHeight = halfHeight;
    this._halfWidth = halfWidth;
    // assuming that pixels are square, so there is no need to
    // compute the vertical size
    this._pixelSize = (halfWidth * 2) / this._hSize;
  }

  public rayForPixel = (px: number, py: number): Ray => {

    // the offset from the edge of the canvas to the pixel's center
    let xOffset: number = (px + 0.5) * this._pixelSize;
    let yOffset: number = (py + 0.5) * this._pixelSize;

    // the untransformed coordinates of the pixel in world space
    // (remember that the camera looks toward -z, so +x is to the 'left')
    let worldX: number = this._halfWidth - xOffset;
    let worldY: number = this._halfHeight - yOffset;

    // using the camera matrix, transform the canvas point and the origin
    // and then compute the ray's direction vector
    // (remember that the canvas is at z=-1)
    let pixel: Point = matrixToTuple(Matrix.multiply(Matrix.inverse(this._transform), Matrix.tupleToMatrix(createPoint(worldX, worldY, -1))));
    let origin: Point = matrixToTuple(Matrix.multiply(Matrix.inverse(this._transform), Matrix.tupleToMatrix(createPoint(0, 0, 0))));
    let direction: Vector = normalize(subtract(pixel, origin)) as Vector;

    return new Ray(origin, direction);
  }

  public render = (w: World, withMessages: boolean = false): RTCanvas => {
    const print = (msg: string, value: any = '') => {
      if (withMessages) {
        console.log(msg, value);
      }
    };
    let image: RTCanvas = new RTCanvas(this._hSize, this._vSize);
    let totalPixels: number = this._vSize * this._hSize;
    let pctInc: number = 0.05;
    let nextPrint: number = 0.05;
    let pixelCount: number = 0;
    print('Starting rendering calculation...');
    for (let y = 0; y < this._vSize - 1; y++) {
      for (let x = 0; x < this._hSize - 1; x++) {
        let ray: Ray = this.rayForPixel(x, y);
        let color: PixelColor = w.colorAt(ray);
        image.writePixel(x, y, color);
        pixelCount++;
        if ((pixelCount / totalPixels) > nextPrint) {
          print(`${Math.round((nextPrint) * 100)}% completed...`);
          nextPrint += pctInc;
        }
      }
    }
    print('Rendering calculation completed!');
    return image;
  }
  
  get fieldOfView(): number {
    return this._fieldOfView;
  }

  set fieldOfView(fov: number) {
    this._fieldOfView = fov;
    this.calculatePixelSize();
  }

  get hSize(): number {
    return this._hSize;
  }

  get vSize(): number {
    return this._vSize;
  }

  get transform(): Matrix {
    return this._transform;
  }

  set transform(t: Matrix) {
    this._transform = t;
    this.calculatePixelSize();
  }

  get pixelSize(): number {
    return this._pixelSize;
  }
}