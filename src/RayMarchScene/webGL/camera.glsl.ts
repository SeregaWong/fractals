
export const camera = `

vec3 getRayDirection() {

    vec3 rd = vec3(
        (gl_FragCoord.x - float(display_width - 1) / 2.) * display_gate,
        (gl_FragCoord.y - float(display_height - 1) / 2.) * display_gate,
        display_depth
    );

    v3_applyAxisAngle(rd, v3_xBase, cameraRotation.x);
    v3_applyAxisAngle(rd, v3_yBase, cameraRotation.y);
    v3_applyAxisAngle(rd, v3_zBase, cameraRotation.z);

    return normalize(rd);
}

vec4 getBackgroundColor(vec3 rd) {
    float yLevel = (rd.y + 1.) / 2.;

    return vec4(15. + 180. * yLevel, 40. + 180. * yLevel, 70. + 170. * yLevel, 100.) / 255.;
}


vec4 getBackgroundColor2(vec3 p, vec3 rd) {

    // float RADIUS_FX = 10.;
    float RADIUS_FX = 0.1;

    float r = float(display_width > display_height ? display_height : display_width) / 2. * .37;
    float rEnd = r * 2.4;
    float rRed = r * 3.;
    float rA = r * 2.5;
    float rAEnd = r * 2.7;

    vec2 centredCoord = vec2(
        (gl_FragCoord.x - float(display_width - 1) / 2.),
        (gl_FragCoord.y - float(display_height - 1) / 2.)
    );

    float distToCenterImage = length(centredCoord);

    bool isInRadius = distToCenterImage < r;
    float outRadiusFactor = 1.;
    if(!isInRadius) {
        outRadiusFactor = distToCenterImage < rEnd
            ? 1. - (distToCenterImage - r) / (rEnd - r)
            : 0.;
    }

    float pLength = length(p);
    float a = pLength > RADIUS_FX ? pLength - RADIUS_FX : 0.;
    a = a / 550.;
    // a = a / 160.;
    // a = a / 100.;
    a = a > 1. ? 1. : a;

    a = cos(a * ${Math.PI}) + 1. / 2.;
    // a = sin(a * ${Math.PI}) + 1. / 2.;



    vec4 col = vec4(0., 0., 0., 1.);

    if (distToCenterImage < rRed) {

        col.r = 1. - distToCenterImage / rRed;
    }

    if (distToCenterImage > rA) {
        col.a = distToCenterImage < rAEnd
        ? 1. - (distToCenterImage - rA) / (rAEnd - rA)
        : 0.;
    }

    float yLevel = (rd.y + 1.) / 2.;

    col.g = (180. - 50. * yLevel) / 255. * outRadiusFactor;
    col.b = (120. + 100. * yLevel) / 255. * outRadiusFactor;

    col.grb *= a;
    // col.a = a;

    return col;
}

`;
