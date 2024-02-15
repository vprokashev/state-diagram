import { compileShader, createProgram } from '../gl';
import { mat3, vec2, vec4 } from 'gl-matrix';
import { FAILED_TO_CREATE_BUFFER } from '../errors';
import { type BasePrimitive, isPrimitiveBaseProperties, type PrimitiveBaseProperties } from '../types';
import vertexShaderSource from './common.vert';
import fragmentShaderSource from './common.frag';
import { setRectangleVertices } from '../math';

interface RectangleProps extends PrimitiveBaseProperties {
  color: vec4
}

export class Rectangle implements BasePrimitive {
  scale: vec2;
  translation: vec2;
  color: vec4;
  vertices!: Float32Array;

  gl: WebGLRenderingContext;
  #program: WebGLProgram;
  #buffer!: WebGLBuffer | null;

  constructor(gl: WebGLRenderingContext, { scale, translation, color }: RectangleProps) {
    this.gl = gl;
    this.scale = scale;
    this.translation = translation;
    debugger;
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
    this.vertices = setRectangleVertices(0, 0, 1, 1);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);
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

    const uniformScale = this.gl.getUniformLocation(this.#program, 'u_scale');
    this.gl.uniform2f(uniformScale, this.scale[ 0 ], this.scale[ 1 ]);

    const uniformTranslation = this.gl.getUniformLocation(this.#program, 'u_translation');
    this.gl.uniform2f(uniformTranslation, this.translation[ 0 ], this.translation[ 1 ]);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

    this.gl.useProgram(null);
  }

  updateWorld(parentTranslation?: vec2) {
    if (parentTranslation) {
      vec2.add(this.translation, parentTranslation, this.translation);
    }
  }
}
