import { type BasePrimitive, isPrimitiveBaseProperties, type PrimitiveBaseProperties, sceneDiscriminantType } from '../types';
import { mat3 } from 'gl-matrix';

interface SpaceProps extends PrimitiveBaseProperties {
}

export class Space implements BasePrimitive {
  gl: WebGLRenderingContext;
  local: mat3;
  world: mat3;

  constructor(
    gl: WebGLRenderingContext,
    { local, world }: SpaceProps
  ) {
    this.gl = gl;
    this.local = local;
    this.world = world;
  }

  static runtimeCheckProperties(props: unknown): props is SpaceProps {
    return isPrimitiveBaseProperties(props);
  }

  updateWorld(parentWorld?: mat3) {
    if (parentWorld) {
      mat3.multiply(this.world, parentWorld, this.world);
    }
  }
}
