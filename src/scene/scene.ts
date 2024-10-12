import { isSceneNode, SceneConfig, sceneDiscriminantType, SceneNode } from '../types';
import { Space, Rectangle } from '../primitives';
import { INCORRECT_PROPERTIES_IN_CONFIG, PRIMITIVE_DOES_NOT_EXIST, UNREACHABLE_STATE } from '../errors';
import { Camera } from '../camera/types';

export class Scene {
  sceneNode: SceneNode;
  #loopId: number | null = null;

  constructor(
    public gl: WebGLRenderingContext,
    public sceneConfig: SceneConfig,
    public camera: Camera
  ) {
    this.sceneNode = Scene.createSceneNodeByConfig(gl, sceneConfig);
  }

  public start() {
    this.#loopId = requestAnimationFrame(this.#loop);
  }

  public stop() {
    if (this.#loopId) {
      cancelAnimationFrame(this.#loopId);
      this.#loopId = null;
    }
  }

  static createSceneNodeByConfig = (gl: WebGLRenderingContext, config: SceneConfig): SceneNode => {
    let node: Partial<SceneNode> = {};

    node.type = config.type;
    if (config.name) {
      node.name = config.name;
    }

    if (config.type === sceneDiscriminantType.space) {
      if (!Space.runtimeCheckProperties(config.properties)) {
        throw new Error(INCORRECT_PROPERTIES_IN_CONFIG);
      }
      node.instance = new Space(gl, config.properties);
    } else if (config.type === sceneDiscriminantType.rectangle) {
      if (!Rectangle.runtimeCheckProperties(config.properties)) {
        throw new Error(INCORRECT_PROPERTIES_IN_CONFIG);
      }
      node.instance = new Rectangle(gl, config.properties);
    } else {
      throw new Error(PRIMITIVE_DOES_NOT_EXIST);
    }

    if (config.children) {
      node.children = config.children.map((childConfig) => Scene.createSceneNodeByConfig(gl, childConfig));
    }

    if (isSceneNode(node)) {
      return node;
    }

    throw new Error(UNREACHABLE_STATE);
  };

  private draw = (node: SceneNode, parent?: SceneNode) => {
    if (node.instance instanceof Space) {
      node.instance.draw();
    } else if (parent && 'position' in parent.instance) {
      node.instance.draw(parent.instance.position, this.camera);
    } else {
      node.instance.draw([ 0, 0 ], this.camera)
    }
    if (node.children) {
      node.children.forEach((childNode) => this.draw(childNode, node));
    }
  };

  #loop = () => {
    this.draw(this.sceneNode);
    this.#loopId = requestAnimationFrame(this.#loop);
  };
}
