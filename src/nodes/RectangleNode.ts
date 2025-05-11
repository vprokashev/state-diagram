import { DrawableNode } from '../core/DrawableNode';
import { RectangleRenderer } from '../renderer/rectangle/RectangleRenderer';
import { mat4 } from 'gl-matrix';

export class RectangleNode extends DrawableNode {
  private renderer: RectangleRenderer;

  constructor(renderer: RectangleRenderer) {
    super();
    this.renderer = renderer;
  }

  render(gl: WebGL2RenderingContext, viewProjection: mat4): void {
    this.updateWorldMatrix();
    const mvp = mat4.create();
    mat4.multiply(mvp, viewProjection, this.worldMatrix);
    this.renderer.render(mvp);
  }
}
