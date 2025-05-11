import { mat4 } from 'gl-matrix';
import { TransformNode } from './TransformNode';

export abstract class DrawableNode extends TransformNode {
  abstract render(gl: WebGL2RenderingContext, viewProjection: mat4): void;
}
