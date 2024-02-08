import { compileShader, createProgram } from '../gl';
import { type vec2 } from 'gl-matrix';
import { FAILED_TO_CREATE_BUFFER } from '../errors';

export class Rectangle {
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  color = new Float32Array([1.0, 0.0, 0.0, 1.0]);

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

  constructor(gl: WebGLRenderingContext, x?: number, y?: number, v?: vec2) {
    if (x && y && v) {
      this.x = x;
      this.y = y;
      this.width = v[ 0 ];
      this.height = v[ 1 ]
    }
    const vertexShader = compileShader(gl, this.#vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, this.#fragmentShaderSource, gl.FRAGMENT_SHADER);
    this.#program = createProgram(gl, vertexShader, fragmentShader);
    this.initBuffer(gl);
  }

  private initBuffer(gl: WebGLRenderingContext): void {
    const vertices = new Float32Array([
      0.0, 0.0,
      this.width, 0.0,
      0.0, this.height,
      0.0, this.height,
      this.width, 0.0,
      this.width, this.height,
    ]);

    this.#buffer = gl.createBuffer();
    if (!this.#buffer) {
      throw new Error(FAILED_TO_CREATE_BUFFER);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.#buffer);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  draw(gl: WebGLRenderingContext): void {
    gl.useProgram(this.#program);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.#buffer);

    const colorUniformLocation = gl.getUniformLocation(this.#program, 'u_color');
    gl.uniform4fv(colorUniformLocation, this.color);

    const positionAttributeLocation = gl.getAttribLocation(this.#program, 'a_position');
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttributeLocation);

    const matrixUniformLocation = gl.getUniformLocation(this.#program, 'u_matrix');
    const matrix = new Float32Array([
      this.width, 0, 0,
      0, this.height, 0,
      this.x, this.y, 1,
    ]);
    gl.uniformMatrix3fv(matrixUniformLocation, false, matrix);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
}
