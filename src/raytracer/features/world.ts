import Shape from '../geometry/shape';
import Light from '../shading/light';
import Ray from './ray';
import Intersection, { IntersectionComputations } from './intersection';
import { PixelColor, createPixelColor, Point, vectorMagnitude, subtract, normalize, multiplyScalar, add, BlackColor, WhiteColor } from '../math/tuple';
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
    return add(surfaceColor, reflectedColor);
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
    if (comps.object.material.transparency === 0 || remaining === 0) {
      return BlackColor;
    }
    return WhiteColor;
  }
}