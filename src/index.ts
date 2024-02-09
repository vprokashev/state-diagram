import { initGL } from './gl';
import { Rectangle } from './primitives/rectangle';
import { mat3, vec2, vec4 } from 'gl-matrix';

(function () {
  const gl = initGL();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  const localMatrix = mat3.fromScaling(mat3.create(), vec2.fromValues(0.4, 0.4));
  const worldMatrix = mat3.fromTranslation(mat3.create(), vec2.fromValues(-1, -1));
  const rectangle = new Rectangle(gl, { localMatrix, worldMatrix, color: vec4.fromValues(1, 1, 0, 1) });
  rectangle.draw();
}());
