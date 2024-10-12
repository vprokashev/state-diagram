import { Color, type SpaceProperties } from '../types';

export class Space implements SpaceProperties {
  public width: number
  public height: number
  public color: Color

  constructor(
    public gl: WebGLRenderingContext,
    spaceProps: SpaceProperties
  ) {
    this.width = spaceProps.width;
    this.height = spaceProps.height;
    this.color = spaceProps.color;
  }

  static runtimeCheckProperties(props: unknown): props is SpaceProperties {
    return true;
  }

  draw() {
    this.gl.canvas.width = this.width;
    this.gl.canvas.height = this.height;
    // resizeCanvasToDisplaySize(this.gl.canvas as HTMLCanvasElement);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.disable(this.gl.DEPTH_TEST);
    this.gl.clearColor(...this.color);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
}
