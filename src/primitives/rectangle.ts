import { compileShader, createProgram } from '../gl';
import { type vec2 } from 'gl-matrix';
import { FAILED_TO_CREATE_BUFFER } from '../errors';

export class Rectangle {
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  color = new Float32Array([ 1.0, 0.0, 0.0, 1.0 ]);

  gl: WebGLRenderingContext;
  #program: WebGLProgram;
  #buffer!: WebGLBuffer | null;
  #vertexShaderSource = `#version 300 es
    in vec2 a_position;
    uniform mat3 u_matrix;

    void main() {
      vec3 transformedPosition = u_matrix * vec3(a_position, 1.0);
      gl_Position = vec4(transformedPosition.xy, 0.0, 1.0);
    }
  `;
  #fragmentShaderSource = `#version 300 es
    precision mediump float;
    uniform vec4 u_color;
    out vec4 fragColor;

    void main() {
      fragColor = u_color;
    }
`;

  constructor(gl: WebGLRenderingContext, { v1, v2 }: { v1: [ number, number ], v2: [ number, number ] }) {
    this.gl = gl;
    if (v1 && v2) {
      this.x = v1[ 0 ];
      this.y = v1[ 1 ];
      this.width = v2[ 0 ];
      this.height = v2[ 1 ];
    }
    const vertexShader = compileShader(this.gl, this.#vertexShaderSource, this.gl.VERTEX_SHADER);
    const fragmentShader = compileShader(this.gl, this.#fragmentShaderSource, this.gl.FRAGMENT_SHADER);
    this.#program = createProgram(this.gl, vertexShader, fragmentShader);
    this.initBuffer(this.gl);
  }

  private initBuffer(gl: WebGLRenderingContext): void {
    const vertices = new Float32Array([
      0.0, 0.0,
      this.width, 0.0,
      0.0, this.height,
      0.0, this.height,
      this.width, 0.0,
      this.width, this.height
    ]);

    this.#buffer = gl.createBuffer();
    if (!this.#buffer) {
      throw new Error(FAILED_TO_CREATE_BUFFER);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.#buffer);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  draw(): void {
    this.gl.useProgram(this.#program);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.#buffer);

    const colorUniformLocation = this.gl.getUniformLocation(this.#program, 'u_color');
    this.gl.uniform4fv(colorUniformLocation, this.color);

    const positionAttributeLocation = this.gl.getAttribLocation(this.#program, 'a_position');
    this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(positionAttributeLocation);

    const matrixUniformLocation = this.gl.getUniformLocation(this.#program, 'u_matrix');
    const matrix = new Float32Array([
      this.width, 0, 0,
      0, this.height, 0,
      this.x, this.y, 1
    ]);
    this.gl.uniformMatrix3fv(matrixUniformLocation, false, matrix);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }
}
