import { type mat3 } from 'gl-matrix';

export interface BasePrimitive {
  gl: WebGLRenderingContext;
  world: mat3,
  local: mat3,
  draw?(): void
  updateWorld(parentworld?: mat3): void;
}

export interface PrimitiveBaseProperties {
  world: mat3,
  local: mat3
}

export function isPrimitiveBaseProperties (props: unknown): props is PrimitiveBaseProperties {
  return !!props
    && typeof props === 'object'
    && 'local' in props
    && 'world' in props
    && props.local instanceof Float32Array
    && props.local.length === 9
    && props.world instanceof Float32Array
    && props.world.length === 9
}

export const sceneDiscriminantType = {
  space: 'space',
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
