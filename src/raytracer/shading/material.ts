import { PixelColor, createPixelColor } from "../math/tuple";
import { Pattern } from "../features/pattern";

export default class Material {
  private _color: PixelColor;
  private _ambient: number;
  private _diffuse: number;
  private _specular: number;
  private _shininess: number;
  private _pattern: Pattern;
  private _reflective: number;
  private _transparency: number;
  private _refractiveIndex: number;
  constructor() {
    this._color = createPixelColor(1, 1, 1);
    this._ambient = 0.1;
    this._diffuse = 0.9;
    this._specular = 0.9;
    this._shininess = 200.0;
    this._pattern = null;
    this._reflective = 0;
    this._transparency = 0;
    this._refractiveIndex = 1;
  }

  get color(): PixelColor {
    return this._color;
  }

  set color(col: PixelColor) {
    this._color = col;
  }

  get ambient(): number {
    return this._ambient;
  }

  set ambient(a: number) {
    if (a < 0) return;
    this._ambient = a;
  }

  get diffuse(): number {
    return this._diffuse;
  }

  set diffuse(d: number) {
    if (d < 0) return;
    this._diffuse = d;
  }

  get specular(): number {
    return this._specular;
  }

  set specular(s: number) {
    if (s < 0) return;
    this._specular = s;
  }

  get shininess(): number {
    return this._shininess;
  }

  set shininess(s: number) {
    if (s < 0) return;
    this._shininess = s;
  }

  get pattern(): Pattern {
    return this._pattern;
  }

  set pattern(p: Pattern) {
    this._pattern = p;
  }

  get reflective(): number {
    return this._reflective;
  }

  set reflective(r: number) {
    this._reflective = r;
  }

  get transparency(): number {
    return this._transparency;
  }

  set transparency(t: number) {
    this._transparency = t;
  }

  get refractiveIndex(): number {
    return this._refractiveIndex;
  }

  set refractiveIndex(ri: number) {
    this._refractiveIndex = ri;
  }
}

export const glassMaterial = (): Material => {
  let m: Material = new Material();
  m.transparency = 1;
  m.refractiveIndex = 1.5;
  return m;
}
