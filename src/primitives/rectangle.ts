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

  readonly defaultVertices = new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0
  ]);

  readonly vertexShaderSource = `#version 300 es
    in vec2 a_position;
    uniform mat3 u_local;
    uniform mat3 u_world;

    void main() {
      vec3 localPosition = u_local * vec3(a_position, 1.0);
      vec3 transformedPosition = u_world * localPosition;
      gl_Position = vec4(transformedPosition.xy, 0.0, 1.0);
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
    gl.bufferData(gl.ARRAY_BUFFER, this.defaultVertices, gl.STATIC_DRAW);
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

    const colorUniformLocation = this.gl.getUniformLocation(this.#program, 'u_color');
    this.gl.uniform4fv(colorUniformLocation, this.color);

    const positionAttributeLocation = this.gl.getAttribLocation(this.#program, 'a_position');
    this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(positionAttributeLocation);

    const localUniformLocation = this.gl.getUniformLocation(this.#program, 'u_local');
    this.gl.uniformMatrix3fv(localUniformLocation, false, this.local);

    const worldUniformLocation = this.gl.getUniformLocation(this.#program, 'u_world');
    this.gl.uniformMatrix3fv(worldUniformLocation, false, this.world);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  updateWorld(parentWorld?: mat3) {
    if (parentWorld) {
      mat3.multiply(this.world, parentWorld, this.world);
    }
  }
}
