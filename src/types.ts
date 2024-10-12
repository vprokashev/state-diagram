import {type mat4, vec4} from 'gl-matrix';
import {Space} from "./primitives";
import { Camera, CamerasNames } from './camera/types';

export type Color = [ number, number, number, number ];

export interface BasePrimitive {
  gl: WebGLRenderingContext;
  color: vec4,
  scale: [ number, number ];
  position: [ number, number ];
  draw(origin: [ number, number ], camera: Camera): void
}

export interface SpaceProperties {
  width: number,
  height: number,
  color: Color
}

export interface PrimitiveBaseProperties {
  position: [ number, number ],
  scale: [ number, number ]
  color: [number, number, number, number] | Float32Array
}

export const sceneDiscriminantType = {
  space: 'space',
  rectangle: 'rectangle'
} as const;

export interface SceneConfig {
  name?: string,
  type: keyof typeof sceneDiscriminantType,
  properties: PrimitiveBaseProperties | SpaceProperties,
  children?: readonly SceneConfig[] | undefined | null,
  actions?: {
    [name: string]: (ts: number) => void
  }
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
