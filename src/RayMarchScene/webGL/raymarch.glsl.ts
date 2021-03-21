import {scene} from "./scene.glsl";

export const raymarch = `

${scene}

vec3 getNormal(vec3 p) {
    float d = getDist(p);
    vec2 e = vec2(0.001, 0);
    vec3 n = d - vec3(getDist(p - e.xyy), getDist(p - e.yxy), getDist(p - e.yyx));
    return normalize(n);
}

float raymarchLight(vec3 ro, vec3 rd) {
    float dO = 0.;
    float md = 1.;
    for (int i = 0; i < 20; i++)
    {
        vec3 p = ro + rd * dO;
        float dS = getDist(p);
        md = min(md, dS);
        dO += dS;
        if(dO > 50. || dS < 0.1) break;
    }
    return md;
}

float getLight(vec3 p, vec3 ro, int i) {
    vec3 l = normalize(lightPos - p);
    vec3 n = getNormal(p);
    float dif = clamp(dot(n, l) * 0.5 + 0.5, 0., 1.);
    float d = raymarchLight(p + n * 0.1 * 10., l) + 1.;
    d = clamp(d, 0., 1.);
    dif *= d;
    float occ =  1. - (float(i) / float(ITERATIONS * 2));
    occ *= occ;
    float fog = distance(p, ro) / float(MAX_DIST);
    fog = clamp(fog, 0., 1.);
    fog *= fog;
    return dif * occ * (1. - fog) + 0.28 * fog;
}

float getLight2(vec3 p, vec3 ro, int i) {
    vec3 l = normalize(lightPos - p);
    vec3 n = getNormal(p);
    return clamp(dot(n, l) * 0.5 + 0.5, 0., 1.);
}

struct RayRes {
    float light;
    bool hit;
    vec3 p;
};

RayRes raymarch(vec3 ro, vec3 rd) {
    vec3 p = ro;
    for (int i = 0; i < ITERATIONS; i++) {
        float d = getDist(p);
        if(d > float(MAX_DIST)) return RayRes(0., false, p);
        p += rd * d;
        if(d < 0.001) {
            return RayRes(
                renderMode == RENDER_MODE_DEMO
                    ? .5
                    : getLight(p, ro, i),
                true,
                p
            );
        }
    }
    return RayRes(0., false, p);
}

`;