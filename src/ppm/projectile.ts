import {
    Tuple,
    add,
    point,
    vector,
    normalize,
    color,
    multiplyScalar
} from '../raytracer/math/tuple';
import RTCanvas from '../raytracer/features/rtcanvas';

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

export function getProjectileSimulationPPM (): string {
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
    return c.convertToPPM();
}
