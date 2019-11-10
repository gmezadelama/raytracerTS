import {
    Tuple,
    add,
    point,
    vector,
    normalize,
    color,
    multiplyScalar
} from './raytracer/math/tuple';
import RTCanvas from './raytracer/features/rtcanvas';
import './sass/styles.scss';

interface Projectile {
    position: Tuple,
    velocity: Tuple
}

interface Environement {
    gravity: Tuple,
    wind: Tuple
}

function tick (env: Environement, proj: Projectile):Projectile {
    let position = add(proj.position, proj.velocity);
    let velocity = add(proj.velocity, add(env.gravity, env.wind));
    return {
        position,
        velocity
    };
}

let canvas;

window.onload = () => {
    console.log('canvas on load...');
    canvas = document.querySelector('#canvas');
    let context = canvas.getContext('2d');
    // draw a purple rectangle
    context.fillStyle = '#9c54e6';
    // context.fillRect(100, 100, canvas.width / 15, canvas.height / 20);
    // let proj:Projectile = {
    //     position: vector(100, 100, 0),
    //     velocity: normalize(vector(1, 1, 0))
    // };
    // const env:Environement = {
    //     gravity: vector(0, -0.1, 0),
    //     wind: vector(-0.01, 0, 0)
    // };
    // context.fillRect(proj.position.x, proj.position.y, canvas.width / 15, canvas.height / 20);
    // let interval = setInterval(() => {
    //     proj = tick(env, proj);
    //     context.clearRect(0, 0, canvas.width, canvas.height);
    //     context.fillRect(proj.position.x, proj.position.y, canvas.width / 15, canvas.height / 20);
    //     if (proj.position.y < 0) {
    //         clearInterval(interval);
    //     }
    // }, 100);

    // let c = new RTCanvas(10, 2);
    // for(let i = 0; i < 10; i++) {
    //     for (let j = 0; j < 2; j++) {
    //         c.writePixel(i, j, color(1, 0.8, 0.6));
    //     }
    // }
    // console.log('RTCanvas.converToPPM', c.convertToPPM());

    let start = point(0, 1, 0);
    let velocity = multiplyScalar(normalize(vector(1, 1.8, 0)), 11.25);
    let proj:Projectile = {
        position: start,
        velocity: velocity
    };
    const env:Environement = {
        gravity: vector(0, -0.1, 0),
        wind: vector(-0.01, 0, 0)
    };

    let c = new RTCanvas(900, 550);
    while(proj.position.y >= 0) {
        proj = tick(env, proj);
        c.writePixel(Math.round(proj.position.x), Math.round(c.getHeight() - proj.position.y), color(1, 0.8, 0.6));
    }
    console.log('Plot: RTCanvas.converToPPM', c.convertToPPM());
}