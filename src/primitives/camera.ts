import { type BasePrimitive, isPrimitiveBaseProperties, type PrimitiveBaseProperties } from '../types';
import { mat3 } from 'gl-matrix';

interface CameraProps extends PrimitiveBaseProperties {}

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
  }

  static runtimeCheckProperties(props: unknown): props is CameraProps {
    return isPrimitiveBaseProperties(props);
  }

  draw() {

  }

  updateWorldMatrix(worldMatrix:mat3) {

  }
}
