import './extension.js';
import { initGL } from './graphical-tools/gl';
import { vec2, vec4 } from 'gl-matrix';
import { Scene } from './scene';
import { SceneConfig, sceneDiscriminantType } from './types';
import { getFirstNode } from './scene/tools';
import { Rectangle } from './primitives';
import { pointIntersectShape } from './graphical-tools/math';
import { Simple2D } from "./camera/simple2D";

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

const resolution = { w: 640, h: 480 };

const sceneConfig = {
  type: sceneDiscriminantType.space,
  properties: {
    width: resolution.w,
    height: resolution.h,
    color: [ 0, 0, 0, 1 ]
  },
  children: [
    {
      name: 'rec1',
      type: sceneDiscriminantType.rectangle,
      properties: {
        position: [ 320, 240 ],
        scale: [ 318, 120 ],
        color: [ 1, 0.5, 0.5, 1 ]
      },
      children: [
        {
          name: 'rec2',
          type: sceneDiscriminantType.rectangle,
          properties: {
            position: [ 100, 20 ],
            scale: [ 30, 30 ],
            color: [ 0.5, 0.5, 0.5, 1 ]
          }
        }
      ]
    }
  ]
} satisfies SceneConfig;

const camera = new Simple2D(resolution.w, resolution.h);

const scene = new Scene(gl, sceneConfig, camera);
scene.start();

const rectangle1 = getFirstNode(scene.sceneNode, (node) => node.name === 'rec1');
const rectangle2 = getFirstNode(scene.sceneNode, (node) => node.name === 'rec2');

document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (rectangle1 && 'position' in rectangle1.instance) {
    if (e.key === 'ArrowLeft') {
      vec2.add(rectangle1.instance.position, vec2.fromValues(-2, 0), rectangle1.instance.position);
    } else if (e.key === 'ArrowRight') {
      vec2.add(rectangle1.instance.position, vec2.fromValues(2, 0), rectangle1.instance.position);
    } else if (e.key === 'ArrowUp') {
      vec2.add(rectangle1.instance.position, vec2.fromValues(0, 2), rectangle1.instance.position);
    } else if (e.key === 'ArrowDown') {
      vec2.add(rectangle1.instance.position, vec2.fromValues(0, -2), rectangle1.instance.position);
    }
  }
});

document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (rectangle2 && 'position' in rectangle2.instance) {
    if (e.key === 'ArrowLeft') {
      vec2.add(rectangle2.instance.position, vec2.fromValues(-2, 0), rectangle2.instance.position);
    } else if (e.key === 'ArrowRight') {
      vec2.add(rectangle2.instance.position, vec2.fromValues(2, 0), rectangle2.instance.position);
    } else if (e.key === 'ArrowUp') {
      vec2.add(rectangle2.instance.position, vec2.fromValues(0, 2), rectangle2.instance.position);
    } else if (e.key === 'ArrowDown') {
      vec2.add(rectangle2.instance.position, vec2.fromValues(0, -2), rectangle2.instance.position);
    }
  }
});


const { x, y, width, height } = canvas.getBoundingClientRect();
canvas.addEventListener('mousemove', (e: MouseEvent) => {
  if (rectangle1) {
    const vertices = (rectangle1.instance as Rectangle).vertices;

    if (pointIntersectShape(
      vec2.fromValues(e.clientX - x, e.clientY - y),
      vertices,
      vec2.fromValues(width, height)
    )) {
      (rectangle1.instance as Rectangle).color = vec4.fromValues(0.5, 1, 0.5, 1);
    } else {
      (rectangle1.instance as Rectangle).color = vec4.fromValues(1, 0.5, 0.5, 1);
    }
  }
});
