import { initGL } from './gl';
import { Rectangle } from './primitives/rectangle';
import { mat3, vec2, vec4 } from 'gl-matrix';

const gl = initGL();
const localMatrix = mat3.fromScaling(mat3.create(), vec2.fromValues(0.1, 0.1));
const worldMatrix = mat3.fromTranslation(mat3.create(), vec2.fromValues(-1, -1));
const rectangle = new Rectangle(gl, { localMatrix, worldMatrix, color: vec4.fromValues(1, 1, 0, 1) });
requestAnimationFrame(draw);

function draw() {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  mat3.translate(rectangle.worldMatrix, rectangle.worldMatrix, vec2.fromValues(0.001, 0.001));
  rectangle.draw();
  requestAnimationFrame(draw);
}
