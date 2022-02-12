import { consoleElement } from './dna.js';
import { VOID } from '../parser/cell.js';

export const print = function (...values) {
  if (values.length === 0) {
    return VOID;
  }
  // consoleElement.style.visibility = 'visible';
  values.map(x => (consoleElement.value += `( ${JSON.stringify(x)} ) `));
  return values.length > 1 ? values[values.length - 1] : values;
};

export const object = {
  ['::get']: (object, key) => object[key],
  ['::props']: (...args) => {
    let count = 0;
    return args.reduce((acc, item, i) => {
      if (i % 2) {
        acc[count].push(item);
        count++;
      } else acc[count] = [item];
      return acc;
    }, []);
  },
  ['::path']: (object, ...path) => {
    let temp = object;
    path.forEach((item, index) => {
      temp = temp[item];
    }, object);
    return temp;
  },
  ['::update']: (object, value, ...path) => {
    let temp = object;
    const last = path.pop();
    path.forEach((item, index) => {
      temp = temp[item];
    }, object);
    temp[last] = value;
    return object;
  },
  ['::create']: entries => Object.fromEntries(entries),
  ['::set']: (array, index, item) => (array[index] = item)
};

const obtainPrototype = (Entity, namespace) => {
  const result = {};
  Object.getOwnPropertyNames(Entity.prototype).forEach((prop, index, props) => {
    if (typeof Entity.prototype[prop] === 'function') {
      result[namespace + prop] = (entity, ...args) => entity[prop](...args);
    } else {
      result[namespace + prop] = entity => entity[prop];
    }
  });
  result[namespace + 'new'] = (...args) => new Entity(...args);
  return result;
};
export const array = (() => obtainPrototype(Array, '::'))();
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
