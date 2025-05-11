export abstract class SceneNode {
  parent: SceneNode | null = null;
  children: SceneNode[] = [];

  add(child: SceneNode) {
    child.parent = this;
    this.children.push(child);
  }

  abstract updateWorldMatrix(force?: boolean): void;
}
