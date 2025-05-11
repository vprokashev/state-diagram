export class RectangleGeometry {
  public readonly vertices: Float32Array;
  public readonly width: number;
  public readonly height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
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
