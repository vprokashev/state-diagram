export function getRectangleVertices() {
  const x1 = 0;
  const x2 = 1;
  const y1 = 0;
  const y2 = 1;

  return new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2
  ]);
}
