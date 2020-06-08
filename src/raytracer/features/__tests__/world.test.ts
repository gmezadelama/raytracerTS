import World from '../world';
import Light from '../../shading/light';
import { createPoint, createPixelColor, createVector, PixelColor, Point, Vector, equalPixelColor, BlackColor, RedColor } from '../../math/tuple';
import Sphere from '../../geometry/sphere';
import Shape from '../../geometry/shape';
import Material, { glassMaterial } from '../../shading/material';
import Transformations from '../transformations';
import Ray from '../ray';
import { equal } from '../../math/operations';
import Intersection, { IntersectionComputations } from '../intersection';
import Camera from '../camera';
import { viewTransform } from '../view';
import RTCanvas from '../../../ppm/rtcanvas';
import Plane from '../../geometry/plane';
import { TestPattern } from '../pattern';

const createDefaultWorld = (): World => {
  let defaultWorld = new World();
  defaultWorld.lightSource = new Light(createPoint(-10, 10, -10), createPixelColor(1, 1, 1));
  let s1: Sphere = new Sphere();
  s1.material = new Material();
  s1.material.color = createPixelColor(0.8, 1.0, 0.6);
  s1.material.diffuse = 0.7;
  s1.material.specular = 0.2;
  let s2: Sphere = new Sphere();
  s2.transform = Transformations.scaling(0.5, 0.5, 0.5);
  defaultWorld.sceneObjects = [s1, s2];
  return defaultWorld;
}

