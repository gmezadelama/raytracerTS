import World from '../world';
import Light from '../../shading/light';
import { createPoint, createPixelColor, createVector } from '../../math/tuple';
import Sphere from '../../geometry/sphere';
import Material from '../../shading/material';
import Transformations from '../transformations';
import Ray from '../ray';
import { equal } from '../../math/operations';

describe('The default world', () => {
  let defaultWorld: World;
  beforeAll(() => {
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
});