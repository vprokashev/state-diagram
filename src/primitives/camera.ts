import { type BasePrimitive, isPrimitiveBaseProperties, type PrimitiveBaseProperties, sceneDiscriminantType } from '../types';
import { mat3 } from 'gl-matrix';

interface CameraProps extends PrimitiveBaseProperties {
}

export class Camera implements BasePrimitive {
  gl: WebGLRenderingContext;
  local: mat3;
  world: mat3;

  constructor(
    gl: WebGLRenderingContext,
    { local, world }: CameraProps
  ) {
    this.gl = gl;
    this.local = local;
    this.world = world;
  }

  static runtimeCheckProperties(props: unknown): props is CameraProps {
    return isPrimitiveBaseProperties(props);
  }

  updateWorld(parentWorld?: mat3) {
    if (parentWorld) {
      mat3.multiply(this.world, parentWorld, this.world);
    }
  }
}
