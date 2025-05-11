import { RectangleGeometry } from '../../geometry/RectangleGeometry';
import { mat4 } from 'gl-matrix';
import { compileShader, createProgram } from '../../utils/gl';
import vertexShaderSource from './rectangle.vert';
import fragmentShaderSource from './rectangle.frag';

export class RectangleRenderer {
  private readonly gl: WebGL2RenderingContext;
  private readonly program: WebGLProgram;
  private readonly positionBuffer: WebGLBuffer;
  private readonly vao: WebGLVertexArrayObject;
  private readonly uProjectionLoc: WebGLUniformLocation;
  private readonly uColorLoc: WebGLUniformLocation;

  constructor(gl: WebGL2RenderingContext, geometry: RectangleGeometry) {
    this.gl = gl;
    const vertexShader = compileShader(this.gl, vertexShaderSource, this.gl.VERTEX_SHADER);
    const fragmentShader = compileShader(this.gl, fragmentShaderSource, this.gl.FRAGMENT_SHADER);
    this.program = createProgram(this.gl, vertexShader, fragmentShader);

    this.uProjectionLoc = gl.getUniformLocation(this.program, 'uProjection')!;
    this.uColorLoc = gl.getUniformLocation(this.program, 'uColor')!;

    this.positionBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(this.program, 'aPosition');

    this.vao = gl.createVertexArray()!;
    gl.bindVertexArray(this.vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);
  }

  public render(modelViewProjection: mat4): void {
    const gl = this.gl;
    gl.useProgram(this.program);

    gl.bindVertexArray(this.vao);
    gl.uniformMatrix4fv(this.uProjectionLoc, false, modelViewProjection);
    gl.uniform4f(this.uColorLoc, 0.0, 0.0, 0.5, 1.0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);
  }
}
