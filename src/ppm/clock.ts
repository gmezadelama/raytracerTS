import {
    Point,
    add,
    createPoint,
    createVector,
    normalize,
    createPixelColor,
    multiplyScalar
} from '../raytracer/math/tuple';
import Transformations from '../raytracer/features/transformations';
import Matrix from '../raytracer/math/matrices';

import RTCanvas from './rtcanvas';

export function addXHours (time: Point, h: number): Point {
    const hourRotation: number = 2 * Math.PI  / 12;
    let rotMat = Matrix.Identity(4).rotateAroundY(h * hourRotation);
    return Transformations.multiplyRotationPoint(rotMat, time);
}

export function getClockHoursPositionPPM(): string {
    let origin: Point = createPoint(0, 0, 0);
    let canvasWidth = 600;
    let canvasHeight = 600;
    let margin = 50; // space between clock radio and canvas border
    let clockRadio = Math.min(canvasHeight, canvasWidth) / 2 - margin;
    const TwelveOClock: Point = createPoint (0, 0, clockRadio);
    let points : Point[] = [];
    for (let i = 0; i < 12; i++) {
        points.push(addXHours(TwelveOClock, i));
    }
    let c = new RTCanvas(canvasWidth, canvasHeight);
    for(const p of points) {
        let xCoord = canvasWidth / 2 + p.x;
        let yCoord = canvasHeight / 2 - p.z;
        c.writePixel(Math.round(xCoord), Math.round(yCoord), createPixelColor(1, 0.8, 0.6));
    }
    return c.convertToPPM();
}