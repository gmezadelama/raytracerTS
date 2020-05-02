import Shape from '../geometry/shape';
import Light from '../shading/light';
import Ray from './ray';
import Intersection, { IntersectionComputations } from './intersection';
import { PixelColor, createPixelColor } from '../math/tuple';
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
    return lighting(comps.object.material, this._lightSource, comps.point, comps.eyev, comps.normalv);
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
}