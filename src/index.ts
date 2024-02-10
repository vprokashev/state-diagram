import { initGL } from './gl';
import { Rectangle } from './primitives/rectangle';
import { mat3, vec2, vec4 } from 'gl-matrix';

const gl = initGL();
const l1 = mat3.fromScaling(mat3.create(), vec2.fromValues(0.1, 0.1));
const w1 = mat3.fromTranslation(mat3.create(), vec2.fromValues(-1, -1));
const l2 = mat3.fromScaling(mat3.create(), vec2.fromValues(0.1, 0.1));
const w2 = mat3.fromTranslation(mat3.create(), vec2.fromValues(-1, -1));
const rectangle1 = new Rectangle(gl, { localMatrix: l1, worldMatrix: w1, color: vec4.fromValues(1, 1, 0, 1) });
const rectangle2 = new Rectangle(gl, { localMatrix: l2, worldMatrix: w2, color: vec4.fromValues(1, 0.5, 0.5, 1) });

requestAnimationFrame(draw);

function draw() {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  mat3.translate(rectangle1.worldMatrix, rectangle1.worldMatrix, vec2.fromValues(0.001, 0.001));
  mat3.translate(rectangle2.worldMatrix, rectangle2.worldMatrix, vec2.fromValues(0.002, 0.002));
  rectangle1.draw();
  rectangle2.draw();
  requestAnimationFrame(draw);
}
