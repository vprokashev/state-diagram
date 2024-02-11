import { type BasePrimitive, isPrimitiveBaseProperties, type PrimitiveBaseProperties } from '../types';
import { mat3, vec2 } from 'gl-matrix';

interface CameraProps extends PrimitiveBaseProperties {
}

export class Camera implements BasePrimitive {
  gl: WebGLRenderingContext;
  localMatrix: mat3;
  worldMatrix: mat3;

  constructor(
    gl: WebGLRenderingContext,
    { localMatrix, worldMatrix }: CameraProps
  ) {
    this.gl = gl;
    this.localMatrix = localMatrix;
    this.worldMatrix = worldMatrix;

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        mat3.translate(this.worldMatrix, this.worldMatrix, vec2.fromValues(-0.01, 0));
      } else if (e.key === 'ArrowRight') {
        mat3.translate(this.worldMatrix, this.worldMatrix, vec2.fromValues(0.01, 0));
      } else if (e.key === 'ArrowTop') {
        mat3.translate(this.worldMatrix, this.worldMatrix, vec2.fromValues(0, 0.01));
      } else if (e.key === 'ArrowBottom') {
        mat3.translate(this.worldMatrix, this.worldMatrix, vec2.fromValues(0, -0.01));
      }
      console.log(this.worldMatrix);
    });
  }

  static runtimeCheckProperties(props: unknown): props is CameraProps {
    return isPrimitiveBaseProperties(props);
  }

  updateWorldMatrix(parentWorldMatrix?: mat3) {
    if (parentWorldMatrix) {
      mat3.multiply(this.worldMatrix, parentWorldMatrix, this.worldMatrix);
    }
  }
}
