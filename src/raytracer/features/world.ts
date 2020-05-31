import Shape from '../geometry/shape';
import Light from '../shading/light';
import Ray from './ray';
import Intersection, { IntersectionComputations } from './intersection';
import { PixelColor, createPixelColor, Point, vectorMagnitude, subtract, normalize, multiplyScalar, add, BlackColor, WhiteColor, dot } from '../math/tuple';
import { lighting } from '../shading/light';

export default class World {
  private _sceneObjects: Shape[];
  private _lightSource: Light;
  constructor() {
    this._sceneObjects = [];
    this._lightSource = null;
  }

  get sceneObjects(): Shape[] {
    return this._sceneObjects;
  }

  set sceneObjects(so: Shape[]) {
    this._sceneObjects = so;
  }

  get lightSource(): Light {
    return this._lightSource;
  }

  set lightSource(ls: Light) {
    this._lightSource = ls;
  }

  public addObject(o: Shape) {
    this._sceneObjects.push(o);
  }

  public worldIntersection(r: Ray): Intersection[] {
    let is: Intersection[] = [];
    for(const o of this._sceneObjects) {
      is.push(...o.intersect(r));
    }
    is.sort((ia: Intersection, ib: Intersection) => ia.t - ib.t);
    return is;
  }

  public shadeHit = (comps: IntersectionComputations, remaining: number = 4): PixelColor => {
    let shadowed: boolean = this.isShadowed(comps.overPoint);
    let surfaceColor: PixelColor = lighting(comps.object.material, comps.object, this._lightSource, comps.point, comps.eyev, comps.normalv, shadowed);
    let reflectedColor: PixelColor = this.reflectedColor(comps, remaining);
    let refractedColor: PixelColor = this.refractedColor(comps, remaining);
    let objectMaterial = comps.object.material;
    if (objectMaterial.transparency > 0 && objectMaterial.reflective > 0) {
      let reflectance: number = Intersection.schlick(comps);
      return add(surfaceColor, multiplyScalar(reflectedColor, reflectance), multiplyScalar(refractedColor, 1 - reflectance));
    } else {
      return add(surfaceColor, reflectedColor, refractedColor);
    }
  }

  public colorAt(r: Ray, remaining: number = 4): PixelColor {
    // get intersections in the world
    let is: Intersection[] = this.worldIntersection(r);
    // calculate the hit
    let hit: Intersection = Intersection.hit(is);
    // if there is no hit return black color
    if (!hit) return createPixelColor(0, 0, 0);
    // calculate color for that hit
    let comps = Intersection.prepareComputations(hit, r, is);
    return this.shadeHit(comps, remaining);
  }

  public isShadowed = (p: Point): boolean => {
    let vLightToPoint = subtract(this.lightSource.position, p);
    let distance = vectorMagnitude(vLightToPoint);
    let ray = new Ray(p, normalize(vLightToPoint));
    // get intersections in the world
    let is: Intersection[] = this.worldIntersection(ray);
    // calculate the hit
    let hit: Intersection = Intersection.hit(is);
    // if there is a hit and the hit is between
    // the light source and the point (t < distance)
    // it means that the point is in shadow
    if (hit && hit.t < distance) {
      return true;
    } else {
      return false;
    }
  }

  public reflectedColor = (comps: IntersectionComputations, remaining: number = 4): PixelColor => {
    if (remaining <= 0 || comps.object.material.reflective === 0) {
      return createPixelColor(0, 0, 0);
    } else {
      let reflectRay: Ray = new Ray(comps.overPoint, comps.reflectv);
      let color: PixelColor = this.colorAt(reflectRay, remaining - 1);
      return multiplyScalar(color, comps.object.material.reflective);
    }
  }

  public refractedColor = (comps: IntersectionComputations, remaining: number = 4): PixelColor => {
    // finding total internal reflection using Snell's Law:
    // ( sin(theta_i) / sin(theta_t) ) = ( comps.n2 / comps.n1 )
    // where theta_i = angle of the incoming ray
    // and theta_t = angle of the refracted ray

    // First, find the ratio of the first index of refraction to the second
    // inverted relation taken from the definition of Snell's Law
    let nRatio: number = comps.n1 / comps.n2;

    // cost(theta_i) is the same as the dot product of two vectors
    let cosI: number = dot(comps.eyev, comps.normalv);

    // Find sin(theta_t)^2 via trigonometric identity
    let sin2T: number = Math.pow(nRatio, 2) * (1 - Math.pow(cosI, 2));
    let isTotalInternalRefl = sin2T > 1;

    if (isTotalInternalRefl || comps.object.material.transparency === 0 || remaining === 0) {
      return BlackColor;
    }

    let cosT = Math.sqrt(1 - sin2T);

    // direction of the refracted ray
    let direction = subtract(
      multiplyScalar(comps.normalv, nRatio * cosI - cosT),
      multiplyScalar(comps.eyev, nRatio)
    );

    // create the refracted ray
    let refractRay: Ray = new Ray(comps.underPoint, direction);

    // find the color of the refracted ray, multiplying by the transparency value
    // to account for any opacity
    return multiplyScalar(this.colorAt(refractRay, remaining - 1), comps.object.material.transparency);
  }
}
