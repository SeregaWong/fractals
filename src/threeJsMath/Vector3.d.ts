
class Vector3 {
    x: number;
    y: number;
    z: number;

    constructor(x = 0, y = 0, z = 0);
    abs(): Vector3;
    normalize(): Vector3;
    toPolarOrbic(): Vector3;
    toCartesian(): Vector3;
    length(): number;
    manhattanLength(): number;
    setLength(length: number): Vector3;
    dot(v: Vector3): number;
    distanceTo(v: Vector3): number;
    angleTo(v: Vector3): number;
    add(v: Vector3): Vector3;
    sub(v: Vector3): Vector3;
    multiply(v: Vector3): Vector3;
    max(v: Vector3): Vector3;
    subScalar(s: number): Vector3;
    multiplyScalar(s: number): Vector3;
    addScaledVector(v: Vector3, s: number): Vector3;
    applyAxisAngle(axis: Vector3, angle: number): Vector3;
    clone(): Vector3;
    divide(v: Vector3): Vector3;
    divideScalar(s: number): Vector3;

    static readonly xBase: Vector3;
    static readonly yBase: Vector3;
    static readonly zBase: Vector3;
}

export {Vector3};