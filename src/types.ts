import { type mat3, type vec4 } from 'gl-matrix';

export interface PrimitiveParams {
  localMatrix: mat3,
  worldMatrix: mat3,
  color: vec4
}

export const sceneDiscriminantType = {
  world: 'world',
  rectangle: 'rectangle'
} as const;

export interface BaseScene {
  type: keyof typeof sceneDiscriminantType,
  properties: PrimitiveParams,
  children?: readonly BaseScene[] | undefined | null
}
