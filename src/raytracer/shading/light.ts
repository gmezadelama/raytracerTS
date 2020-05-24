import { Point, PixelColor, Vector, createPixelColor, multiplyScalar, hadamardProduct, normalize, subtract, dot, negateVector, add, vectorMagnitude } from "../math/tuple";
import Material from "./material";
import Shape from "../geometry/shape";

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

export const lighting = (m: Material, obj: Shape, l: Light, point: Point, eyev: Vector, normalv: Vector, inShadow: boolean = false): PixelColor => {
  let ambient: PixelColor = createPixelColor(0, 0, 0);
  let diffuse: PixelColor = createPixelColor(0, 0, 0);
  let specular: PixelColor = createPixelColor(0, 0, 0);

  let color: PixelColor;
  // if material has a pattern, use pattern color at point, otherwise use material's color
  if (!!m.pattern) {
    if (!!obj) {
      color = m.pattern.setPatternAtShape(obj, point);
    } else {
      color = m.pattern.setPatternAtPoint(point);
    }
  } else {
    color = m.color;
  }

  // combine the surface color with the light's color/intensity
  let effectiveColor: PixelColor = hadamardProduct(color, l.intensity);

  let vectorLightPoint: Vector = subtract(l.position, point);

  // if the point is the same that the light position return black color
  if (vectorMagnitude(vectorLightPoint) === 0) return createPixelColor(0, 0, 0);
  // find the direction to the light surface
  let lightv: Vector = normalize(vectorLightPoint);

  // compute the ambient contribution
  ambient = multiplyScalar(effectiveColor, m.ambient);

  // when a point is in shadow, the diffuse and specular components are ignored
  if (inShadow) return ambient;

  // when the point is not in shadow:

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
