import Matrix from "../math/matrices";

export default class Camera {
  private _hSize: number;
  private _vSize: number;
  private _fieldOfView: number;
  private _transform: Matrix;
  constructor(hs: number, vs: number, fov: number) {
    this._hSize = hs;
    this._vSize = vs;
    this._fieldOfView = fov;
    this._transform = Matrix.Identity();
  }
  
  get fieldOfView(): number {
    return this._fieldOfView;
  }

  set fieldOfView(fov: number) {
    this._fieldOfView = fov;
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
}