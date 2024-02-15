import { mat3, vec2 } from 'gl-matrix';

export function applyWorldToPoint(outPoint: vec2, point: vec2, world: mat3): void {
    const vertex = vec2.fromValues(point[ 0 ], point[ 1 ]);
    vec2.transformMat3(outPoint, vertex, world);
}

export function applyWorldToBufferVertices(outVertices: Float32Array, bufferVertices: Float32Array, world: mat3): void {
  for (let index = 0; index < bufferVertices.length; index += 2) {
    const vertexPoint = vec2.fromValues(bufferVertices[ index ], bufferVertices[ index + 1 ]);
    applyWorldToPoint(vertexPoint, vertexPoint, world);
    outVertices[ index ] = vertexPoint[ 0 ];
    outVertices[ index + 1 ] = vertexPoint[ 1 ];
  }
}

export function pointIntersectShape(point: vec2, vertices: Float32Array, world: mat3, canvasSize: vec2) {
  const normalizedPoint = vec2.create();
  vec2.divide(normalizedPoint, point, canvasSize);

  const transformedVertices = new Float32Array(vertices.length);
  applyWorldToBufferVertices(transformedVertices, vertices, world);

  let intersections = 0;

  for (let index = 0; index < transformedVertices.length; index += 2) {
    const startX = transformedVertices[index];
    const startY = transformedVertices[index + 1];
    const endX = transformedVertices[(index + 2) % transformedVertices.length];
    const endY = transformedVertices[(index + 3) % transformedVertices.length];

    if (
      (startY > normalizedPoint[1]) !== (endY > normalizedPoint[1]) &&
      normalizedPoint[0] < (endX - startX) * (normalizedPoint[1] - startY) / (endY - startY) + startX
    ) {
      intersections++;
    }
  }

  return intersections % 2 !== 0;
}

export function setRectangleVertices(x:number, y:number, width: number, height: number) {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;

  return new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2,
  ]);
}

export function createTransformMatrix(translation: vec2, scale: vec2): mat3 {
  const matrix = mat3.create();

  mat3.fromTranslation(matrix, translation);
  mat3.scale(matrix, matrix, scale);

  return matrix;
}
