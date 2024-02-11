import { initGL } from './gl';
import { mat3, vec2, vec4 } from 'gl-matrix';
import { Scene } from './scene';
import { SceneConfig, sceneDiscriminantType } from './types';
import { getFirstNode } from './scene/tools';
import { Rectangle } from './primitives';

const gl = initGL();

const sceneConfig = {
  type: sceneDiscriminantType.camera,
  properties: {
    local: mat3.create(),
    world: mat3.create()
  },
  children: [
    {
      type: sceneDiscriminantType.rectangle,
      properties: {
        local: mat3.fromScaling(mat3.create(), vec2.fromValues(0.1, 0.1)),
        world: mat3.fromTranslation(mat3.create(), vec2.fromValues(-1, -1)),
        color: vec4.fromValues(1, 0.5, 0.5, 1)
      }
    },
    {
      type: sceneDiscriminantType.rectangle,
      properties: {
        local: mat3.fromScaling(mat3.create(), vec2.fromValues(0.2, 0.2)),
        world: mat3.fromTranslation(mat3.create(), vec2.fromValues(0, 0)),
        color: vec4.fromValues(1, 1, 0, 1)
      }
    }
  ]
} satisfies SceneConfig;

const scene = new Scene(gl, sceneConfig);
scene.start();

const rectangle = getFirstNode(scene.sceneNode, (node) => node.instance instanceof Rectangle && node.instance.color[1] === 1);

document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (rectangle) {
    if (e.key === 'ArrowLeft') {
      mat3.translate(rectangle.instance.world, rectangle.instance.world, vec2.fromValues(-0.01, 0));
    } else if (e.key === 'ArrowRight') {
      mat3.translate(rectangle.instance.world, rectangle.instance.world, vec2.fromValues(0.01, 0));
    } else if (e.key === 'ArrowUp') {
      mat3.translate(rectangle.instance.world, rectangle.instance.world, vec2.fromValues(0, 0.01));
    } else if (e.key === 'ArrowDown') {
      mat3.translate(rectangle.instance.world, rectangle.instance.world, vec2.fromValues(0, -0.01));
    }
  }
});
