
export const scene = `

const int SIters = 16;

const vec3 a1 = vec3(-0.8164965809277261, -0.33333333333333326, -0.4714045207910317);
const vec3 a2 = vec3(0.8164965809277261, -0.33333333333333326, -0.4714045207910317);
const vec3 a3 = vec3(0, -0.33333333333333326, 0.9428090415820634);
const vec3 a4 = vec3(0, 1, 0);

float simpl(vec3 z, float Scale) {
    vec3 c;
    int n = 0;
    float dist, d;
    for(int i = 0; i < SIters; i++) {
        c = a1; dist = length(z-a1);
        d = length(z-a2); if (d < dist) { c = a2; dist=d; }
        d = length(z-a3); if (d < dist) { c = a3; dist=d; }
        d = length(z-a4); if (d < dist) { c = a4; dist=d; }
        z = Scale*z-c*(Scale-1.0);
        n++;
    }

    return length(z) * pow(Scale, float(-n));
}

float ground(vec3 p) {
    return p.y;
}

float cube(vec4 s, vec3 p) {
    vec3 q = abs(p - s.xyz) - s.w;
    return length(max(q, vec3(0, 0, 0))) + min(max(q.x, max(q.y, q.z)), 0.);
}

float getDist(vec3 p) {
    return simpl(p, 2.0);

    // return cube(vec4(0.0, 0.0, 0.0, 0.6), p);
    // return min(
    //     // cube(vec4(0.0, 0.0, 0.0, 0.6), p),
    //     length(p)
    //         - 0.01,
    //         // - 0.33333333333333326,
    //     simpl(p, 2.0)
    //     // ground(p)
    // );
}

`;