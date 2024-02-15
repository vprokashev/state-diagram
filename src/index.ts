import { initGL } from './gl';
import { mat3, vec2, vec4 } from 'gl-matrix';
import { Scene } from './scene';
import { SceneConfig, sceneDiscriminantType } from './types';
import { getFirstNode } from './scene/tools';
import { Rectangle } from './primitives';
import { createTransformMatrix, pointIntersectShape } from './math';

const gl = initGL();

const sceneConfig = {
  type: sceneDiscriminantType.space,
  properties: {
    scale: vec2.create(),
    translation: vec2.create()
  },
  children: [
    {
      type: sceneDiscriminantType.rectangle,
      properties: {
        scale: vec2.fromValues(0.3, 0.3),
        translation: vec2.fromValues(-0.5, -0.5),
        color: vec4.fromValues(1, 0.5, 0.5, 1)
      }/*,
      children: [
        {
          type: sceneDiscriminantType.rectangle,
          properties: {
            local: mat3.fromScaling(mat3.create(), vec2.fromValues(0.2, 0.2)),
            world: mat3.fromTranslation(mat3.create(), vec2.fromValues(0, 0)),
            color: vec4.fromValues(1, 1, 0, 1)
          }
        }
      ]*/
    }
  ]
} satisfies SceneConfig;

const scene = new Scene(gl, sceneConfig);
scene.start();

const rectangle = getFirstNode(scene.sceneNode, (node) => node.instance instanceof Rectangle);

document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (rectangle) {
    if (e.key === 'ArrowLeft') {
      vec2.add(rectangle.instance.translation, vec2.fromValues(-0.01, 0), rectangle.instance.translation);
    } else if (e.key === 'ArrowRight') {
      vec2.add(rectangle.instance.translation, vec2.fromValues(0.01, 0), rectangle.instance.translation);
    } else if (e.key === 'ArrowUp') {
      vec2.add(rectangle.instance.translation, vec2.fromValues(0, 0.01), rectangle.instance.translation);
    } else if (e.key === 'ArrowDown') {
      vec2.add(rectangle.instance.translation, vec2.fromValues(0, -0.01), rectangle.instance.translation);
    }
  }
});

const canvas = document.getElementById('canvas');
if (canvas) {
  const { x, y, width, height } = canvas.getBoundingClientRect();
  canvas.addEventListener('mousemove', (e: MouseEvent) => {
    if (rectangle) {
      if (pointIntersectShape(
        vec2.fromValues(e.clientX - x, e.clientY - y),
        (rectangle.instance as Rectangle).vertices,
        createTransformMatrix(rectangle.instance.translation, rectangle.instance.scale),
        vec2.fromValues(width, height)
      )) {
        (rectangle.instance as Rectangle).color = vec4.fromValues(0.5, 1, 0.5, 1);
      } else {
        (rectangle.instance as Rectangle).color = vec4.fromValues(1, 0.5, 0.5, 1);
      }
    }
  });
}
