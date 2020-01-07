import {
    Point,
    add,
    point,
    vector,
    normalize,
    color,
    multiplyScalar
} from '../raytracer/math/tuple';
import * as Transformations from '../raytracer/features/transformations';
import Matrix, { inverse, Identity } from '../raytracer/features/matrices';

import RTCanvas from '../raytracer/features/rtcanvas';

export function addXHours (time: Point, h: number): Point {
    const hourRotation: number = 2 * Math.PI  / 12;
    let rotMat = Identity(4).rotateAroundY(h * hourRotation);
    return Transformations.multiplyRotationPoint(rotMat, time);
}

export function getClockHoursPositionPPM(): string {
    let origin: Point = point(0, 0, 0);
    let canvasWidth = 600;
    let canvasHeight = 600;
    let margin = 50; // space between clock radio and canvas border
    let clockRadio = Math.min(canvasHeight, canvasWidth) / 2 - margin;
    const TwelveOClock: Point = point (0, 0, clockRadio);
    let points : Point[] = [];
    for (let i = 0; i < 12; i++) {
        points.push(addXHours(TwelveOClock, i));
    }
    let c = new RTCanvas(canvasWidth, canvasHeight);
    for(const p of points) {
        let xCoord = canvasWidth / 2 + p.x;
        let yCoord = canvasHeight / 2 - p.z;
        c.writePixel(Math.round(xCoord), Math.round(yCoord), color(1, 0.8, 0.6));
    }
    return c.convertToPPM();
}