import { CANVAS_NOT_FOND, SHADER_COMPILATION_ERROR, UNABLE_TO_CREATE_PROGRAM, UNABLE_TO_LINK_PROGRAM, UNIFORM_VARIABLE_MISMATCH, UNREACHABLE_STATE, WEB_GL_NOT_SUPPORTED } from '../errors';

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

export function bindUniforms<UVariable extends Record<string, WebGLUniformLocation>>(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  dictionary: Record<keyof UVariable, string>
): UVariable {
  const uniformCountInShader = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  const namesInShader = [];
  for (let index = 0; index < uniformCountInShader; index++) {
    const activeUniformInfo = gl.getActiveUniform(program, index) as WebGLActiveInfo;
    namesInShader.push(activeUniformInfo.name);
  }

  const glNames = Object.values(dictionary);
  const match = namesInShader.every((uniformName) => glNames.indexOf(uniformName) > -1);

  if (uniformCountInShader !== glNames.length || !match) {
    // todo: 2 warns
    //throw new Error(`${ UNIFORM_VARIABLE_MISMATCH }\nIn the shader: ${ namesInShader.join(', ') }\nPassed: ${ glNames.join(', ') }`);
  }

  const result:Record<string, WebGLUniformLocation> = {};
  const dictionaryNames = Object.keys(dictionary);
  for (let index = 0; index < dictionaryNames.length; index++) {
    const currentName = dictionaryNames[ index ];
    const location = gl.getUniformLocation(program, dictionary[ currentName ]);
    if (location) {
      result[ currentName ] = location
    }
  }
  return result as UVariable;
}
