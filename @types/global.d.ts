declare module '*.vert' {
  const source: string;
  export default source;
}
declare module '*.frag' {
  const source: string;
  export default source;
}
interface ArrayLike<T> {
  length: number;
  [n: number]: T;
}
interface Window {
  mLog: (m: ArrayLike<number>, dim?: number) => void;
}
