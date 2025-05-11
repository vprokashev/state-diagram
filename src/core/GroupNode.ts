import { TransformNode } from './TransformNode';
import { mat4 } from 'gl-matrix';

export class GroupNode extends TransformNode {
  renderChildren(gl: WebGL2RenderingContext, viewProjection: mat4) {
    for (const child of this.children) {
      if ('render' in child && typeof child.render === 'function') {
        (child as any).render(gl, viewProjection);
      } else if ('renderChildren' in child && typeof child.renderChildren === 'function') {
        (child as any).renderChildren(gl, viewProjection);
      }
    }
  }
}
