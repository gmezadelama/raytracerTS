import { Point, Vector, subtract, normalize, cross, multiplyScalar, createPoint } from "../math/tuple"
import Matrix from "../math/matrices"
import Transformations from "./transformations";

export const viewTransform = (from: Point, to: Point, up: Vector): Matrix => {
  let forward: Vector = normalize(subtract(to, from));
  let left: Vector = cross(forward, normalize(up));
  let trueUp: Vector = cross(left, forward);
  let orientation: Matrix = new Matrix(4, 4);
  orientation.setMatrix(
    [
      [left.x, left.y, left.z, 0],
      [trueUp.x, trueUp.y, trueUp.z, 0],
      [-forward.x, -forward.y, -forward.z, 0],
      [0, 0, 0, 1]
    ]
  );
  let translation: Matrix = Transformations.translation(-from.x, -from.y, -from.z);
  return Matrix.multiply(orientation, translation);
}