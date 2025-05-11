import { mat4 } from 'gl-matrix';
import { TransformNode } from './TransformNode';

export abstract class DrawableNode extends TransformNode {
  public size: [number, number] = [0, 0];

  public containsPoint(worldX: number, worldY: number): boolean {
    const x = this.worldMatrix[12];
    const y = this.worldMatrix[13];
    const w = this.size[0] / 2;
    const h = this.size[1] / 2;

    return (
      worldX >= x - w &&
      worldX <= x + w &&
      worldY >= y - h &&
      worldY <= y + h
    );
  }

  abstract render(gl: WebGL2RenderingContext, viewProjection: mat4): void;
}
