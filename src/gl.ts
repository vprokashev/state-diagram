import { CANVAS_NOT_FOND, SHADER_COMPILATION_ERROR, UNABLE_TO_CREATE_PROGRAM, UNABLE_TO_LINK_PROGRAM, WEB_GL_NOT_SUPPORTED } from './errors';

export function initGL(): WebGLRenderingContext {
  const canvas = <HTMLCanvasElement>document.querySelector('#canvas');
  if (!canvas) {
    throw new Error(CANVAS_NOT_FOND);
  }
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    throw new Error(WEB_GL_NOT_SUPPORTED);
  }
  return gl;
}

export function compileShader(gl: WebGLRenderingContext, source: string, type: GLenum): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error('Unable to create shader.');
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`${ SHADER_COMPILATION_ERROR }\n${ source }\n${ log }`);
  }

  return shader;
}

export function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
  const program = gl.createProgram();
  if (!program) {
    throw new Error(UNABLE_TO_CREATE_PROGRAM);
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`${ UNABLE_TO_LINK_PROGRAM }\n${ log }`);
  }

  return program;
}

export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement, multiplier: number = 1): void {
  const width = canvas.clientWidth * multiplier | 0;
  const height = canvas.clientHeight * multiplier | 0;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}
