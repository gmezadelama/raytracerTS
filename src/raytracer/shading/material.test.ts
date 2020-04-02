import Material from "./material";
import { equal } from "../math/operations";
import Sphere from "../geometry/sphere";
import { createPixelColor } from "../math/tuple";

describe('Material testing', () => {
  it('is the default material', () => {
    let m: Material = new Material();
    expect(m.color.x).toBe(1);
    expect(m.color.y).toBe(1);
    expect(m.color.z).toBe(1);
    expect(equal(m.ambient, 0.1)).toBeTruthy();
    expect(equal(m.diffuse, 0.9)).toBeTruthy();
    expect(equal(m.specular, 0.9)).toBeTruthy();
    expect(equal(m.shininess, 200.0)).toBeTruthy();
  });
  test('A sphere has a default material', () => {
    let s: Sphere = new Sphere();
    expect(s.material.color.x).toBe(1);
    expect(s.material.color.y).toBe(1);
    expect(s.material.color.z).toBe(1);
    expect(equal(s.material.ambient, 0.1)).toBeTruthy();
    expect(equal(s.material.diffuse, 0.9)).toBeTruthy();
    expect(equal(s.material.specular, 0.9)).toBeTruthy();
    expect(equal(s.material.shininess, 200.0)).toBeTruthy();
  });
  test('A sphere may be assigned a material', () => {
    let s: Sphere = new Sphere();
    let m: Material = new Material;
    m.color = createPixelColor(0.25, 0.35, 0.45);
    m.ambient = 0.2;
    m.diffuse = 0.3;
    m.specular = 0.3;
    m.shininess = 100.0;
    s.material = m;
    expect(equal(s.material.color.x, 0.25)).toBeTruthy();
    expect(equal(s.material.color.y, 0.35)).toBeTruthy();
    expect(equal(s.material.color.z, 0.45)).toBeTruthy();
    expect(equal(s.material.ambient, 0.2)).toBeTruthy();
    expect(equal(s.material.diffuse, 0.3)).toBeTruthy();
    expect(equal(s.material.specular, 0.3)).toBeTruthy();
    expect(equal(s.material.shininess, 100.0)).toBeTruthy();
  });
})
