import Shape from '../geometry/shape';
import Light from '../shading/light';
import Ray from './ray';
import Intersection, { IntersectionComputations } from './intersection';
import { PixelColor, createPixelColor, Point, vectorMagnitude, subtract, normalize } from '../math/tuple';
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

  public shadeHit = (comps: IntersectionComputations): PixelColor => {
    let shadowed: boolean = this.isShadowed(comps.overPoint);
    return lighting(comps.object.material, this._lightSource, comps.point, comps.eyev, comps.normalv, shadowed);
  }

  public colorAt(r: Ray): PixelColor {
    // get intersections in the world
    let is: Intersection[] = this.worldIntersection(r);
    // calculate the hit
    let hit: Intersection = Intersection.hit(is);
    // if there is no hit return black color
    if (!hit) return createPixelColor(0, 0, 0);
    // calculate color for that hit
    let comps = Intersection.prepareComputations(hit, r);
    return this.shadeHit(comps);
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
}