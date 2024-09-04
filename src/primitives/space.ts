import { type PrimitiveBaseProperties } from '../types';
import {mat4, vec4} from 'gl-matrix';
import {resizeCanvasToDisplaySize} from "../graphical-tools/gl";

interface SpaceProps extends PrimitiveBaseProperties {
}

export class Space {
  gl: WebGLRenderingContext;
  color: vec4;
  worldMatrix: mat4 = mat4.create();

  constructor(
    gl: WebGLRenderingContext,
    { color }: SpaceProps
  ) {
    this.gl = gl;
    this.color  = color;
  }

  static runtimeCheckProperties(props: unknown): props is SpaceProps {
    return true;
  }

  draw() {
    resizeCanvasToDisplaySize(this.gl.canvas as HTMLCanvasElement);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.clearColor(...this.color as [number, number, number, number]);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
}
