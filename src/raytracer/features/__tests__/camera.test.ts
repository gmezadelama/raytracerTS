import Camera from "../camera";
import { equal } from "../../math/operations";
import Matrix from "../../math/matrices";
import Ray from "../ray";
import { equalPoint, equalVector, createPoint, createVector } from "../../math/tuple";
import Transformations from "../transformations";

describe('Camera tests', () => {
  test('constructing a camera', () => {
    let c: Camera = new Camera(160, 120, Math.PI / 2);
    expect(c.hSize).toBe(160);
    expect(c.vSize).toBe(120);
    expect(equal(c.fieldOfView, Math.PI / 2)).toBeTruthy();
    let Identity = Matrix.Identity();
    expect(Matrix.equal(c.transform, Identity)).toBeTruthy()
  });
  test('The pixel size for a horizontal canvas', () => {
    let c: Camera = new Camera(200, 125, Math.PI / 2);
    expect(equal(c.pixelSize, 0.01)).toBeTruthy();
  });
  test('The pixel size for a vertical canvas', () => {
    let c: Camera = new Camera(125, 200, Math.PI / 2);
    expect(equal(c.pixelSize, 0.01)).toBeTruthy();
  });
  test('Constructing a ray through the center of the canvas', () => {
    let c: Camera = new Camera(201, 101, Math.PI / 2);
    let r: Ray = c.rayForPixel(100, 50);
    expect(equalPoint(r.origin, createPoint(0, 0, 0))).toBeTruthy();
    expect(equalVector(r.direction, createVector(0, 0, -1))).toBeTruthy();
  });
  test('Constructing a ray through a corner of the canvas', () => {
    let c = new Camera(201, 101, Math.PI / 2);
    let r: Ray = c.rayForPixel(0, 0);
    expect(equalPoint(r.origin, createPoint(0, 0, 0))).toBeTruthy();
    expect(equalVector(r.direction, createVector(0.66519, 0.33259, -0.66851))).toBeTruthy();
  });
  test('Constructing a ray when the camera is transformed', () => {
    let c = new Camera(201, 101, Math.PI / 2);
    c.transform = Matrix.multiply(Transformations.rotateAroundY(Math.PI / 4), Transformations.translation(0, -2, 5));
    let r: Ray = c.rayForPixel(100, 50);
    expect(equalPoint(r.origin, createPoint(0, 2, -5))).toBeTruthy();
    expect(equalVector(r.direction, createVector(Math.SQRT2 / 2, 0, -Math.SQRT2 / 2))).toBeTruthy();
  });
});
