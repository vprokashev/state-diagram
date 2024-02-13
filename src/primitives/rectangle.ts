import { compileShader, createProgram } from '../gl';
import { mat3, vec4 } from 'gl-matrix';
import { FAILED_TO_CREATE_BUFFER } from '../errors';
import { type BasePrimitive, isPrimitiveBaseProperties, type PrimitiveBaseProperties } from '../types';
import vertexShaderSource from './common.vert';
import fragmentShaderSource from './common.frag';

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

  constructor(gl: WebGLRenderingContext, { local, world, color }: RectangleProps) {
    this.gl = gl;
    this.local = local;
    this.world = world;
    this.color = color;
    const vertexShader = compileShader(this.gl, vertexShaderSource, this.gl.VERTEX_SHADER);
    const fragmentShader = compileShader(this.gl, fragmentShaderSource, this.gl.FRAGMENT_SHADER);
    this.#program = createProgram(this.gl, vertexShader, fragmentShader);
    this.initBuffer(gl);
  }

  private initBuffer(gl: WebGLRenderingContext) {
    this.#buffer = gl.createBuffer();
    if (!this.#buffer) {
      throw new Error(FAILED_TO_CREATE_BUFFER);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.#buffer);
    this.setVertices(0, 0, 1, 1);
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

    this.gl.useProgram(null);
  }

  updateWorld(parentWorld?: mat3) {
    if (parentWorld) {
      mat3.multiply(this.world, parentWorld, this.world);
    }
  }
}
