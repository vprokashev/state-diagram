import { initGL } from './gl';
import { BaseScene, sceneDiscriminantType } from './types';
import { Rectangle } from './primitives/rectangle';

const sceneA = {
  type: sceneDiscriminantType.world,
  properties: {
    scale: 1
  },
  children: [
    {
      type: sceneDiscriminantType.rectangle,
      properties: {
        v1: [ 0, 0 ],
        v2: [ 40, 40 ]
      }
    },
    {
      type: sceneDiscriminantType.rectangle,
      properties: {
        v1: [ 40, 40 ],
        v2: [ 80, 80 ]
      }
    }
  ]
} as const satisfies BaseScene;

(function () {
  const gl = initGL();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  const rectangle = new Rectangle(gl, { v1: [ 0, 0 ], v2: [ 0.9, 1 ] });
  rectangle.draw();
}());
