import { bindUniforms, compileShader, createProgram } from '../../graphical-tools/gl';
import { mat4, vec4 } from 'gl-matrix';
import { FAILED_TO_CREATE_BUFFER } from '../../errors';
import { type BasePrimitive, type PrimitiveBaseProperties } from '../../types';
import vertexShaderSource from './rectangle.vert';
import fragmentShaderSource from './rectangle.frag';
import { getRectangleVertices } from './lib';
import { Camera } from '../../camera/types';

type UniformVariable = Record<'color' | 'scale' | 'position' | 'camera', WebGLUniformLocation>;

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
        scale: 'uScale',
        position: 'uPosition',
        camera: 'uCamera'
      }
    );
    this.initBuffer(gl);
  }

  // todo
  get NDCScale() {
    return [
      this.scale[ 0 ],
      this.scale[ 1 ]
    ]
  }
  // todo
  get NDCPosition() {
    return [
      this.position[ 0 ],
      this.position[ 1 ]
    ]
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

    this.gl.uniform2fv(this.#uniformLocation.scale, this.scale);
    this.gl.uniform2fv(this.#uniformLocation.position, [ origin[0] + this.position[ 0 ], origin[ 1 ] + this.position[ 1 ]]);
    this.gl.uniformMatrix4fv(this.#uniformLocation.camera, false, mat4.create());

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
