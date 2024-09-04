import {mat4, vec2} from 'gl-matrix';

/**
 *  Moves the coordinate space from the lower leftmost point
 *  to the center of the screen, in accordance with the OpenGL standard.
 *         x: (160 / canvas.clientWidth) * 2 - 1, // canvas.clientWidth = 640
 *         y: (120 / canvas.clientHeight) * 2 - 1, // canvas.clientHeight = 480
 *         width: (320 / canvas.clientWidth) * 2,
 *         height: (240 / canvas.clientHeight) * 2
 */
export function viewportCoordinatesToOpenGLStandard(
  out: mat4,
  original: mat4,
  canvasWidth: number,
  canvasHeight: number
) {

}

/**
 * Inverted function for the viewportCoordinatesToOpenGLStandard
 * convert from -1, 1 to viewport size
 */
export function coordsByOpenGLStandardToViewport(
  out: mat4,
  normalized: mat4,
  canvasWidth: number,
  canvasHeight: number
) {

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

  for (let i = 0; i < vertices.length; i += 6) {
    if (pointInsideTriangle(
      normalizedPoint,
      vec2.fromValues(vertices[ i ], vertices[ i + 1 ]),
      vec2.fromValues(vertices[ i + 2 ], vertices[ i + 3 ]),
      vec2.fromValues(vertices[ i + 4 ], vertices[ i + 5 ])
    )) {
      return true;
    }
  }

  return false;
}

function pointInsideTriangle(point: vec2, v0: vec2, v1: vec2, v2: vec2): boolean {
  const d1 = sign(point, v0, v1);
  const d2 = sign(point, v1, v2);
  const d3 = sign(point, v2, v0);

  const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
  const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);

  return !(hasNeg && hasPos);
}

function sign(p1: vec2, p2: vec2, p3: vec2): number {
  return (p1[ 0 ] - p3[ 0 ]) * (p2[ 1 ] - p3[ 1 ]) - (p2[ 0 ] - p3[ 0 ]) * (p1[ 1 ] - p3[ 1 ]);
}
