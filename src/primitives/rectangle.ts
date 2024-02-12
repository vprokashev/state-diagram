import { compileShader, createProgram } from '../gl';
import { mat3, vec4 } from 'gl-matrix';
import { FAILED_TO_CREATE_BUFFER } from '../errors';
import { type BasePrimitive, isPrimitiveBaseProperties, type PrimitiveBaseProperties } from '../types';

interface RectangleProps extends PrimitiveBaseProperties {
  color: vec4
}

export class Rectangle implements BasePrimitive {
  local: mat3;
  world: mat3;
  color: vec4;

  gl: WebGLRenderingContext;
  #program: WebGLProgram;
  #buffer!: WebGLBuffer | null;

  setVertices(x:number, y:number, width: number, height: number) {
    const x1 = x;
    const x2 = x + width;
    const y1 = y;
    const y2 = y + height;
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2,
    ]), this.gl.STATIC_DRAW);
  }

  updateVertices(x:number, y:number, width: number, height: number) {
    const x1 = x;
    const x2 = x + width;
    const y1 = y;
    const y2 = y + height;
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2,
    ]));
  }

  readonly vertexShaderSource = `#version 300 es
    in vec2 a_position;
    uniform mat3 u_local;
    uniform mat3 u_world;
    uniform vec2 u_resolution;

    void main() {
      vec2 zeroToOne = a_position.xy / u_resolution;
      vec2 zeroToTwo = zeroToOne * 2.0;
      vec2 clipSpace = zeroToTwo - 1.0;
      gl_Position = vec4(clipSpace, 0, 1);
    }
  `;

  readonly fragmentShaderSource = `#version 300 es
    precision mediump float;
    uniform vec4 u_color;
    out vec4 fragColor;

    void main() {
      fragColor = u_color;
    }
`;

  constructor(gl: WebGLRenderingContext, { local, world, color }: RectangleProps) {
    this.gl = gl;
    this.local = local;
    this.world = world;
    this.color = color;
    const vertexShader = compileShader(this.gl, this.vertexShaderSource, this.gl.VERTEX_SHADER);
    const fragmentShader = compileShader(this.gl, this.fragmentShaderSource, this.gl.FRAGMENT_SHADER);
    this.#program = createProgram(this.gl, vertexShader, fragmentShader);
    this.initBuffer(gl);
  }

  private initBuffer(gl: WebGLRenderingContext) {
    this.#buffer = gl.createBuffer();
    if (!this.#buffer) {
      throw new Error(FAILED_TO_CREATE_BUFFER);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.#buffer);
    this.setVertices(10, 20, 70, 30);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  static runtimeCheckProperties(props: unknown): props is RectangleProps {
    return isPrimitiveBaseProperties(props)
      && 'color' in props
      && props.color instanceof Float32Array
      && props.color.length === 4;
  }

  draw(): void {
    this.gl.useProgram(this.#program);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.#buffer);

    this.updateVertices(10, 10, 200, 300);

    const colorUniformLocation = this.gl.getUniformLocation(this.#program, 'u_color');
    this.gl.uniform4fv(colorUniformLocation, this.color);

    const positionAttributeLocation = this.gl.getAttribLocation(this.#program, 'a_position');
    this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(positionAttributeLocation);

    const resolutionUniformLocation = this.gl.getUniformLocation(this.#program, 'u_resolution');
    this.gl.uniform2f(resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);

    const localUniformLocation = this.gl.getUniformLocation(this.#program, 'u_local');
    this.gl.uniformMatrix3fv(localUniformLocation, false, this.local);

    const worldUniformLocation = this.gl.getUniformLocation(this.#program, 'u_world');
    this.gl.uniformMatrix3fv(worldUniformLocation, false, this.world);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

    this.gl.useProgram(null);
  }

  updateWorld(parentWorld?: mat3) {
    if (parentWorld) {
      mat3.multiply(this.world, parentWorld, this.world);
    }
  }
}
