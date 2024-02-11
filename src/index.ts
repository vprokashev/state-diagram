import { initGL } from './gl';
import { mat3, vec2, vec4 } from 'gl-matrix';
import { Scene } from './scene';
import { SceneConfig, sceneDiscriminantType } from './types';

const gl = initGL();
// mat3.translate(rectangle1.worldMatrix, rectangle1.worldMatrix, vec2.fromValues(0.001, 0.001));
// mat3.translate(rectangle2.worldMatrix, rectangle2.worldMatrix, vec2.fromValues(0.002, 0.002));

const sceneConfig: SceneConfig = {
  type: sceneDiscriminantType.camera,
  properties: {
    localMatrix: mat3.create(),
    worldMatrix: mat3.create()
  },
  children: [
    {
      type: sceneDiscriminantType.rectangle,
      properties: {
        localMatrix: mat3.fromScaling(mat3.create(), vec2.fromValues(0.2, 0.2)),
        worldMatrix: mat3.fromTranslation(mat3.create(), vec2.fromValues(0, 0)),
        color: vec4.fromValues(1, 1, 0, 1)
      }
    },
    {
      type: sceneDiscriminantType.rectangle,
      properties: {
        localMatrix: mat3.fromScaling(mat3.create(), vec2.fromValues(0.1, 0.1)),
        worldMatrix: mat3.fromTranslation(mat3.create(), vec2.fromValues(-1, -1)),
        color: vec4.fromValues(1, 0.5, 0.5, 1)
      }
    }
  ]
};

const scene = new Scene(gl, sceneConfig);
scene.start();