describe('The default world: intersecting with a ray and color on that point', () => {
  let defaultWorld: World;
  beforeEach(() => {
    defaultWorld = createDefaultWorld();
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

describe('Shading on a point in the default world', () => {
  let defaultWorld: World;
  beforeEach(() => {
    defaultWorld = createDefaultWorld();
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
  test('Shading when shadeHit is given an intersection in shadow', () => {
    let anotherWorld = new World();
    anotherWorld.lightSource = new Light(createPoint(0, 0, -10), createPixelColor(1, 1, 1));
    let s1: Shape = new Sphere();
    let s2: Shape = new Sphere();
    s2.transform = Transformations.translation(0, 0, 10);
    anotherWorld.addObject(s1);
    anotherWorld.addObject(s2);
    let r: Ray = new Ray(createPoint(0, 0, 5), createVector(0, 0, 1));
    let i: Intersection = new Intersection(4, s2);
    let comps: IntersectionComputations = Intersection.prepareComputations(i, r);
    let c: PixelColor = anotherWorld.shadeHit(comps);
    expect(equal(c.x, 0.1)).toBeTruthy();
    expect(equal(c.y, 0.1)).toBeTruthy();
    expect(equal(c.z, 0.1)).toBeTruthy();
    expect(equal(c.w, 0)).toBeTruthy();
  });
});

describe('Rendering a world with the camera', () => {
  let defaultWorld: World;
  beforeEach(() => {
    defaultWorld = createDefaultWorld();
  });
  test('Rendering default world', () => {
    let cam: Camera = new Camera(11, 11, Math.PI / 2);
    let from: Point = createPoint(0, 0, -5);
    let to: Point = createPoint(0, 0, 0);
    let up: Vector = createVector(0, 1, 0);
    cam.transform = viewTransform(from, to, up);
    let image: RTCanvas = cam.render(defaultWorld);
    let pixelAt: PixelColor = image.getPixelAt(5, 5);
    expect(equalPixelColor(pixelAt, createPixelColor(0.38066, 0.47583, 0.2855))).toBeTruthy();
  });
});

describe('Testing for shadows', () => {
  let defaultWorld: World;
  beforeEach(() => {
    defaultWorld = createDefaultWorld();
  });
  test('There is no shadow when nothing is collinear with point and light', () => {
    let p: Point = createPoint(0, 10, 0);
    expect(defaultWorld.isShadowed(p)).toBeFalsy();
  });
  test('The shadow when an object is between the point and the light', () => {
    let p: Point = createPoint(10, -10, 10);
    expect(defaultWorld.isShadowed(p)).toBeTruthy();
  });
  test('There is no shadow when an object is behind the light', () => {
    let p: Point = createPoint(-20, 20, -20);
    expect(defaultWorld.isShadowed(p)).toBeFalsy();
  });
  test('There is no shadow when an object is behind the point', () => {
    let p: Point = createPoint(-2, 2, -2);
    expect(defaultWorld.isShadowed(p)).toBeFalsy();
  });
});

describe('Striking reflective and nonreflective surfaces', () => {
  let defaultWorld: World;
  beforeEach(() => {
    defaultWorld = createDefaultWorld();
  });
  test('the reflected color for a nonreflective material', () => {
    let shape: Shape = defaultWorld.sceneObjects[1];
    shape.material.ambient = 1;
    let r: Ray = new Ray(createPoint(0, 0, 0), createVector(0, 0, 1));
    let i: Intersection = new Intersection(1, shape);
    let comps: IntersectionComputations = Intersection.prepareComputations(i, r);
    let color: PixelColor = defaultWorld.reflectedColor(comps);
    expect(equalPixelColor(createPixelColor(0, 0, 0), color)).toBeTruthy();
  });
  test('the reflected color for a reflective material', () => {
    let shape: Shape = new Plane();
    shape.material.reflective = 0.5;
    shape.transform = Transformations.translation(0, -1, 0);
    defaultWorld.addObject(shape);
    let r: Ray = new Ray(createPoint(0, 0, -3), createVector(0, -Math.SQRT2 / 2, Math.SQRT2 / 2));
    let i: Intersection = new Intersection(Math.SQRT2, shape);
    let comps: IntersectionComputations = Intersection.prepareComputations(i, r);
    let color: PixelColor = defaultWorld.reflectedColor(comps);
    expect(
      equalPixelColor(
        createPixelColor(0.19033, 0.23791, 0.142749),
        color
      )
    ).toBeTruthy();
  });
  test('shade hit with a reflective material', () => {
    let shape: Shape = new Plane();
    shape.material.reflective = 0.5;
    shape.transform = Transformations.translation(0, -1, 0);
    defaultWorld.addObject(shape);
    let r: Ray = new Ray(createPoint(0, 0, -3), createVector(0, -Math.SQRT2 / 2, Math.SQRT2 / 2));
    let i: Intersection = new Intersection(Math.SQRT2, shape);
    let comps: IntersectionComputations = Intersection.prepareComputations(i, r);
    let color: PixelColor = defaultWorld.shadeHit(comps);
    expect(
      equalPixelColor(
        createPixelColor(0.87675, 0.92434, 0.82917),
        color
      )
    ).toBeTruthy();
  });
});

describe('Glassy material', () => {
  test('a helper for producing glassy material', () => {
    let s: Shape = new Sphere();
    s.material = glassMaterial();
    expect(equal(s.material.transparency, 1)).toBeTruthy();
    expect(equal(s.material.refractiveIndex, 1.5)).toBeTruthy();
  });
});

describe('Refracted color', () => {
  let w: World;
  let shape: Shape;
  beforeEach(() => {
    w = createDefaultWorld();
    shape = w.sceneObjects[0];
  });
  test('the refracted color with an opaque surface', () => {
    let r: Ray = new Ray(createPoint(0, 0, -5), createVector(0, 0, 1));
    let xs: Intersection[] = Intersection.aggregateIntersections(
                              new Intersection(4, shape),
                              new Intersection(6, shape)
                             );
    let comps: IntersectionComputations = Intersection.prepareComputations(xs[0], r, xs);
    let c: PixelColor = w.refractedColor(comps, 5);
    expect(equalPixelColor(BlackColor, c));
  });
  test('the refracted color at the maximum recursive depth', () => {
    shape.material = glassMaterial();
    let r: Ray = new Ray(createPoint(0, 0, -5), createVector(0, 0, 1));
    let xs: Intersection[] = Intersection.aggregateIntersections(
                              new Intersection(4, shape),
                              new Intersection(6, shape)
                             );
    let comps: IntersectionComputations = Intersection.prepareComputations(xs[0], r, xs);
    let c: PixelColor = w.refractedColor(comps, 0);
    expect(equalPixelColor(BlackColor, c));
  });
  test('the refracted color under total internal reflection', () => {
    shape.material = glassMaterial();
    let r: Ray = new Ray(createPoint(0, 0, Math.SQRT2 / 2), createVector(0, 1, 0));
    let xs: Intersection[] = Intersection.aggregateIntersections(
                              new Intersection(-Math.SQRT2 / 2, shape),
                              new Intersection(Math.SQRT2 / 2, shape)
                             );
    let comps: IntersectionComputations = Intersection.prepareComputations(xs[1], r, xs);
    let c: PixelColor = w.refractedColor(comps, 5);
    expect(equalPixelColor(BlackColor, c));
  });
  test('the refracted color with a refracted ray', () => {
    let shapeA: Shape = w.sceneObjects[0];
    shapeA.material.ambient = 1;
    shapeA.material.pattern = new TestPattern();
    let shapeB: Shape = w.sceneObjects[1];
    shapeB.material.transparency = 1;
    shapeB.material.refractiveIndex = 1.5;
    let r: Ray = new Ray(createPoint(0, 0, 0.1), createVector(0, 1, 0));
    let xs: Intersection[] = Intersection.aggregateIntersections(
      new Intersection(-0.9899, shapeA),
      new Intersection(-0.4899, shapeB),
      new Intersection(0.4899, shapeB),
      new Intersection(0.9899, shapeA)
    );
    let comps: IntersectionComputations = Intersection.prepareComputations(xs[2], r, xs);
    let refractedColor = w.refractedColor(comps, 5);
    expect(equalPixelColor(refractedColor, createPixelColor(0, 0.99888, 0.04722))).toBeTruthy();
  });
  test('shadeHit with a transparent material', () => {
    let floor: Plane = new Plane();
    floor.transform = Transformations.translation(0, -1, 0);
    floor.material.transparency = 0.5;
    floor.material.refractiveIndex = 1.5;
    w.addObject(floor);
    let ball: Sphere = new Sphere();
    ball.material.color = RedColor;
    ball.material.ambient = 0.5;
    ball.transform = Transformations.translation(0, -3.5, -0.5);
    w.addObject(ball);
    let r: Ray = new Ray(createPoint(0, 0, -3), createVector(0, -Math.SQRT2 / 2, Math.SQRT2 / 2));
    let xs: Intersection[] = Intersection.aggregateIntersections(new Intersection(Math.SQRT2, floor));
    let comps: IntersectionComputations = Intersection.prepareComputations(xs[0], r, xs);
    let color: PixelColor = w.shadeHit(comps, 5);
    expect(equalPixelColor(color, createPixelColor(0.93642, 0.68642, 0.68642)));
  });
});

describe('Employ reflectance when combining reflection and refraction', () => {
  test('shadeHit with a reflective, transparent material', () => {
    let w: World = createDefaultWorld();
    let r: Ray = new Ray(createPoint(0, 0, -3), createVector(0, -Math.SQRT2 / 2, Math.SQRT2 / 2));
    let floor: Plane = new Plane();
    floor.transform = Transformations.translation(0, -1, 0);
    floor.material.reflective = 0.5;
    floor.material.transparency = 0.5;
    floor.material.refractiveIndex = 1.5;
    w.addObject(floor);
    let ball: Sphere = new Sphere();
    ball.material.color = RedColor;
    ball.material.ambient = 0.5;
    ball.transform = Transformations.translation(0, -3.5, -0.5);
    w.addObject(ball);
    let xs: Intersection[] = Intersection.aggregateIntersections(
      new Intersection(Math.SQRT2, floor)
    );
    let comps: IntersectionComputations = Intersection.prepareComputations(xs[0], r, xs);
    let color: PixelColor = w.shadeHit(comps, 5);
    expect(equalPixelColor(color, createPixelColor(0.93391, 0.69643, 0.69243))).toBeTruthy();
  });
});
