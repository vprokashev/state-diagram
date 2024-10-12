import { Camera } from '../types';

export class Simple2D implements Camera {
    readonly #view: Float32Array;

    constructor(
        public w: number,
        public h: number
    ) {
      this.#view = new Float32Array([
            2 / w, 0, 0, 0,
            0, 2 / h, 0, 0,
            0, 0, 1, 0,
            -1, -1, 0, 1
        ]);
    }

    get view() {
        return this.#view;
    }
}
