export class RectangleGeometry {
  public readonly vertices: Float32Array;

  constructor(width: number, height: number) {
    const w = width / 2;
    const h = height / 2;
    this.vertices = new Float32Array([
      -w, -h,
      w, -h,
      w,  h,
      -w, -h,
      w,  h,
      -w,  h,
    ]);
  }
}
