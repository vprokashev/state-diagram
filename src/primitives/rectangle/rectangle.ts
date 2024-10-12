import { bindUniforms, compileShader, createProgram } from '../../graphical-tools/gl';
import {mat4, vec4} from 'gl-matrix';
import { FAILED_TO_CREATE_BUFFER } from '../../errors';
import { type BasePrimitive, type PrimitiveBaseProperties } from '../../types';
import vertexShaderSource from './rectangle.vert';
import fragmentShaderSource from './rectangle.frag';
import { getRectangleVertices } from './lib';

type UniformVariable = Record<'color' | 'worldMatrix', WebGLUniformLocation>;

interface RectangleProps extends PrimitiveBaseProperties {
}

export class Rectangle implements BasePrimitive {
  localMatrix: mat4;
  worldMatrix: mat4;
  globalMatrix: mat4;
  color: vec4;
  vertices!: Float32Array;

  gl: WebGLRenderingContext;
  readonly #program: WebGLProgram;
  #buffer!: WebGLBuffer | null;
  #uniformLocation: UniformVariable;

  constructor(gl: WebGLRenderingContext, props: RectangleProps) {
    this.gl = gl;
    this.color = props.color;
    this.globalMatrix = mat4.create();

    this.worldMatrix = mat4.create();
    mat4.translate(this.worldMatrix, this.worldMatrix, [ props.x, props.y, 0 ]);
    mat4.scale(this.worldMatrix, this.worldMatrix, [ props.width, props.height, 0 ]);
    this.localMatrix = mat4.create();

    const vertexShader = compileShader(this.gl, vertexShaderSource, this.gl.VERTEX_SHADER);
    const fragmentShader = compileShader(this.gl, fragmentShaderSource, this.gl.FRAGMENT_SHADER);
    this.#program = createProgram(this.gl, vertexShader, fragmentShader);
    this.#uniformLocation = bindUniforms<UniformVariable>(
      gl,
      this.#program,
      {
        color: 'uColor',
        worldMatrix: 'uWorld'
      }
    );
    this.initBuffer(gl);
  }

  private initBuffer(gl: WebGLRenderingContext) {
    this.#buffer = gl.createBuffer();
    if (!this.#buffer) {
      throw new Error(FAILED_TO_CREATE_BUFFER);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.#buffer);
    this.vertices = getRectangleVertices();
    window.mLog(this.vertices, 2);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  static runtimeCheckProperties(props: unknown): props is RectangleProps {
    return true;
  }

  draw(parentWorldMatrix: mat4): void {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    this.gl.useProgram(this.#program);
    this.gl.uniform4fv(this.#uniformLocation.color, this.color);

    const normalization = new Float32Array([
      2 / 640, 0, 0, 0,
      0, 2 / 480, 0, 0,
      0, 0, 1, 0,
      -1, -1, 0, 1
    ]);

    mat4.multiply(this.globalMatrix, normalization, parentWorldMatrix);
    mat4.multiply(this.globalMatrix, parentWorldMatrix, this.globalMatrix);
    mat4.multiply(this.globalMatrix, normalization, this.globalMatrix);
window.mLog(this.globalMatrix);
    this.gl.uniformMatrix4fv(this.#uniformLocation.worldMatrix, false, this.globalMatrix);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.#buffer);
    const positionAttributeLocation = this.gl.getAttribLocation(this.#program, 'aPosition');
    this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(positionAttributeLocation);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length / 2);

    this.gl.disableVertexAttribArray(positionAttributeLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.useProgram(null);
  }

  destroy(): void {
    this.gl.deleteBuffer(this.#buffer);
    this.gl.useProgram(null);
    this.gl.deleteProgram(this.#program);
  }
}
