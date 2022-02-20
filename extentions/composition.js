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
  frameCount: () => engine.frameCount,
  keyPressed: callback => {
    if (State.previousKeypressEvent) {
      document.removeEventListener('keypress', State.previousKeypressEvent);
    }
    State.previousKeypressEvent = e => {
      if (State.activeWindow === canvasContainer) callback(e.key);
    };
    document.addEventListener('keypress', State.previousKeypressEvent);
  },
  ARROW: 'default',
  AUTO: 'auto',
  AXES: 'axes',
  BASELINE: 'alphabetic',
  BEVEL: 'bevel',
  BEZIER: 'bezier',
  BLEND: 'source-over',
  BLUR: 'blur',
  BOLD: 'bold',
  BOLDITALIC: 'bold italic',
  BOTTOM: 'bottom',
  BURN: 'color-burn',
  CENTER: 'center',
  CHAR: 'CHAR',
  CHORD: 'chord',
  CLAMP: 'clamp',
  CLOSE: 'close',
  CORNER: 'corner',
  CORNERS: 'corners',
  CROSS: 'crosshair',
  CURVE: 'curve',
  DARKEST: 'darken',
  DEGREES: 'degrees',
  DEG_TO_RAD: 0.017453292519943295,
  DIFFERENCE: 'difference',
  DILATE: 'dilate',
  DODGE: 'color-dodge',
  ERODE: 'erode',
  EXCLUSION: 'exclusion',
  FALLBACK: 'fallback',
  FILL: 'fill',
  GRAY: 'gray',
  GRID: 'grid',
  HALF_PI: 1.5707963267948966,
  HAND: 'pointer',
  HARD_LIGHT: 'hard-light',
  HSB: 'hsb',
  HSL: 'hsl',
  IMAGE: 'image',
  IMMEDIATE: 'immediate',
  INVERT: 'invert',
  ITALIC: 'italic',
  LABEL: 'label',
  LANDSCAPE: 'landscape',
  LEFT: 'left',
  LIGHTEST: 'lighten',
  LINEAR: 'linear',
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  MIRROR: 'mirror',
  MITER: 'miter',
  MOVE: 'move',
  MULTIPLY: 'multiply',
  NEAREST: 'nearest',
  NORMAL: 'normal',
  OPAQUE: 'opaque',
  OPEN: 'open',
  OVERLAY: 'overlay',
  P2D: 'p2d',
  PI: 3.141592653589793,
  PIE: 'pie',
  POINTS: 0,
  PORTRAIT: 'portrait',
  POSTERIZE: 'posterize',
  PROJECT: 'square',
  QUADRATIC: 'quadratic',
  QUADS: 'quads',
  QUAD_STRIP: 'quad_strip',
  QUARTER_PI: 0.7853981633974483,
  RADIANS: 'radians',
  RADIUS: 'radius',
  RAD_TO_DEG: 57.29577951308232,
  REMOVE: 'destination-out',
  REPEAT: 'repeat',
  REPLACE: 'copy',
  RGB: 'rgb',
  RIGHT: 'right',
  ROUND: 'round',
  SCREEN: 'screen',
  SOFT_LIGHT: 'soft-light',
  SQUARE: 'butt',
  STROKE: 'stroke',
  SUBTRACT: 'subtract',
  TAU: 6.283185307179586,
  TESS: 'tess',
  TEXT: 'text',
  TEXTURE: 'texture',
  THRESHOLD: 'threshold',
  TOP: 'top',
  TRIANGLES: 4,
  TRIANGLE_FAN: 6,
  TRIANGLE_STRIP: 5,
  TWO_PI: 6.283185307179586,
  WAIT: 'wait',
  WEBGL: 'webgl',
  WORD: 'WORD',
  SPACE: ' ',

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
