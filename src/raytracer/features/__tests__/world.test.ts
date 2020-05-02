import World from '../world';
import Light from '../../shading/light';
import { createPoint, createPixelColor, createVector, PixelColor } from '../../math/tuple';
import Sphere from '../../geometry/sphere';
import Shape from '../../geometry/shape';
import Material from '../../shading/material';
import Transformations from '../transformations';
import Ray from '../ray';
import { equal } from '../../math/operations';
import Intersection, { IntersectionComputations } from '../intersection';

describe('The default world', () => {
  let defaultWorld: World;
  beforeEach(() => {
    defaultWorld = new World();
    defaultWorld.lightSource = new Light(createPoint(-10, 10, -10), createPixelColor(1, 1, 1));
    let s1: Sphere = new Sphere();
    s1.material = new Material();
    s1.material.color = createPixelColor(0.8, 1.0, 0.6);
    s1.material.diffuse = 0.7;
    s1.material.specular = 0.2;
    let s2: Sphere = new Sphere();
    s2.transform = Transformations.scaling(0.5, 0.5, 0.5);
    defaultWorld.sceneObjects = [s1, s2];
  });
  test('intersect a world with a ray', () => {
    let r: Ray = new Ray(createPoint(0, 0, -5), createVector(0, 0, 1));
    let xs = defaultWorld.worldIntersection(r);
    expect(xs.length).toBe(4);
    expect(equal(xs[0].t, 4)).toBeTruthy();
    expect(equal(xs[1].t, 4.5)).toBeTruthy();
    expect(equal(xs[2].t, 5.5)).toBeTruthy();
    expect(equal(xs[3].t, 6)).toBeTruthy();
  });
  test('Shading an intersection', () => {
    let r: Ray = new Ray(createPoint(0, 0, -5), createVector(0, 0, 1));
    let shape: Shape = defaultWorld.sceneObjects[0];
    let i: Intersection = new Intersection(4, shape);
    let comps: IntersectionComputations = Intersection.prepareComputations(i, r);
    let c: PixelColor;
    c = defaultWorld.shadeHit(comps);
    expect(equal(c.x, 0.38066)).toBeTruthy();
    expect(equal(c.y, 0.47583)).toBeTruthy();
    expect(equal(c.z, 0.2855)).toBeTruthy();
    expect(equal(c.w, 0)).toBeTruthy();
  });
  test('Shading an intersection from the inside', () => {
    defaultWorld.lightSource = new Light(createPoint(0, 0.25, 0), createPixelColor(1, 1, 1));
    let r: Ray = new Ray(createPoint(0, 0, 0), createVector(0, 0, 1));
    let shape: Shape = defaultWorld.sceneObjects[1];
    let i: Intersection = new Intersection(0.5, shape);
    let comps: IntersectionComputations = Intersection.prepareComputations(i, r);
    let c: PixelColor;
    c = defaultWorld.shadeHit(comps);
    expect(equal(c.x, 0.90498)).toBeTruthy();
    expect(equal(c.y, 0.90498)).toBeTruthy();
    expect(equal(c.z, 0.90498)).toBeTruthy();
    expect(equal(c.w, 0)).toBeTruthy();
  });
  test('The color when a ray misses', () => {
    let r: Ray = new Ray(createPoint(0, 0, -5), createVector(0, 1, 0));
    let c = defaultWorld.colorAt(r);
    expect(equal(c.x, 0)).toBeTruthy();
    expect(equal(c.y, 0)).toBeTruthy();
    expect(equal(c.z, 0)).toBeTruthy();
    expect(equal(c.w, 0)).toBeTruthy();
  });
  test('The color when a ray hits', () => {
    let r: Ray = new Ray(createPoint(0, 0, -5), createVector(0, 0, 1));
    let c: PixelColor = defaultWorld.colorAt(r);
    expect(equal(c.x, 0.38066)).toBeTruthy();
    expect(equal(c.y, 0.47583)).toBeTruthy();
    expect(equal(c.z, 0.2855)).toBeTruthy();
    expect(equal(c.w, 0)).toBeTruthy();
  });
  test('The color with an intersection behind the ray', () => {
    let outer: Shape = defaultWorld.sceneObjects[0];
    outer.material.ambient = 1;
    let inner: Shape = defaultWorld.sceneObjects[1];
    inner.material.ambient = 1;
    let r: Ray = new Ray(createPoint(0, 0, 0.75), createVector(0, 0, -1));
    let c = defaultWorld.colorAt(r);
    expect(equal(c.x, inner.material.color.x)).toBeTruthy();
    expect(equal(c.y, inner.material.color.y)).toBeTruthy();
    expect(equal(c.z, inner.material.color.z)).toBeTruthy();
    expect(equal(c.w, 0)).toBeTruthy();
  });
});