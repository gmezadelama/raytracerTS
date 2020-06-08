import Sphere from "../raytracer/geometry/sphere"
import Transformations from "../raytracer/features/transformations";
import Material from "../raytracer/shading/material";
import { createPixelColor, createPoint, createVector, matrixToTuple } from "../raytracer/math/tuple";
import World from "../raytracer/features/world";
import Light from "../raytracer/shading/light";
import Camera from "../raytracer/features/camera";
import { viewTransform } from "../raytracer/features/view";
import Matrix from "../raytracer/math/matrices";
import Plane from "../raytracer/geometry/plane";


export const exportSceneWithGlasses = (): string => {
  let w: World = new World();
  // the scene is constructed from a plane with three spheres

  // #1 The floor is the plane with the default transform on the plane XZ
  let floor: Plane = new Plane();
  floor.material = new Material();
  floor.material.color = createPixelColor(1, 0.9, 0.9);
  floor.material.specular = 1;
  floor.material.shininess = 300;
  floor.material.diffuse = 0.1;
  floor.material.transparency = 0.9;
  floor.material.reflective = 0.9;
  w.addObject(floor);

  // #2 The wall on the left hast the color as the floor,
  //    but is also rotated and translated into place
  let leftWall: Plane = new Plane();
  leftWall.transform = Matrix.multiply(
    Matrix.multiply(
      Transformations.translation(0, 0, 5),
      Transformations.rotateAroundY(-Math.PI / 4)
    ),
    Transformations.rotateAroundX(Math.PI / 2)
  );
  leftWall.material.color = createPixelColor(1, 0.9, 0.9);
  leftWall.material.specular = 0;
  w.addObject(leftWall);

  // #3 The wall on the right is identical to the left wall,
  //    but is rotated the opposite direction in y
  let rightWall: Plane = new Plane();
  rightWall.transform = Matrix.multiply(
    Matrix.multiply(
      Transformations.translation(0, 0, 5),
      Transformations.rotateAroundY(Math.PI / 4)
    ),
    Transformations.rotateAroundX(Math.PI / 2)
  );
  rightWall.material.color = createPixelColor(1, 0.9, 0.9);
  rightWall.material.specular = 0;
  w.addObject(rightWall);

  // #4 The large sphere in the middle is a unit sphere,
  //    translated upward slightly and colored green
  let middle: Sphere = new Sphere();
  middle.transform = Transformations.translation(-0.5, 1, 0.5);
  middle.material = new Material();
  middle.material.color = createPixelColor(0.9, 0.25, 0.25);
  middle.material.specular = 1;
  middle.material.shininess = 500;
  middle.material.diffuse = 0.1;
  middle.material.transparency = 0.2;
  middle.material.reflective = 0.9;
  w.addObject(middle);

  // #5 The smaller green sphere on the right is scaled in half
  let right: Sphere = new Sphere();
  right.transform = Matrix.multiply(
    Transformations.translation(1.5, 0.5, -0.5),
    Transformations.scaling(0.5, 0.5, 0.5)
  );
  right.material = new Material();
  right.material.color = createPixelColor(0.25, 0.25, 0.9);
  right.material.specular = 1;
  right.material.shininess = 300;
  right.material.diffuse = 0.1;
  right.material.transparency = 0.5;
  right.material.reflective = 0.9;
  w.addObject(right);

  // #6 The smallest sphere is scaled by a third,
  //    before being translated
  let left: Sphere = new Sphere();
  left.transform = Matrix.multiply(
    Transformations.translation(-1.5, 0.33, -0.75),
    Transformations.scaling(0.33, 0.33, 0.33)
  );
  left.material = new Material();
  left.material.color = createPixelColor(0.25, 0.9, 0.25);
  left.material.specular = 1;
  left.material.shininess = 300;
  left.material.diffuse = 0.1;
  left.material.transparency = 0.3;
  left.material.reflective = 0.9;
  w.addObject(left);

  // the light source is white, shining from above and to the left
  
  w.lightSource = new Light(createPoint(-10, 10, -10), createPixelColor(1, 1, 1));
  
  // let camera: Camera = new Camera(100, 50, Math.PI / 3);
  let camera: Camera = new Camera(400, 200, Math.PI / 3);
  camera.transform = viewTransform(
    createPoint(0, 1.5, -5),
    createPoint(0, 1, 0),
    createVector(0, 1, 0)
  );

  return camera.render(w, true).convertToPPM();
}
