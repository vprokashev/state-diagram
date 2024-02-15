import { SceneNode } from '../types';

function* createSceneIterator(node: SceneNode): Generator<SceneNode, void> {
  const childes = node.children;

  yield node;

  if (childes && !!childes.length) {
    for (let i = 0; i < childes.length; i++) {
      yield* createSceneIterator(childes[ i ]);
    }
  }
}

export function getFirstNode(scene: SceneNode, predicate: (arg: SceneNode) => boolean, defaultValue = null) {
  const configIterator = createSceneIterator(scene);

  while (true) {
    const next = configIterator.next();
    if (next.done) {
      break;
    }
    const node = next.value;
    if (predicate(node)) {
      return node;
    }
  }

  return defaultValue;
}

export function getByCoordIntersection(scene: SceneNode, { x, y }: { x: number, y: number }) {

}
