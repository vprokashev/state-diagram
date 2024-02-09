import { BaseScene, sceneDiscriminantType } from './types';
import { Rectangle } from './primitives/rectangle';
import { World } from './primitives/world';
import { PRIMITIVE_DOES_NOT_EXIST } from './errors';
import { initGL } from './gl';

const primitives = {
  [ sceneDiscriminantType.world ]: World,
  [ sceneDiscriminantType.rectangle ]: Rectangle
}

export class Scene {
  constructor(scene: BaseScene) {
    if (!primitives[ scene.type ]) {
      throw new Error(PRIMITIVE_DOES_NOT_EXIST);
    }
    const gl = initGL();
    // const node = new primitives[ scene.type ](gl, scene.properties);

  }

  draw() {

  }
}
