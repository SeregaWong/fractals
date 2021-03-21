
export const v3 = `

vec3 v3_xBase = vec3(1, 0, 0);
vec3 v3_yBase = vec3(0, 1, 0);
vec3 v3_zBase = vec3(0, 0, 1);

vec4 quaternionFromAxisAngle(vec3 axis, float angle) {

    float halfAngle = angle / 2.;
    float s = sin(halfAngle);

    vec4 q = vec4(
        axis.x * s,
        axis.y * s,
        axis.z * s,
        cos(halfAngle)
    );

    return q;
}

void v3_applyQuaternion(inout vec3 v, vec4 q) {

    // calculate quat * vector

    float ix = q.w * v.x + q.y * v.z - q.z * v.y;
    float iy = q.w * v.y + q.z * v.x - q.x * v.z;
    float iz = q.w * v.z + q.x * v.y - q.y * v.x;
    float iw = - q.x * v.x - q.y * v.y - q.z * v.z;

    // calculate result * inverse quat

    v.x = ix * q.w + iw * - q.x + iy * - q.z - iz * - q.y;
    v.y = iy * q.w + iw * - q.y + iz * - q.x - ix * - q.z;
    v.z = iz * q.w + iw * - q.z + ix * - q.y - iy * - q.x;
}

void v3_applyAxisAngle(inout vec3 v, vec3 axis, float angle) {
    v3_applyQuaternion(v, quaternionFromAxisAngle(axis, angle));
}

`;
