import './extension.js';
import { initGL } from './graphical-tools/gl';
import { vec2, vec4 } from 'gl-matrix';
import { Scene } from './scene';
import { SceneConfig, sceneDiscriminantType } from './types';
import { getFirstNode } from './scene/tools';
import { Rectangle } from './primitives';
import { pointIntersectShape } from './graphical-tools/math';

// 33 ms per 1 frame - minimal
// View Matrix - converted coords from world to camera
// Projection Matrix - z and clipping (cutting off space)
// * Aspect ratio
// * Field of view
// * Normalization
// https://learnopengl.com/Getting-started/Coordinate-Systems
// MVP Matrix = Projection Matrix × View Matrix × Model Matrix
// Order:
//     var matrix = m3.identity();
//     matrix = m3.multiply(matrix, translationMatrix);
//     matrix = m3.multiply(matrix, rotationMatrix);
//     matrix = m3.multiply(matrix, scaleMatrix);

const gl = initGL();
const canvas = document.getElementById('canvas');
if (!canvas) {
  throw new Error("Canvas not found");
}

const sceneConfig = {
  type: sceneDiscriminantType.space,
  properties: {
    x: 0,
    y: 0,
    width: 640,
    height: 480,
    color: vec4.fromValues(.0, .0, .0, 1.0)
  },
  children: [
    {
      name: 'rec1',
      type: sceneDiscriminantType.rectangle,
      properties: {
        x: 160,
        y: 120,
        width: 320,
        height: 240,
        color: vec4.fromValues(1, 0.5, 0.5, 1)
      },
      children: [
        {
          name: 'rec2',
          type: sceneDiscriminantType.rectangle,
          properties: {
            x: 100,
            y: 20,
            width: 320,
            height: 240,
            color: vec4.fromValues(0.5, 0.5, 0.5, 1)
          }
        }
      ]
    }
  ]
} satisfies SceneConfig;

const scene = new Scene(gl, sceneConfig);
scene.start();

const rectangle = getFirstNode(scene.sceneNode, (node) => node.instance instanceof Rectangle);

document.addEventListener('keydown', (e: KeyboardEvent) => {
  // if (rectangle) {
  //   if (e.key === 'ArrowLeft') {
  //     vec2.add(rectangle.instance.translation, vec2.fromValues(-0.01, 0), rectangle.instance.translation);
  //   } else if (e.key === 'ArrowRight') {
  //     vec2.add(rectangle.instance.translation, vec2.fromValues(0.01, 0), rectangle.instance.translation);
  //   } else if (e.key === 'ArrowUp') {
  //     vec2.add(rectangle.instance.translation, vec2.fromValues(0, 0.01), rectangle.instance.translation);
  //   } else if (e.key === 'ArrowDown') {
  //     vec2.add(rectangle.instance.translation, vec2.fromValues(0, -0.01), rectangle.instance.translation);
  //   }
  // }
});


const { x, y, width, height } = canvas.getBoundingClientRect();
canvas.addEventListener('mousemove', (e: MouseEvent) => {
  if (rectangle) {
    const vertices = (rectangle.instance as Rectangle).vertices;

    if (pointIntersectShape(
      vec2.fromValues(e.clientX - x, e.clientY - y),
      vertices,
      vec2.fromValues(width, height)
    )) {
      (rectangle.instance as Rectangle).color = vec4.fromValues(0.5, 1, 0.5, 1);
    } else {
      (rectangle.instance as Rectangle).color = vec4.fromValues(1, 0.5, 0.5, 1);
    }
  }
});
