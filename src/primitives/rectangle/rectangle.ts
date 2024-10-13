import { bindUniforms, compileShader, createProgram } from '../../graphical-tools/gl';
import { mat4, vec4 } from 'gl-matrix';
import { FAILED_TO_CREATE_BUFFER } from '../../errors';
import { type BasePrimitive, type PrimitiveBaseProperties } from '../../types';
import vertexShaderSource from './rectangle.vert';
import fragmentShaderSource from './rectangle.frag';
import { getRectangleVertices } from './lib';
import { Camera } from '../../camera/types';

type UniformVariable = Record<'color' | 'projection', WebGLUniformLocation>;

interface RectangleProps extends PrimitiveBaseProperties {
}

export class Rectangle implements BasePrimitive {
  scale: [ number, number ];
  position: [ number, number ];
  color: vec4;
  vertices!: Float32Array;

  gl: WebGLRenderingContext;
  readonly #program: WebGLProgram;
  #buffer!: WebGLBuffer | null;
  #uniformLocation: UniformVariable;

  constructor(gl: WebGLRenderingContext, props: RectangleProps) {
    this.gl = gl;
    this.color = props.color;
    this.scale = props.scale;
    this.position = props.position;

    const vertexShader = compileShader(this.gl, vertexShaderSource, this.gl.VERTEX_SHADER);
    const fragmentShader = compileShader(this.gl, fragmentShaderSource, this.gl.FRAGMENT_SHADER);
    this.#program = createProgram(this.gl, vertexShader, fragmentShader);
    this.#uniformLocation = bindUniforms<UniformVariable>(
      gl,
      this.#program,
      {
        color: 'uColor',
        projection: 'uProjection'
      }
    );
    this.initBuffer(gl);
  }

  get projection() {
    const x = this.position[ 0 ];
    const y = this.position[ 1 ];
    const width = this.scale[ 0 ];
    const height = this.scale[ 1 ];

    const projectionMatrix = new Float32Array([
      1 / 640 * 2, 0,           0, 0,
      0,           1 / 480 * 2, 0, 0,
      0,           0,           1, 0,
      -1,          -1,          0, 1
    ]);

    /**
     * sx 0  0  0
     * 0  sy 0  0
     * 0  0  sz 0
     * tx ty tz 1
     */
    const transformationView = new Float32Array([
      width, 0, 0, 0,
      0, height, 0, 0,
      0, 0, 1, 0,
      x, y, 0, 1
    ]);

    const finalNDCMatrix = mat4.create();
    mat4.multiply(finalNDCMatrix, projectionMatrix, transformationView);
    return finalNDCMatrix;
  }

  private initBuffer(gl: WebGLRenderingContext) {
    this.#buffer = gl.createBuffer();
    if (!this.#buffer) {
      throw new Error(FAILED_TO_CREATE_BUFFER);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.#buffer);
    this.vertices = getRectangleVertices();
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  static runtimeCheckProperties(props: unknown): props is RectangleProps {
    return true;
  }

  draw(origin: [number, number], camera: Camera): void {
    this.gl.useProgram(this.#program);
    this.gl.uniform4fv(this.#uniformLocation.color, this.color);
window.mLog(this.projection);
    this.gl.uniformMatrix4fv(this.#uniformLocation.projection, false, this.projection);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.#buffer);
    const positionAttributeLocation = this.gl.getAttribLocation(this.#program, 'aNDCPosition');
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
