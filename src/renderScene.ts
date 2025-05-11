import { SceneNode } from './core/SceneNode';
import { DrawableNode } from './core/DrawableNode';
import { GroupNode } from './core/GroupNode';
import { mat4 } from 'gl-matrix';

export function renderScene(gl: WebGL2RenderingContext, root: SceneNode, viewProjection: mat4) {
  function visit(node: SceneNode) {
    if (node instanceof DrawableNode) {
      node.render(gl, viewProjection);
    } else if (node instanceof GroupNode) {
      node.updateWorldMatrix();
      node.renderChildren(gl, viewProjection);
    } else {
      node.updateWorldMatrix();
      for (const child of node.children) visit(child);
    }
  }
  visit(root);
}
