import { Point, PixelColor, Vector, createPixelColor, multiplyScalar, hadamardProduct, normalize, subtract, dot, negateVector, add } from "../math/tuple";
import Material from "./material";

export default class Light {
  private _position: Point;
  private _intensity: PixelColor;
  constructor(pos: Point, inten: PixelColor) {
    this._position = pos;
    this._intensity = inten;
  }

  get position(): Point {
    return this._position;
  }

  set position(pos: Point) {
    this._position = pos;
  }

  get intensity(): PixelColor {
    return this._intensity;
  }

  set intensity(inten: PixelColor) {
    this._intensity = inten;
  }
}

export const reflectLight = (inV: Vector, normal: Vector): Vector => subtract(inV, multiplyScalar(normal, 2 * dot(inV, normal)))

export const lighting = (m: Material, l: Light, point: Point, eyev: Vector, normalv: Vector): PixelColor => {
  let ambient: PixelColor = createPixelColor(0, 0, 0);
  let diffuse: PixelColor = createPixelColor(0, 0, 0);
  let specular: PixelColor = createPixelColor(0, 0, 0);
  // combine the surface color with the light's color/intensity
  let effectiveColor: PixelColor = hadamardProduct(m.color, l.intensity);

  // find the direction to the light surface
  let lightv: Vector = normalize(subtract(l.position, point));

  // compute the ambient contribution
  ambient = multiplyScalar(effectiveColor, m.ambient);

  // lightDotNormal represents the cosine of the angle between the
  // light vector and the normal vector. A negative number means the
  // light is on the other side of the surface
  let lightDotNormal: number = dot(lightv, normalv);
  if (lightDotNormal >= 0) {
    // compute the diffuse contribution
    diffuse = multiplyScalar(effectiveColor, m.diffuse * lightDotNormal);

    // reflectDotEye represents the cosine of the angle between the
    // reflection vector and the eye vector. A negative number means the
    // light reflects away from the eye.
    let reflectv: Vector = reflectLight(negateVector(lightv), normalv);
    let reflectDotEye: number = dot(reflectv, eyev);

    if (reflectDotEye > 0) {
      // compute the specular contribution
      let factor: number = Math.pow(reflectDotEye, m.shininess);
      specular = multiplyScalar(l.intensity, m.specular * factor);
    }
  }

  return add(ambient, diffuse, specular);
}
