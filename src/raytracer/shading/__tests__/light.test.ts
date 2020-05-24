import { PixelColor, Point, createPixelColor, createPoint, createVector, Vector, equalPixelColor } from "../../math/tuple";
import Light, { lighting, reflectLight } from "../light";
import Material from "../material";
import { equal } from "../../math/operations";
import { StripePattern, WhitePattern, BlackPattern } from "../../features/pattern";
import Sphere from "../../geometry/sphere";

describe('Light testing', () => {
  test('A point light has a position and intensity', () => {
    let intensity: PixelColor = createPixelColor(1, 1, 1);
    let position: Point = createPoint(0, 0, 0);
    let light = new Light(position, intensity);
    expect(light.position.x).toBe(0);
    expect(light.position.y).toBe(0);
    expect(light.position.z).toBe(0);
    expect(light.intensity.x).toBe(1);
    expect(light.intensity.y).toBe(1);
    expect(light.intensity.z).toBe(1);
  });
});

describe('reflection', () => {
  test('Reflecting a vector approaching at 45º', () => {
    let v = createVector(1, -1, 0);
    let n = createVector(0, 1, 0);
    let r = reflectLight(v, n);
    expect(equal(r.x,1)).toBeTruthy();
    expect(equal(r.y,1)).toBeTruthy();
    expect(equal(r.z,0)).toBeTruthy();
    expect(r.w).toBe(0);
  });
  test('Reflecting a vector off a slanted surface', () => {
    let v = createVector(0, -1, 0);
    let n = createVector(Math.SQRT2 / 2, Math.SQRT2 / 2, 0);
    let r = reflectLight(v, n);
    expect(equal(r.x,1)).toBeTruthy();
    expect(equal(r.y,0)).toBeTruthy();
    expect(equal(r.z,0)).toBeTruthy();
    expect(r.w).toBe(0);
  });
});

describe('Lighting test', () => {
  let m: Material;
  let position: Point;
  beforeAll(() => {
    m = new Material();
    position = createPoint(0, 0, 0);
  });
  test('Lighting with the eye between the light and the surface', () => {
    let eyev: Vector = createVector(0, 0, -1);
    let normalv: Vector = createVector(0, 0, -1);
    let light: Light = new Light(createPoint(0, 0, -10), createPixelColor(1, 1, 1));
    let result: PixelColor = lighting(m, new Sphere(), light, position, eyev, normalv);
    expect(equal(result.x, 1.9)).toBeTruthy();
    expect(equal(result.y, 1.9)).toBeTruthy();
    expect(equal(result.z, 1.9)).toBeTruthy();
  });
  test('Lighting with the eye between the light and the surface, eye offset 45º', () => {
    let eyev: Vector = createVector(0, Math.SQRT2 / 2, -Math.SQRT2 / 2);
    let normalv: Vector = createVector(0, 0, -1);
    let light: Light = new Light(createPoint(0, 0, -10), createPixelColor(1, 1, 1));
    let result: PixelColor = lighting(m, new Sphere(), light, position, eyev, normalv);
    expect(equal(result.x, 1.0)).toBeTruthy();
    expect(equal(result.y, 1.0)).toBeTruthy();
    expect(equal(result.z, 1.0)).toBeTruthy();
  });
  test('Lighting with the eye opposite the surface, light offset 45º', () => {
    let eyev: Vector = createVector(0, 0, -1);
    let normalv: Vector = createVector(0, 0, -1);
    let light: Light = new Light(createPoint(0, 10, -10), createPixelColor(1, 1, 1));
    let result: PixelColor = lighting(m, new Sphere(), light, position, eyev, normalv);
    expect(equal(result.x, 0.7364)).toBeTruthy();
    expect(equal(result.y, 0.7364)).toBeTruthy();
    expect(equal(result.z, 0.7364)).toBeTruthy();
  });
  test('Lighting with the eye in the path of the reflection vector', () => {
    let eyev: Vector = createVector(0, -Math.SQRT2 / 2, -Math.SQRT2 / 2);
    let normalv: Vector = createVector(0, 0, -1);
    let light: Light = new Light(createPoint(0, 10, -10), createPixelColor(1, 1, 1));
    let result: PixelColor = lighting(m, new Sphere(), light, position, eyev, normalv);
    expect(equal(result.x, 1.6364)).toBeTruthy();
    expect(equal(result.y, 1.6364)).toBeTruthy();
    expect(equal(result.z, 1.6364)).toBeTruthy();
  });
  test('Lighting with the light behind the surface', () => {
    let eyev: Vector = createVector(0, 0, -1);
    let normalv: Vector = createVector(0, 0, -1);
    let light: Light = new Light(createPoint(0, 0, 10), createPixelColor(1, 1, 1));
    let result: PixelColor = lighting(m, new Sphere(), light, position, eyev, normalv);
    expect(equal(result.x, 0.1)).toBeTruthy();
    expect(equal(result.y, 0.1)).toBeTruthy();
    expect(equal(result.z, 0.1)).toBeTruthy();
  });
  test('Lighting with the surface in shadow', () => {
    let eyev: Vector = createVector(0, 0, -1);
    let normalv: Vector = createVector(0, 0, -1);
    let light: Light = new Light(createPoint(0, 0, -10), createPixelColor(1, 1, 1));
    let inShadow: boolean = true;
    let result: PixelColor = lighting(m, new Sphere(), light, position, eyev, normalv, inShadow);
    expect(equal(result.x, 0.1)).toBeTruthy();
    expect(equal(result.y, 0.1)).toBeTruthy();
    expect(equal(result.z, 0.1)).toBeTruthy();
  });
});

describe('testing lighting with patterns applied', () => {
  test('Light with a stripe pattern applied', () => {
    let m: Material = new Material();
    m.pattern = new StripePattern(WhitePattern, BlackPattern);
    m.ambient = 1;
    m.diffuse = 0;
    m.specular = 0;
    let eyev: Vector = createVector(0, 0, -1);
    let normalv: Vector = createVector(0, 0, -1);
    let light: Light = new Light(createPoint(0, 0, -10), createPixelColor(1, 1, 1));
    let c1: PixelColor = lighting(m, new Sphere(), light, createPoint(0.9, 0, 0), eyev, normalv, false);
    let c2: PixelColor = lighting(m, new Sphere(), light, createPoint(1.1, 0, 0), eyev, normalv, false);
    expect(equalPixelColor(WhitePattern, c1)).toBeTruthy();
    expect(equalPixelColor(BlackPattern, c2)).toBeTruthy();
  });
});
