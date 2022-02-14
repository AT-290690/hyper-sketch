import { consoleElement, printErrors } from './dna.js';
import { VOID } from '../parser/cell.js';

export const print = function (...values) {
  if (values.length === 0) {
    return VOID;
  }
  values.map(x => (consoleElement.value += `( ${JSON.stringify(x)} ) `));
  return values;
};

export const object = {
  ['objectToKeys']: obj => Object.keys(obj),
  ['access']: (object, key) => object[key],
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
    const arr = new Array(size);
    return arr.fill(null).map(() => undefined);
  },
  ['overwrite']: (array, ...items) => {
    for (let i = 0; i < items.length; i++) {
      array[i] = items[i];
    }
    return array;
  },
  ['assign']: (entity, key, item) => (entity[key] = item)
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
  return Arr;
})();

export const bitwise = {
  ['!']: operand => !operand,
  ['^']: (left, right) => left ^ right,
  ['>>>']: (left, right) => left >>> right,
  ['>>']: (left, right) => left >> right,
  ['<<']: (left, right) => left << right,
  ['~']: operand => ~operand,
  ['|']: (left, right) => left | right,
  ['&']: (left, right) => left & right
};
