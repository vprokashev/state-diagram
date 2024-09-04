import {type mat4, vec4} from 'gl-matrix';
import {Space} from "./primitives";

export interface BasePrimitive {
  gl: WebGLRenderingContext;
  color: vec4,
  globalMatrix: mat4; // relative to viewport
  worldMatrix: mat4; // relative to outer coordinate system (for ex. gap between 2 elements)
  localMatrix: mat4; // relative to self coordinate system (for ex. shift of the center)
  draw(parentWorldMatrix: mat4): void
  calculateGlobalMatrix?(parentWorldMatrix: mat4): void
}

export interface PrimitiveBaseProperties {
  x: number,
  y: number,
  width: number,
  height: number,
  color: [number, number, number, number] | Float32Array
}

export const sceneDiscriminantType = {
  space: 'space',
  rectangle: 'rectangle'
} as const;

export interface SceneConfig {
  name?: string,
  type: keyof typeof sceneDiscriminantType,
  properties: PrimitiveBaseProperties,
  children?: readonly SceneConfig[] | undefined | null
}

export interface SceneNode {
  name: string,
  type: keyof typeof sceneDiscriminantType,
  instance: BasePrimitive | Space,
  children?: SceneNode[] | null | undefined
}

export function isSceneNode(node: unknown): node is SceneNode {
  return !!node
    && typeof node === 'object'
    && 'instance' in node;
}
