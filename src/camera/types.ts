import { Simple2D } from './simple2D';

export interface Camera {
  w: number;
  h: number;
  get view(): Float32Array
}

export type CamerasNames = 'Simple2D'
