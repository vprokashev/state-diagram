import { initGL } from './utils/gl';
import { RectangleGeometry } from './geometry/RectangleGeometry';
import { RectangleRenderer } from './renderer/rectangle/RectangleRenderer';
import { RectangleNode } from './nodes/RectangleNode';
import { GroupNode } from './core/GroupNode';
import { renderScene } from './renderScene';
import { mat4 } from 'gl-matrix';

function init(gl: WebGL2RenderingContext) {
  const rectGeometry = new RectangleGeometry(100, 50);
  const rectRenderer = new RectangleRenderer(gl, rectGeometry);

  const rect1 = new RectangleNode(rectRenderer);
  rect1.position[0] = -60;

  const rect2 = new RectangleNode(rectRenderer);
  rect2.position[0] = 60;

  const group = new GroupNode();
  group.position[0] = 0;
  group.position[1] = 0;
  group.scale[0] = group.scale[1] = 1.5;

  group.add(rect1);
  group.add(rect2);

  const root = new GroupNode();
  root.add(group);

  const viewProjection = mat4.create();
  const canvas = gl.canvas as HTMLCanvasElement;
  mat4.ortho(viewProjection, -200, 200, -200, 200, -1, 1);

  let lastTime = performance.now();

  function draw(time: number) {
    const delta = (time - lastTime) / 1000;
    lastTime = time;

    group.rotation += delta;
    group.updateLocalMatrix();

    gl.clear(gl.COLOR_BUFFER_BIT);
    renderScene(gl, root, viewProjection);
    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}


function main(): void {
  const gl = initGL();
  const canvas = document.getElementById('canvas');
  if (!canvas) {
    throw new Error("Canvas not found");
  }
  init(gl, )
}

main()
