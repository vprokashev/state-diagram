import { isSceneNode, SceneConfig, sceneDiscriminantType, SceneNode } from './types';
import { Rectangle } from './primitives/rectangle';
import { Camera } from './primitives/camera';
import { INCORRECT_PROPERTIES_IN_CONFIG, PRIMITIVE_DOES_NOT_EXIST, UNREACHABLE_STATE } from './errors';

export class Scene {
  private scene: SceneNode;

  constructor(
    private gl: WebGLRenderingContext,
    sceneConfig: SceneConfig
  ) {
    this.scene = this.createSceneNodeByConfig(sceneConfig);
  }

  private createSceneNodeByConfig(config: SceneConfig): SceneNode {
    let node: Partial<SceneNode> = {};

    if (config.type === sceneDiscriminantType.camera) {
      if (!Camera.runtimeCheckProperties(config.properties)) {
        throw new Error(INCORRECT_PROPERTIES_IN_CONFIG);
      }
      node.instance = new Camera(this.gl, config.properties);
    } else if (config.type === sceneDiscriminantType.rectangle) {
      if (!Rectangle.runtimeCheckProperties(config.properties)) {
        throw new Error(INCORRECT_PROPERTIES_IN_CONFIG);
      }
      node.instance = new Rectangle(this.gl, config.properties);
    } else {
      throw new Error(PRIMITIVE_DOES_NOT_EXIST);
    }

    if (config.children) {
      node.children = config.children.map(this.createSceneNodeByConfig);
    }

    if (isSceneNode(node)) {
      return node;
    }

    throw new Error(UNREACHABLE_STATE);
  }

  draw() {
    drawRecursive(this.scene);
    function drawRecursive(node: SceneNode, parent?: SceneNode) {
      if (parent) {
        node.instance.updateWorldMatrix(parent.instance.worldMatrix)
      }
      node.instance.draw();
      if (node.children) {
        node.children.forEach((childNode) => drawRecursive(childNode, node));
      }
    }
  }
}
