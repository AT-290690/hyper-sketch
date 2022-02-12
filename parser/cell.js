import { printErrors } from '../extentions/dna.js';
export const VOID = undefined;
function parseExpression(program) {
  let match, expr;
  if ((match = /^"([^"]*)"/.exec(program))) {
    expr = { type: 'value', value: match[1] };
  } else if ((match = /^-?\d*\.{0,1}\d+\b/.exec(program))) {
    expr = { type: 'value', value: Number(match[0]) };
  } else if ((match = /^[^\s();"]+/.exec(program))) {
    expr = { type: 'word', name: match[0] };
  } else {
    printErrors(`Unexpect syntax: ${program}`);
    throw new SyntaxError(`Unexpect syntax: ${program}`);
  }
  return parseApply(expr, program.slice(match[0].length));
}

function parseApply(expr, program) {
  if (program[0] !== '(') {
    return { expr: expr, rest: program };
  }
  program = program.slice(1);
  expr = { type: 'apply', operator: expr, args: [] };
  while (program[0] !== ')') {
    const arg = parseExpression(program);
    expr.args.push(arg.expr);
    program = arg.rest;
    if (program[0] === ';') {
      program = program.slice(1);
    } else if (program[0] !== ')') {
      console.error(expr);
      printErrors("Expected ';' or ')'" + 'but got ' + program[0]);
      throw new SyntaxError("Expected ';' or ')'" + 'but got ' + program[0]);
    }
  }
  return parseApply(expr, program.slice(1));
}

function parse(program) {
  const result = parseExpression(program);
  if (result.rest.length > 0) {
    printErrors('Unexpected text after program');
    throw new SyntaxError('Unexpected text after program');
  }
  return result.expr;
}

function evaluate(expr, env) {
  switch (expr.type) {
    case 'value':
      return expr.value;
    case 'word':
      if (expr.name in env) {
        return env[expr.name];
      } else {
        printErrors(`Undefined constiable: ${expr.name}`);
        throw new ReferenceError(`Undefined constiable: ${expr.name}`);
      }
    case 'apply':
      if (expr.operator.type === 'word' && expr.operator.name in specialForms) {
        return specialForms[expr.operator.name](expr.args, env);
      }
      const op = evaluate(expr.operator, env);
      if (typeof op !== 'function') {
        printErrors('Applying a non-function ' + mutation.operator);
        throw new TypeError('Applying a non-function ' + mutation.operator);
      }
      return op.apply(
        null,
        expr.args.map(function (arg) {
          return evaluate(arg, env);
        })
      );
  }
}
const specialForms = Object.create(null);

specialForms['?'] = function (args, env) {
  if (args.length > 3 || args.length <= 1) {
    printErrors('Bad number of args to ?');
    throw new SyntaxError('Bad number of args to ?');
  }
  if (!!evaluate(args[0], env)) {
    return evaluate(args[1], env);
  } else if (args[2]) {
    return evaluate(args[2], env);
  } else {
    return false;
  }
};
specialForms['&&'] = function (args, env) {
  if (args.length === 0) {
    printErrors('Bad number of args to &&');
    throw new SyntaxError('Bad number of args to &&');
  }
  for (let i = 0; i < args.length - 1; i++) {
    if (!!evaluate(args[i], env)) {
      continue;
    } else {
      return evaluate(args[i], env);
    }
  }
  return evaluate(args[args.length - 1], env);
};

specialForms['||'] = function (args, env) {
  if (args.length === 0) {
    printErrors('Bad number of args to ||');
    throw new SyntaxError('Bad number of args to ||');
  }
  for (let i = 0; i < args.length - 1; i++) {
    if (!!evaluate(args[i], env)) {
      return evaluate(args[i], env);
    } else {
      continue;
    }
  }
  return evaluate(args[args.length - 1], env);
};

specialForms['...'] = function (args, env) {
  if (args.length !== 2) {
    printErrors('Bad number of args to ...');
    throw new SyntaxError('Bad number of args to ...');
  }
  while (!!evaluate(args[0], env)) {
    evaluate(args[1], env);
  }
  // Cell has no undefined so we return void when there's no meaningful result.
  return VOID;
};
specialForms['|>'] = function (args, env) {
  let value = VOID;
  args.forEach(function (arg) {
    value = evaluate(arg, env);
  });
  return value;
};
specialForms[':='] = function (args, env) {
  if (args.length !== 2 || args[0].type !== 'word') {
    console.error(args);
    printErrors('Bad use of :=');
    throw new SyntaxError('Bad use of :=');
  }
  let value = evaluate(args[1], env);
  env[args[0].name] = value;
  return value;
};
specialForms['->'] = function (args, env) {
  if (!args.length) {
    printErrors('Functions need a body');
    throw new SyntaxError('Functions need a body');
  }

  function name(expr) {
    if (expr.type !== 'word') {
      console.error(expr);
      printErrors('Arg names must be words');
      throw new SyntaxError('Arg names must be words');
    }
    return expr.name;
  }
  const argNames = args.slice(0, args.length - 1).map(name);
  const body = args[args.length - 1];
  return function (...args) {
    if (args.length !== argNames.length) {
      console.error(argNames);
      console.error(args);
      printErrors('Wrong number of arguments');
      throw new TypeError('Wrong number of arguments');
    }
    const localEnv = Object.create(env);
    for (let i = 0; i < args.length; i++) {
      localEnv[argNames[i]] = args[i];
    }
    return evaluate(body, localEnv);
  };
};
specialForms['='] = function (args, env) {
  if (args.length !== 2 || args[0].type !== 'word') {
    console.error(args);
    printErrors('Bad use of =');
    throw new SyntaxError('Bad use of =');
  }
  const valName = args[0].name;
  const value = evaluate(args[1], env);
  for (let scope = env; scope; scope = Object.getPrototypeOf(scope)) {
    if (Object.prototype.hasOwnProperty.call(scope, valName)) {
      scope[valName] = value;
      return value;
    }
  }
  printErrors(`Tried setting an undefined constiable: ${valName}`);
  throw new ReferenceError(`Tried setting an undefined constiable: ${valName}`);
};
const topEnv = Object.create(null);
topEnv['true'] = true;
topEnv['false'] = false;
topEnv['null'] = null;
const operatorsMap = {
  ['+']: (first, ...args) => args.reduce((acc, x) => (acc += x), first),
  ['-']: (first, ...args) => args.reduce((acc, x) => (acc -= x), first),
  ['*']: (first, ...args) => args.reduce((acc, x) => (acc *= x), first),
  ['/']: (first, ...args) => args.reduce((acc, x) => (acc /= x), first),
  ['==']: (first, ...args) => args.every(x => first === x),
  ['>']: (first, ...args) => args.every(x => first > x),
  ['<']: (first, ...args) => args.every(x => first < x),
  ['>=']: (first, ...args) => args.every(x => first >= x),
  ['<=']: (first, ...args) => args.every(x => first <= x),
  ['%']: (left, right) => left % right,
  ['**']: (left, right) => left ** right,
  ['++']: operand => ++operand
};
['+', '-', '*', '/', '==', '<', '>', '>=', '<=', '%', '**', '++'].forEach(
  op => {
    topEnv[op] = operatorsMap[op];
  }
);

export default function cell(input) {
  return function (...args) {
    const env = Object.create(topEnv);
    for (const inp in input) {
      env[inp] = input[inp];
    }
    const program = args
      .toString()
      .replace(/\s+|;;.+/g, '')
      .trim();
    return evaluate(parse(program), env);
  };
}
