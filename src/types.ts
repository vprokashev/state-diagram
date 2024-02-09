export const sceneDiscriminantType = {
  world: 'world',
  rectangle: 'rectangle'
} as const;

export interface BaseScene {
  type: keyof typeof sceneDiscriminantType,
  properties: any,
  children?: readonly BaseScene[] | undefined | null
}
