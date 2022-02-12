import { array, object, bitwise, print } from './mutations.js';
import { VOID } from '../parser/cell.js';
import { p5_constants, p5_remap } from './p5_remapping.min.js';
import { canvasContainer, editor } from '../main.js';
export const consoleElement = document.getElementById('console');
export const printErrors = errors => {
  consoleElement.classList.remove('info_line');
  consoleElement.classList.add('error_line');
  //consoleElement.style.visibility = 'visible';
  consoleElement.value = errors;
};
export const canvas = document.getElementById('canvas');
export const std = {
  void: () => VOID,
  print,
  printLog: thing => console.log(...print(thing)),
  helpEngine: () => p5_remap,
  includes: (string, target) => string.includes(target),
  ...bitwise,
  ...array,
  ...object
};

export const processing = engine => ({
  ...p5_remap.reduce((acc, item) => {
    acc[item] = (...args) => engine[item](...args);
    return acc;
  }, {}),
  copyVec: vec => vec.copy(),
  normalVec: vec => vec.normalize(),
  limitVec: (vec, limit) => vec.limit(limit),
  setMagVec: (vec, mag) => vec.setMag(mag),
  setHeadingVec2D: (vec, heading) => vec.setHeading(heading),
  rotateVec2D: (vec, angle) => vec.rotate(angle),
  angleBetweenVec: (vec1, vec2) => vec1.angleBetwee(vec2),
  lerpVec: (vec1, vec2) => vec1.lerp(vec2),
  equalsVec: (vec, ...vectors) => vectors.every(x => vec.equals(x)),
  magVec: (vec, val) => vec.mag(val),
  setVec: (vec, ...args) => vec.set(...args),
  addVec: (first, ...args) =>
    args.reduce((acc, x) => {
      acc.add(x);
      return acc;
    }, first),
  subVec: (first, ...args) =>
    args.reduce((acc, x) => {
      acc.sub(x);
      return acc;
    }, first),
  multVec: (first, ...args) =>
    args.reduce((acc, x) => {
      acc.mult(x);
      return acc;
    }, first),
  divVec: (first, ...args) =>
    args.reduce((acc, x) => {
      acc.div(x);
      return acc;
    }, first),
  remVec: (first, ...args) =>
    args.reduce((acc, x) => {
      acc.rem(x);
      return acc;
    }, first),
  dotVec: (first, ...args) =>
    args.reduce((acc, x) => {
      acc.dot(x);
      return acc;
    }, first),
  crossVec: (first, ...args) =>
    args.reduce((acc, x) => {
      acc.cross(x);
      return acc;
    }, first),
  distVec: (first, ...args) =>
    args.reduce((acc, x) => {
      acc.dist(x);
      return acc;
    }, first),
  WIDTH: () => engine.width,
  HEIGHT: () => engine.height,
  MOUSE_X: () => engine.mouseX,
  MOUSE_Y: () => engine.mouseY,
  ...p5_constants.reduce((acc, item) => {
    acc[item] = () => engine[item];
    return acc;
  }, {}),
  setup: fn => (engine.setup = fn),
  createCanvas: (w = window.innerWidth / 2, h = window.innerHeight - 82) => {
    canvasContainer.style.display = 'block';
    editor.setSize(window.innerWidth / 2 - 15, window.innerHeight - 80);
    const canvas = engine.createCanvas(w, h);
    canvas.parent('canvas-container');
  },
  draw: fn => (engine.draw = fn)
});
