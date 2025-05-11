import { mat4, vec3 } from 'gl-matrix';
import { SceneNode } from './SceneNode';

export class TransformNode extends SceneNode {
  position = vec3.create();
  scale = vec3.fromValues(1, 1, 1);
  rotation = 0;

  localMatrix = mat4.create();
  worldMatrix = mat4.create();

  protected _dirty = true;

  updateLocalMatrix() {
    mat4.identity(this.localMatrix);
    mat4.translate(this.localMatrix, this.localMatrix, this.position);
    mat4.rotateZ(this.localMatrix, this.localMatrix, this.rotation);
    mat4.scale(this.localMatrix, this.localMatrix, this.scale);
    this._dirty = true;
  }

  updateWorldMatrix(force = false): void {
    if (this._dirty || force) {
      if (this.parent instanceof TransformNode) {
        mat4.multiply(this.worldMatrix, this.parent.worldMatrix, this.localMatrix);
      } else {
        mat4.copy(this.worldMatrix, this.localMatrix);
      }
      this._dirty = false;
    }

    for (const child of this.children) {
      child.updateWorldMatrix(force);
    }
  }
}
