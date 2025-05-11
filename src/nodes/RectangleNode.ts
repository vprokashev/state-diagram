import { DrawableNode } from '../core/DrawableNode';
import { RectangleRenderer } from '../renderer/rectangle/RectangleRenderer';
import {mat4, ReadonlyVec4} from 'gl-matrix';

export class RectangleNode extends DrawableNode {
  private renderer: RectangleRenderer;
  public isHovered = false;

  constructor(renderer: RectangleRenderer) {
    super();
    this.size = [renderer.geometry.width, renderer.geometry.height];
    this.renderer = renderer;
  }

  render(gl: WebGL2RenderingContext, viewProjection: mat4): void {
    this.updateWorldMatrix();
    const mvp = mat4.create();
    mat4.multiply(mvp, viewProjection, this.worldMatrix);
    const color = this.isHovered ? [1.0, 0.2, 0.2, 1.0] : [0.5, 0.5, 0.5, 1.0];
    this.renderer.render(mvp, color as unknown as ReadonlyVec4);
  }
}
