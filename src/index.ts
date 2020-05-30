import { getProjectileSimulationPPM } from './ppm/projectile';
import { getClockHoursPositionPPM } from './ppm/clock';
import { castRayToRedSphere } from './ppm/redSphere';
import { cast3DSphere } from './ppm/lightingshadingsphere';
import './sass/styles.scss';
import { exportScene } from './ppm/firstScene';
import { exportSceneWithPlanes } from './ppm/firstSceneWithPlanes';
import { exportScene1WithPatterns } from './ppm/scene1WithPatterns';

let canvas;

window.onload = () => {
    console.log('canvas on load...');
    canvas = document.querySelector('#canvas');
    let context = canvas.getContext('2d');
    // draw a purple rectangle
    context.fillStyle = '#9c54e6';
    // console.log('Plot: ProjectileSimulation.convertToPPM', getProjectileSimulationPPM());
    // console.log('Plot: ClockHourSimulation.convertToPPM', getClockHoursPositionPPM());
    // console.log('Plot: RedSphere.convertToPPM', castRayToRedSphere());
    // console.log('Plot: 3DSphere.convertToPPM', cast3DSphere());
    // console.log('Plot: firstScene.convertToPPM', exportScene());
    // console.log('Plot: firstScene.convertToPPM', exportSceneWithPlanes());
    console.log('Plot: firstSceneWithPatterns.convertToPPM', exportScene1WithPatterns());
}