import Camera from "../camera";
import { equal } from "../../math/operations";
import Matrix from "../../math/matrices";

describe('Camera tests', () => {
  test('constructing a camera', () => {
    let c: Camera = new Camera(160, 120, Math.PI / 2);
    expect(c.hSize).toBe(160);
    expect(c.vSize).toBe(120);
    expect(equal(c.fieldOfView, Math.PI / 2)).toBeTruthy();
    let Identity = Matrix.Identity();
    expect(Matrix.equal(c.transform, Identity)).toBeTruthy()
  });
});