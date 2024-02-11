import { isSceneNode, SceneConfig, sceneDiscriminantType, SceneNode } from '../types';
import { Camera, Rectangle } from '../primitives';
import { INCORRECT_PROPERTIES_IN_CONFIG, PRIMITIVE_DOES_NOT_EXIST, UNREACHABLE_STATE } from '../errors';

export class Scene {
  sceneNode: SceneNode;
  #loopId: number | null = null;

  constructor(
    private gl: WebGLRenderingContext,
    sceneConfig: SceneConfig
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

    if (config.type === sceneDiscriminantType.camera) {
      if (!Camera.runtimeCheckProperties(config.properties)) {
        throw new Error(INCORRECT_PROPERTIES_IN_CONFIG);
      }
      node.instance = new Camera(gl, config.properties);
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
  }

  private draw = (node: SceneNode, parent?: SceneNode) => {
    if (parent) {
      node.instance.updateWorld(parent.instance.world)
    }
    if (node.instance.draw) {
      node.instance.draw();
    }
    if (node.children) {
      node.children.forEach((childNode) => this.draw(childNode, node));
    }
  }

  #loop = () => {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.draw(this.sceneNode);
    this.#loopId = requestAnimationFrame(this.#loop);
  }
}
