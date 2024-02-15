import { type BasePrimitive, isPrimitiveBaseProperties, type PrimitiveBaseProperties, sceneDiscriminantType } from '../types';
import { vec2 } from 'gl-matrix';

interface SpaceProps extends PrimitiveBaseProperties {
}

export class Space implements BasePrimitive {
  gl: WebGLRenderingContext;
  scale: vec2;
  translation: vec2;

  constructor(
    gl: WebGLRenderingContext,
    { scale, translation }: SpaceProps
  ) {
    this.gl = gl;
    this.scale = scale;
    this.translation = translation;
  }

  static runtimeCheckProperties(props: unknown): props is SpaceProps {
    return isPrimitiveBaseProperties(props);
  }

  updateWorld(parentTranslation?: vec2) {
    if (parentTranslation) {
      vec2.add(this.translation, parentTranslation, this.translation);
    }
  }
}
