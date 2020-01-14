import RTCanvas from './rtcanvas';
import Matrix, { inverse, Identity } from '../raytracer/math/matrices';
import * as Transformations from '../raytracer/features/transformations';
import { Point, Vector,
        PixelColor, createPoint,
        createVector, createPixelColor,
        normalize, subtract } from '../raytracer/math/tuple';
import Ray from '../raytracer/features/ray';
import Sphere from '../raytracer/geometry/sphere';
import Intersection, { hit } from '../raytracer/features/intersection';

export function castRayToRedSphere(): string {
    const rayOrigin: Point = createPoint(0, 0, -5);
    const wallZ = 10;
    const wallSize = 7;
    const canvasPixels = 100;
    const wallCenter = wallSize / 2;
    // pixelSize is the conversion factor between
    // the wall coordinates and the canvas coordinates
    const pixelSize = wallSize / canvasPixels;

    let canvas = new RTCanvas(canvasPixels, canvasPixels);
    const sphereColor: PixelColor = createPixelColor(1, 0, 0);
    let sphere: Sphere = new Sphere();

    // scanning each row of pixel in the canvas
    for (let y = 0; y < canvasPixels; y++) {
        // computing the world Y coordinate (wall)
        // top = +wallCenter bottom = -wallCenter
        let worldY = wallCenter - pixelSize * y
        // for each row in the pixel
        for (let x = 0; x < canvasPixels; x++) {
            // computing the world X coordinate (wall)
            // left = -wallCenter right = +wallCenter
            let worldX = -wallCenter + pixelSize * x
            // point on the wall that the ray will target
            let wallTarget = createPoint(worldX, worldY, wallZ);
            let r = new Ray(rayOrigin, normalize(subtract(wallTarget, rayOrigin)));
            let is: Intersection[] = sphere.intersect(r);
            if (hit(is)) {
                canvas.writePixel(x, y, sphereColor);
            }
        }
    }
    return canvas.convertToPPM();
}
