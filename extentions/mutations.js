import { consoleElement, printErrors } from './composition.js';
import { VOID } from '../parser/parser.js';

export const print = function (...values) {
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
// const iterateMatrix = (arr, callback) => {
//   if (Array.isArray(arr)) {
//     for (let i = 0; i < arr.length; i++) {
//       iterateMatrix(arr[i], i => callback(i));
//     }
//   } else {
//     return callback();
//   }
// };
export const object = {
  ['objectToKeys']: obj => Object.keys(obj),
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
  // ['iterateMatrix']: (matrix, callback) => iterateMatrix(matrix, callback),
  // ['for']: (start, end) =>
  //   start > end
  //     ? callback => {
  //         for (let i = start; i > end; i--) {
  //           callback(i);
  //         }
  //       }
  //     : callback => {
  //         for (let i = start; i < end; i++) {
  //           callback(i);
  //         }
  //       }
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

  // result[prefix + 'new' + suffix] = (...args) => new Entity(...args);
  return result;
};
export const array = (() => {
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

export const bitwise = {
  ['!']: operand => +!operand,
  ['^']: (left, right) => left ^ right,
  ['>>>']: (left, right) => left >>> right,
  ['>>']: (left, right) => left >> right,
  ['<<']: (left, right) => left << right,
  ['~']: operand => ~operand,
  ['|']: (left, right) => left | right,
  ['&']: (left, right) => left & right
};

export const isSimilar = (a, b) => {
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
export const isEqual = (a, b) => {
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
