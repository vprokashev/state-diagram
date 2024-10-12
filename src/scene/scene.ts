import { isSceneNode, SceneConfig, sceneDiscriminantType, SceneNode } from '../types';
import { Space, Rectangle } from '../primitives';
import { INCORRECT_PROPERTIES_IN_CONFIG, PRIMITIVE_DOES_NOT_EXIST, UNREACHABLE_STATE } from '../errors';
import { resizeCanvasToDisplaySize } from '../graphical-tools/gl';
import { vec2, mat4 } from 'gl-matrix';

export class Scene {
  sceneNode: SceneNode;
  #loopId: number | null = null;
  viewProjectionMatrix: mat4;

  constructor(
    private gl: WebGLRenderingContext,
    sceneConfig: SceneConfig
  ) {
    this.sceneNode = Scene.createSceneNodeByConfig(gl, sceneConfig);

    //camera
    let cameraAngleRadians = 0;
    let fieldOfViewRadians = 1.0472; // 60 degree
    let cameraHeight = 50;
    let aspect = 640 / 480;
    let projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfViewRadians, aspect, 1, 2000);
    let cameraPosition = [0, -200, 0] as const;
    let target = [0, 0, 0] as const;
    let up = [0, 0, 1] as const;
    let cameraMatrix = mat4.create();
    mat4.lookAt(cameraMatrix, cameraPosition, target, up);
    let viewMatrix = mat4.create();
    mat4.invert(viewMatrix, cameraMatrix);
    this.viewProjectionMatrix = mat4.create();
    mat4.multiply(this.viewProjectionMatrix, projectionMatrix, viewMatrix);
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
    if (!parent) {
      (node.instance as Space).draw();
    } else {
      const worldMatrix = parent?.instance?.worldMatrix;
      if (worldMatrix) {
        node.instance.draw(worldMatrix);
      }
    }
    if (node.children) {
      node.children.forEach((childNode) => this.draw(childNode, node));
    }
  };

  #loop = () => {
    this.draw(this.sceneNode);
    //this.#loopId = requestAnimationFrame(this.#loop);
  };
}
