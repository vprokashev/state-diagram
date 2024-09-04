import { bindUniforms, compileShader, createProgram } from '../../graphical-tools/gl';
import {mat4, vec4} from 'gl-matrix';
import { FAILED_TO_CREATE_BUFFER } from '../../errors';
import { type BasePrimitive, type PrimitiveBaseProperties } from '../../types';
import vertexShaderSource from './rectangle.vert';
import fragmentShaderSource from './rectangle.frag';
import { setRectangleVertices } from './lib';
import {viewportCoordinatesToOpenGLStandard} from "../../graphical-tools/math";

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

  constructor(gl: WebGLRenderingContext, { x, y, width, height, color }: RectangleProps) {
    this.gl = gl;
    this.color = color;
    this.globalMatrix = mat4.create();

    const glX = (x / 640) * 2 - 1;
    const glY = (y / 480) * 2 - 1;
    const glWidth = (width / 640) * 2;
    const glHeight = (height / 480) * 2;

    this.worldMatrix = [
      1, 0, glX, 0,
      0, 1, glY, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
    this.localMatrix = [
      glWidth, 0, 0, 0,
      0, glHeight, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];

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
    this.vertices = setRectangleVertices(
      this.worldMatrix[ 2 ],
      this.worldMatrix[ 6 ],
      this.worldMatrix[ 0 ],
      this.worldMatrix[ 5 ]
    );
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  static runtimeCheckProperties(props: unknown): props is RectangleProps {
    return true;
  }

  draw(parentWorldMatrix: mat4): void {
    this.gl.useProgram(this.#program);
    this.gl.uniform4fv(this.#uniformLocation.color, this.color);
    //todo: order
    // this.globalMatrix = mat4.multiply(this.globalMatrix, this.worldMatrix, this.localMatrix);
    // console.log(this.globalMatrix);
    mat4.multiply(this.globalMatrix, this.localMatrix, parentWorldMatrix);
    mat4.multiply(this.globalMatrix, this.globalMatrix, this.worldMatrix);
    console.log(this.globalMatrix);


    this.gl.uniformMatrix4fv(this.#uniformLocation.worldMatrix, true, this.globalMatrix);

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
