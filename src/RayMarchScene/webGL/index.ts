import {Vector3} from "../../threeJsMath/Vector3";
import {RayMarchRenderMode} from "../type";
import {camera} from "./camera.glsl";
import {raymarch} from "./raymarch.glsl";
import {v3} from "./v3.glsl";

const glslMain = `
#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

const int ITERATIONS = 500;
const int MAX_DIST = 50;
const float MIN_DIST = 0.001;

const int RENDER_MODE_DEMO = 0;
const int RENDER_MODE_FREE_FLY = 1;

uniform vec3 lightPos;
uniform vec3 cameraPosition;
uniform vec3 cameraRotation;
uniform int display_width;
uniform int display_height;
uniform float display_gate;
uniform float display_depth;
uniform int renderMode;

${v3}
${camera}
${raymarch}

void main() {
    vec3 rd = getRayDirection();

    RayRes res = raymarch(cameraPosition, rd);

    if(res.hit) {
        gl_FragColor = vec4(res.light, res.light, res.light, 1);
    } else {
        if (renderMode == RENDER_MODE_DEMO) {
            gl_FragColor = getBackgroundColor2(res.p, rd);
        } else {
            gl_FragColor = getBackgroundColor(rd);
        }
    }

}
`;

const gjVert = `
#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

attribute vec2 vertexPosition;

void main() {
  gl_Position = vec4(vertexPosition, 0, 1.0);
}
`;

export function buildRaymarchScene(
    canvas: HTMLCanvasElement,
    gate = .1,
    depth = 40,
    ) {
    const gl = canvas.getContext('webgl2');
    if (!gl) return; //TODO

    gl.viewport(0, 0, canvas.width, canvas.height);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!fragmentShader || !vertexShader) return;

    gl.shaderSource(fragmentShader, glslMain);
    gl.compileShader(fragmentShader);

    gl.shaderSource(vertexShader, gjVert);
    gl.compileShader(vertexShader);

    // console.log(gl.getShaderInfoLog(fragmentShader));
    // console.log(gl.getShaderInfoLog(vertexShader));

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    gl.validateProgram(program);
    // console.log(gl.getProgramParameter(program, gl.VALIDATE_STATUS), gl.getProgramInfoLog(program));

    gl.useProgram(program);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    const vertexArray = [
        -1, 1, 1, 1, -1, -1,
        1, -1, 1, 1, -1, -1,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);

    const positionArrtLocation = gl.getAttribLocation(program, 'vertexPosition');

    gl.vertexAttribPointer(
        positionArrtLocation,
        2,
        gl.FLOAT,
        false,
        2 * Float32Array.BYTES_PER_ELEMENT,
        0 * Float32Array.BYTES_PER_ELEMENT,
    );

    gl.enableVertexAttribArray(positionArrtLocation);

    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // tslint:disable: variable-name
    const uniformLocation_lightPos = gl.getUniformLocation(program, "lightPos");
    const uniformLocation_cameraPosition = gl.getUniformLocation(program, "cameraPosition");
    const uniformLocation_cameraRotation = gl.getUniformLocation(program, "cameraRotation");
    const uniformLocation_display_width = gl.getUniformLocation(program, "display_width");
    const uniformLocation_display_height = gl.getUniformLocation(program, "display_height");
    const uniformLocation_display_gate = gl.getUniformLocation(program, "display_gate");
    const uniformLocation_display_depth = gl.getUniformLocation(program, "display_depth");
    const uniformLocation_renderMode = gl.getUniformLocation(program, "renderMode");
    // tslint:enable: variable-name

    gl.uniform3f(uniformLocation_lightPos, 0, 50, 20);

    gl.uniform1i(uniformLocation_display_width, canvas.width);
    gl.uniform1i(uniformLocation_display_height, canvas.height);

    gl.uniform1f(uniformLocation_display_gate, gate);
    gl.uniform1f(uniformLocation_display_depth, depth);

    return function draw(pos: Vector3, rot: Vector3, renderMode: RayMarchRenderMode) {
        gl.uniform3f(uniformLocation_cameraPosition, pos.x, pos.y, pos.z);
        gl.uniform3f(uniformLocation_cameraRotation, rot.x, rot.y, rot.z);
        gl.uniform1i(uniformLocation_renderMode, renderMode);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
}
