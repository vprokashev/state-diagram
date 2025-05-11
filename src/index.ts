import { initGL } from './utils/gl';
import { RectangleGeometry } from './geometry/RectangleGeometry';
import { RectangleRenderer } from './renderer/rectangle/RectangleRenderer';
import { RectangleNode } from './nodes/RectangleNode';
import { GroupNode } from './core/GroupNode';
import { renderScene } from './renderScene';
import { mat4 } from 'gl-matrix';

function init(gl: WebGL2RenderingContext) {
  const rectGeometry = new RectangleGeometry(300, 300);
  const rectRenderer = new RectangleRenderer(gl, rectGeometry);

  const rect1 = new RectangleNode(rectRenderer);
  rect1.position[0] = 0;
  rect1.position[1] = 0;
  rect1.updateLocalMatrix();

  const rect2 = new RectangleNode(rectRenderer);
  rect2.position[0] = 500;
  rect2.position[1] = 500;
  rect2.updateLocalMatrix();

  const group = new GroupNode();
  group.position[0] = 0;
  group.position[1] = 0;
  group.scale[0] = group.scale[1] = 1.5;

  group.add(rect1);
  group.add(rect2);

  const root = new GroupNode();
  root.add(group);

  const view = mat4.create();
  const projection = mat4.create();
  const viewProjection = mat4.create();
  const canvas = gl.canvas as HTMLCanvasElement;

  mat4.identity(view);
  mat4.ortho(projection, -1000, 1000, -1000, 1000, -1, 1);

  function updateViewProjection() {
    mat4.multiply(viewProjection, projection, view);
  }
  updateViewProjection();

  // ⌨ управление стрелками
  window.addEventListener('keydown', (e) => {
    const speed = 10;
    switch (e.key) {
      case 'ArrowUp': mat4.translate(view, view, [0, -speed, 0]); break;
      case 'ArrowDown': mat4.translate(view, view, [0, speed, 0]); break;
      case 'ArrowLeft': mat4.translate(view, view, [speed, 0, 0]); break;
      case 'ArrowRight': mat4.translate(view, view, [-speed, 0, 0]); break;
    }
    updateViewProjection();
  });

  function draw() {
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
  init(gl);
}

main();
