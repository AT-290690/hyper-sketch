import { consoleElement, printErrors } from './dna.js';
import { VOID } from '../parser/cell.js';

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

  ['object']: (...entries) => {
    try {
      let count = 0;
      return Object.fromEntries(
        entries.reduce((acc, item, i) => {
          if (i % 2) {
            acc[count].push(item);
            count++;
          } else acc[count] = [item];
          return acc;
        }, [])
      );
    } catch (err) {
      printErrors(err);
    }
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
  ['matrix']: (...dimensions) => constructMatrix(dimensions)
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
  Arr['in'] = (entity, callback) => {
    entity.forEach((x, i) => callback(x, i));
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
