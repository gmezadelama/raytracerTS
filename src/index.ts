import { getProjectileSimulationPPM } from './ppm/projectile';
import { getClockHoursPositionPPM } from './ppm/clock';
import './sass/styles.scss';

let canvas;

window.onload = () => {
    console.log('canvas on load...');
    canvas = document.querySelector('#canvas');
    let context = canvas.getContext('2d');
    // draw a purple rectangle
    context.fillStyle = '#9c54e6';
    console.log('Plot: ProjectileSimulation.convertToPPM', getProjectileSimulationPPM());
    console.log('Plot: ClockHourSimulation.convertToPPM', getClockHoursPositionPPM());
}