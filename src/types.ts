import { type mat3 } from 'gl-matrix';

export interface BasePrimitive {
  gl: WebGLRenderingContext;
  localMatrix: mat3,
  worldMatrix: mat3,
  draw(): void
  updateWorldMatrix(worldMatrix: mat3): void;
}

export interface PrimitiveBaseProperties {
  localMatrix: mat3,
  worldMatrix: mat3
}

export function isPrimitiveBaseProperties (props: unknown): props is PrimitiveBaseProperties {
  return !!props
    && typeof props === 'object'
    && 'localMatrix' in props
    && 'worldMatrix' in props
    && props.localMatrix instanceof Float32Array
    && props.localMatrix.length === 9
    && props.worldMatrix instanceof Float32Array
    && props.worldMatrix.length === 9
}

export const sceneDiscriminantType = {
  camera: 'camera',
  rectangle: 'rectangle'
} as const;

export interface SceneConfig {
  type: keyof typeof sceneDiscriminantType,
  properties: unknown,
  children?: readonly SceneConfig[] | undefined | null
}

export interface SceneNode {
  instance: BasePrimitive,
  children?: SceneNode[] | null | undefined
}

export function isSceneNode(node: unknown): node is SceneNode {
  return !!node
    && typeof node === 'object'
    && 'instance' in node
}
