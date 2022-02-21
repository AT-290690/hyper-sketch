import {
  array,
  object,
  bitwise,
  print,
  isEqual,
  isSimilar
} from './mutations.js';
import { VOID } from '../parser/parser.js';
import { p5_remap } from './p5_remapping.min.js';
import { canvasContainer, editor, State } from '../main.js';
export const consoleElement = document.getElementById('console');
export const commandElement = document.getElementById('command');
export const editorContainer = document.getElementById('editor-container');

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
  ...object,
  isEqual,
  isSimilar,
  setTimeout: (fn, ms) => setTimeout(() => fn(), ms),
  clearTimeout: id => clearTimeout(id)
};

export const processing = engine => ({
  ...p5_remap.reduce((acc, item) => {
    acc[item] = (...args) => engine[item](...args);
    return acc;
  }, {}),
  remap: (...args) => engine.map(...args),
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
  width: () => engine.width,
  height: () => engine.height,
  mouseX: () => engine.mouseX,
  mouseY: () => engine.mouseY,
  pmouseX: () => engine.pmouseX,
  pmouseY: () => engine.pmouseY,
  pwinMouseX: () => engine.pwinMouseX,
  pwinMouseY: () => engine.pwinMouseY,
  winMouseX: () => engine.winMouseX,
  winMouseY: () => engine.winMouseY,
  windowHeight: () => engine.windowHeight,
  windowWidth: () => engine.windowWidth,
  displayHeight: () => engine.displayHeight,
  displayWidth: () => engine.displayWidth,
  movedX: () => engine.movedX,
  movedY: () => engine.movedY,
  frameCount: () => engine.frameCount,
  mouseButton: () => engine.mouseButton,
  keyIsDown: () => engine.keyIsDown,
  keyIsPressed: () => engine.keyIsPressed,
  mouseIsPressed: () => engine.mouseIsPressed,
  pAccelerationX: () => engine.pAccelerationX,
  pAccelerationY: () => engine.pAccelerationY,
  pAccelerationZ: () => engine.pAccelerationZ,
  pRotateDirectionX: () => engine.pRotateDirectionX,
  pRotateDirectionY: () => engine.pRotateDirectionY,
  pRotateDirectionZ: () => engine.pRotateDirectionZ,
  pRotationX: () => engine.pRotationX,
  pRotationY: () => engine.pRotationY,
  pRotationZ: () => engine.pRotationZ,
  pixelDensity: () => engine.pixelDensity,
  pixels: () => engine.pixels,
  keyPressed: callback => {
    if (State.previousKeypressEvent) {
      document.removeEventListener('keypress', State.previousKeypressEvent);
    }
    State.previousKeypressEvent = e => {
      if (State.activeWindow === canvasContainer) callback(e.key);
    };
    document.addEventListener('keypress', State.previousKeypressEvent);
  },
  keyReleased: callback => {
    if (State.previousKeyreleaseEvent) {
      document.removeEventListener('keyup', State.previousKeyreleaseEvent);
    }
    State.previousKeypressEvent = e => {
      if (State.activeWindow === canvasContainer) callback(e.key);
    };
    document.addEventListener('keyup', State.previousKeyreleaseEvent);
  },
  mousePressed: callback => {
    if (State.previousMousepressEvent) {
      document.removeEventListener('mousedown', State.previousMousepressEvent);
    }
    State.previousMousepressEvent = () => {
      if (State.activeWindow === canvasContainer) callback();
    };
    document.addEventListener('mousedown', State.previousMousepressEvent);
  },
  mouseReleased: callback => {
    if (State.previousMousereleaseEvent) {
      document.removeEventListener('mouseup', State.previousMousereleaseEvent);
    }
    State.previousMousereleaseEvent = () => {
      if (State.activeWindow === canvasContainer) callback();
    };
    document.addEventListener('mouseup', State.previousMousereleaseEvent);
  },
  setup: fn => (engine.setup = fn),
  createCanvas: (
    w = window.innerWidth / 2,
    h = window.innerHeight - 82,
    mode
  ) => {
    canvasContainer.style.display = 'block';
    editor.setSize(window.innerWidth / 2 - 15);
    State.drawMode = mode;
    const canvas = engine.createCanvas(w, h, mode);
    canvas.parent('canvas-container');
  },
  createWebGlCanvas: (
    w = window.innerWidth / 2,
    h = window.innerHeight - 82
  ) => {
    canvasContainer.style.display = 'block';
    editor.setSize(window.innerWidth / 2 - 15);
    State.drawMode = 'webgl';
    const canvas = engine.createCanvas(w, h, 'webgl');
    canvas.parent('canvas-container');
  },
  draw: fn => (engine.draw = fn)
});
