import { compileShader, createProgram } from '../../graphical-tools/gl';
import { vec2, vec4 } from 'gl-matrix';
import { FAILED_TO_CREATE_BUFFER } from '../../errors';
import { type BasePrimitive, isPrimitiveBaseProperties, type PrimitiveBaseProperties } from '../../types';
import vertexShaderSource from './rectangle.vert';
import fragmentShaderSource from './rectangle.frag';
import { setRectangleVertices } from './lib';

interface RectangleProps extends PrimitiveBaseProperties {
  color: vec4;
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

  draw(translation: vec2): void {
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

    const uniformParentTranslation = this.gl.getUniformLocation(this.#program, 'u_parent_translation');
    this.gl.uniform2f(uniformParentTranslation, translation[ 0 ], translation[ 1 ]);

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
