import { mat3, vec2 } from 'gl-matrix';

export function transformBufferVertices(
  outVertices: Float32Array,
  bufferVertices: Float32Array,
  translation: vec2,
  scale: vec2
): void {
  for (let index = 0; index < bufferVertices.length; index += 2) {
    const vertexPoint = vec2.fromValues(bufferVertices[ index ], bufferVertices[ index + 1 ]);
    vec2.set(vertexPoint, vertexPoint[ 0 ] * scale[ 0 ], vertexPoint[ 1 ] * scale[ 1 ]);
    vec2.add(vertexPoint, vertexPoint, translation);
    outVertices[ index ] = vertexPoint[ 0 ];
    outVertices[ index + 1 ] = vertexPoint[ 1 ];
  }
}

export function normalizeCanvasCoordinates(outPoint: vec2, point: vec2, canvasSize: vec2) {
  vec2.divide(outPoint, point, canvasSize);
  outPoint[ 0 ] = Math.max(-1, Math.min(outPoint[ 0 ] * 2 - 1, 1));
  outPoint[ 1 ] = Math.max(-1, Math.min(1 - outPoint[ 1 ] * 2, 1));
}

export function pointIntersectShape(
  point: vec2,
  vertices: Float32Array,
  canvasSize: vec2
) {
  const normalizedPoint = vec2.create();
  normalizeCanvasCoordinates(normalizedPoint, point, canvasSize);

  let intersections = 0;

  for (let index = 0; index < vertices.length; index += 2) {
    const startX = vertices[index];
    const startY = vertices[index + 1];
    const endX = vertices[(index + 2) % vertices.length];
    const endY = vertices[(index + 3) % vertices.length];

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
