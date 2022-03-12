import { VOID } from '../parser/parser.js';
import { p5_remap } from './p5_remapping.min.js';
import { canvasContainer, editor, State } from '../main.js';
export const consoleElement = document.getElementById('console');
export const commandElement = document.getElementById('command');
export const editorContainer = document.getElementById('editor-container');

const print = function (...values) {
  if (values.length === 0) {
    return VOID;
  }
  values.map(x => (consoleElement.value += `( ${JSON.stringify(x)} ) `));
  return values;
};
const constructMatrix = dimensions => {
  if (dimensions.length > 0) {
    const dim = dimensions[0];
    const rest = dimensions.slice(1);
    const arr = [];
    for (let i = 0; i < dim; i++) {
      arr[i] = constructMatrix(rest);
    }
    return arr;
  } else {
    return VOID;
  }
};
const object = {
  ['objectToKeys']: obj => Object.keys(obj),
  ['objectToValues']: obj => Object.values(obj),
  ['accessProperty']: (object, key) => object[key],
  ['objectUpdatePath']: (object, ...path) => {
    let temp = object;
    path.forEach((item, index) => {
      temp = temp[item];
    }, object);
    return temp;
  },
  ['update']: (object, value, ...path) => {
    let temp = object;
    const last = path.pop();
    path.forEach((item, index) => {
      temp = temp[item];
    }, object);
    temp[last] = value;
    return object;
  },

  ['array']: size => {
    const arr = new Array(size ?? 0);
    return arr.fill(null).map(() => null);
  },
  ['overwrite']: (array, ...items) => {
    for (let i = 0; i < items.length; i++) {
      array[i] = items[i];
    }
    return array;
  },
  ['assignProperty']: (entity, key, item) => (entity[key] = item),
  ['range']: (start, end) => {
    const arr = [];
    if (start > end) {
      for (let i = start; i >= end; i--) {
        arr.push(i);
      }
    } else {
      for (let i = start; i <= end; i++) {
        arr.push(i);
      }
    }
    return arr;
  },
  ['parseInt']: (number, base) => parseInt(number.toString(), base),
  ['matrix']: (...dimensions) => constructMatrix(dimensions),
  ['string']: (...characters) => String.fromCharCode(...characters)
};

const obtainPrototype = (Entity, prefix, suffix) => {
  const result = {};
  Object.getOwnPropertyNames(Entity.prototype).forEach(prop => {
    if (typeof Entity.prototype[prop] === 'function') {
      result[prefix + prop + suffix] = (entity, ...args) =>
        entity[prop](...args);
    } else {
      result[prefix + prop + suffix] = entity => entity[prop];
    }
  });
  return result;
};
const array = (() => {
  const Arr = obtainPrototype(Array, '', '');
  delete Arr['push'];
  delete Arr['pop'];
  delete Arr['unshift'];
  delete Arr['shift'];
  Arr['addAtEnd'] = (entity, ...args) => entity['push'](...args);
  Arr['addAtStart'] = (entity, ...args) => entity['unshift'](...args);
  Arr['removeFromEnd'] = (entity, ...args) => entity['pop'](...args);
  Arr['removeFromStart'] = (entity, ...args) => entity['shift'](...args);
  Arr['clone'] = entity => [...entity];
  Arr['of'] = (entity, callback) => {
    for (let i = 0; i < entity.length; i++) {
      callback(entity[i]);
    }
    return entity;
  };
  Arr['in'] = (entity, callback) => {
    for (let i = 0; i < entity.length; i++) {
      callback(entity[i], i);
    }
    return entity;
  };
  return Arr;
})();

const bitwise = {
  ['!']: operand => +!operand,
  ['^']: (left, right) => left ^ right,
  ['>>>']: (left, right) => left >>> right,
  ['>>']: (left, right) => left >> right,
  ['<<']: (left, right) => left << right,
  ['~']: operand => ~operand,
  ['|']: (left, right) => left | right,
  ['&']: (left, right) => left & right
};

const isSimilar = (a, b) => {
  const typeA = typeof a,
    typeB = typeof b;
  if (typeA !== typeB) return false;
  if (typeA === 'number' || typeA === 'string' || typeA === 'boolean') {
    return a === b;
  }
  if (typeA === 'object') {
    const isArrayA = Array.isArray(a),
      isArrayB = Array.isArray(b);
    if (isArrayA !== isArrayB) return false;
    if (isArrayA && isArrayB) {
      return a.length < b.length
        ? a.every((item, index) => isSimilar(item, b[index]))
        : b.every((item, index) => isSimilar(item, a[index]));
    } else {
      if (a === undefined || a === null || b === undefined || b === null)
        return a === b;

      for (const key in a) {
        if (!isSimilar(a[key], b[key])) {
          return false;
        }
      }
      return true;
    }
  }
};
const isEqual = (a, b) => {
  const typeA = typeof a,
    typeB = typeof b;
  if (typeA !== typeB) return false;
  if (typeA === 'number' || typeA === 'string' || typeA === 'boolean') {
    return a === b;
  }
  if (typeA === 'object') {
    const isArrayA = Array.isArray(a),
      isArrayB = Array.isArray(b);
    if (isArrayA !== isArrayB) return false;
    if (isArrayA && isArrayB) {
      if (a.length !== b.length) return false;
      return a.every((item, index) => isEqual(item, b[index]));
    } else {
      if (a === undefined || a === null || b === undefined || b === null)
        return a === b;
      if (Object.keys(a).length !== Object.keys(b).length) return false;
      for (const key in a) {
        if (!isEqual(a[key], b[key])) {
          return false;
        }
      }
      return true;
    }
  }
};

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
