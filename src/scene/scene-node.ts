import type { BasePrimitive } from '../types';
import { mat3 } from 'gl-matrix';

class SceneNode {
  children!: SceneNode[];

  constructor(
    public instance: BasePrimitive
  ) {

  }

  updateWorld(parentWorld?: mat3) {
    if (parentWorld) {
      mat3.multiply(
        this.instance.world,
        parentWorld,
        this.instance.world
      );
    }
  }
}
