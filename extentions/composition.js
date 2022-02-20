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
  P5_CONST_ARROW: 'default',
  P5_CONST_AUTO: 'auto',
  P5_CONST_AXES: 'axes',
  P5_CONST_BASELINE: 'alphabetic',
  P5_CONST_BEVEL: 'bevel',
  P5_CONST_BEZIER: 'bezier',
  P5_CONST_BLEND: 'source-over',
  P5_CONST_BLUR: 'blur',
  P5_CONST_BOLD: 'bold',
  P5_CONST_BOLDITALIC: 'bold italic',
  P5_CONST_BOTTOM: 'bottom',
  P5_CONST_BURN: 'color-burn',
  P5_CONST_CENTER: 'center',
  P5_CONST_CHAR: 'CHAR',
  P5_CONST_CHORD: 'chord',
  P5_CONST_CLAMP: 'clamp',
  P5_CONST_CLOSE: 'close',
  P5_CONST_CORNER: 'corner',
  P5_CONST_CORNERS: 'corners',
  P5_CONST_CROSS: 'crosshair',
  P5_CONST_CURVE: 'curve',
  P5_CONST_DARKEST: 'darken',
  P5_CONST_DEGREES: 'degrees',
  P5_CONST_DEG_TO_RAD: 0.017453292519943295,
  P5_CONST_DIFFERENCE: 'difference',
  P5_CONST_DILATE: 'dilate',
  P5_CONST_DODGE: 'color-dodge',
  P5_CONST_ERODE: 'erode',
  P5_CONST_EXCLUSION: 'exclusion',
  P5_CONST_FALLBACK: 'fallback',
  P5_CONST_FILL: 'fill',
  P5_CONST_GRAY: 'gray',
  P5_CONST_GRID: 'grid',
  P5_CONST_HALF_PI: 1.5707963267948966,
  P5_CONST_HARD_LIGHT: 'hard-light',
  P5_CONST_HSB: 'hsb',
  P5_CONST_HSL: 'hsl',
  P5_CONST_IMAGE: 'image',
  P5_CONST_IMMEDIATE: 'immediate',
  P5_CONST_INVERT: 'invert',
  P5_CONST_LANDSCAPE: 'landscape',
  P5_CONST_LIGHTEST: 'lighten',
  P5_CONST_LINEAR: 'linear',
  P5_CONST_LINES: 1,
  P5_CONST_LINE_LOOP: 2,
  P5_CONST_LINE_STRIP: 3,
  P5_CONST_MIRROR: 'mirror',
  P5_CONST_MITER: 'miter',
  P5_CONST_MOVE: 'move',
  P5_CONST_MULTIPLY: 'multiply',
  P5_CONST_NEAREST: 'nearest',
  P5_CONST_NORMAL: 'normal',
  P5_CONST_OPAQUE: 'opaque',
  P5_CONST_OPEN: 'open',
  P5_CONST_OVERLAY: 'overlay',
  P5_CONST_P2D: 'p2d',
  P5_CONST_PI: 3.141592653589793,
  P5_CONST_PIE: 'pie',
  P5_CONST_POINTS: 0,
  P5_CONST_PORTRAIT: 'portrait',
  P5_CONST_POSTERIZE: 'posterize',
  P5_CONST_PROJECT: 'square',
  P5_CONST_QUADRATIC: 'quadratic',
  P5_CONST_QUADS: 'quads',
  P5_CONST_QUAD_STRIP: 'quad_strip',
  P5_CONST_QUARTER_PI: 0.7853981633974483,
  P5_CONST_RADIANS: 'radians',
  P5_CONST_RADIUS: 'radius',
  P5_CONST_RAD_TO_DEG: 57.29577951308232,
  P5_CONST_REMOVE: 'destination-out',
  P5_CONST_REPEAT: 'repeat',
  P5_CONST_REPLACE: 'copy',
  P5_CONST_RGB: 'rgb',
  P5_CONST_RIGHT: 'right',
  P5_CONST_ROUND: 'round',
  P5_CONST_SCREEN: 'screen',
  P5_CONST_SOFT_LIGHT: 'soft-light',
  P5_CONST_SQUARE: 'butt',
  P5_CONST_STROKE: 'stroke',
  P5_CONST_SUBTRACT: 'subtract',
  P5_CONST_TAU: 6.283185307179586,
  P5_CONST_TESS: 'tess',
  P5_CONST_TEXT: 'text',
  P5_CONST_TEXTURE: 'texture',
  P5_CONST_THRESHOLD: 'threshold',
  P5_CONST_TOP: 'top',
  P5_CONST_TRIANGLES: 4,
  P5_CONST_TRIANGLE_FAN: 6,
  P5_CONST_TRIANGLE_STRIP: 5,
  P5_CONST_TWO_PI: 6.283185307179586,
  P5_CONST_WAIT: 'wait',
  P5_CONST_WEBGL: 'webgl',
  P5_CONST_WORD: 'WORD',
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
