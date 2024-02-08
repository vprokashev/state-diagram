import { initGL } from './gl';
import { Rectangle } from './primitives/rectangle';
import { vec2 } from 'gl-matrix';

(function () {
  const gl = initGL();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const rectangle = new Rectangle(gl, 0, 0, vec2.fromValues(2, 1));
  rectangle.draw(gl);
}());
