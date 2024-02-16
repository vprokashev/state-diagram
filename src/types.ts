import { type mat3, type vec2 } from 'gl-matrix';

export interface BasePrimitive {
  gl: WebGLRenderingContext;
  scale: vec2,
  translation: vec2,
  draw?(translation: vec2): void
}

export interface PrimitiveBaseProperties {
  scale: vec2;
  translation: vec2;
}

export function isPrimitiveBaseProperties(props: unknown): props is PrimitiveBaseProperties {
  return !!props
    && typeof props === 'object'
    && 'scale' in props
    && 'translation' in props
    && props.scale instanceof Float32Array
    && props.scale.length === 2
    && props.translation instanceof Float32Array
    && props.translation.length === 2;
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
    && 'instance' in node;
}
