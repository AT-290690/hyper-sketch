import { printErrors } from '../extentions/composition.js';
export const VOID = null;
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
      printErrors(
        "Unexpected token - Expected ';' or ')'" + ' but got ' + program[0]
      );
      throw new SyntaxError(
        "Unexpected token - Expected ';' or ')'" + ' but got ' + program[0]
      );
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
        printErrors(`Undefined variable: ${expr.name}`);
        throw new ReferenceError(`Undefined variable: ${expr.name}`);
      }
    case 'apply':
      if (expr.operator.type === 'word' && expr.operator.name in specialForms) {
        return specialForms[expr.operator.name](expr.args, env);
      }
      const op = evaluate(expr.operator, env);
      if (typeof op !== 'function') {
        printErrors(expr.operator.name + ' is not a function.');
        throw new TypeError(expr.operator.name + ' is not a function.');
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
    console.error(args);
    printErrors('Invalid number of arguments to ?');
    throw new SyntaxError('Invalid number of arguments to ?');
  }
  if (!!evaluate(args[0], env)) {
    return evaluate(args[1], env);
  } else if (args[2]) {
    return evaluate(args[2], env);
  } else {
    return 0;
  }
};
specialForms['*?'] = function (args, env) {
  if (args.length === 0 || args.length % 2 !== 0) {
    printErrors('Invalid number of arguments to *?');
    throw new SyntaxError('Invalid number of arguments to *?');
  }
  let res = 0;
  for (let i = 0; i < args.length; i += 2) {
    if (!!evaluate(args[i], env)) {
      evaluate(args[i + 1], env);
      res = 1;
    }
  }
  return res;
};
specialForms['&&'] = function (args, env) {
  if (args.length === 0) {
    printErrors('Invalid number of arguments to &&');
    throw new SyntaxError('Invalid number of arguments to &&');
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
    printErrors('Invalid number of arguments  to ||');
    throw new SyntaxError('Invalid number of arguments  to ||');
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

specialForms['++?'] = function (args, env) {
  if (args.length !== 2) {
    printErrors('Invalid number of arguments to +?');
    throw new SyntaxError('Invalid number of arguments to +?');
  }
  while (!!evaluate(args[0], env)) {
    evaluate(args[1], env);
  }
  // Cell has no undefined so we return void when there's no meaningful result.
  return VOID;
};

specialForms['=>'] = function (args, env) {
  let value = VOID;
  args.forEach(function (arg) {
    value = evaluate(arg, env);
  });
  return value;
};
specialForms[':='] = function (args, env) {
  if (args?.[0].type !== 'word' || args.length > 2) {
    console.error(args);
    printErrors('Invalid use of operation :=');
    throw new SyntaxError('Invalid use of operation :=');
  }
  // if (args[0].name[0] !== '$') {
  //   printErrors('Variable names like (' + args[0].name + ') must start with $');
  //   throw new SyntaxError('Variable names must start with $');
  // }
  if (args[0].name.includes('!') || args[0].name.includes("'")) {
    printErrors("Variable names can't contain ! and ' characters.");
    throw new SyntaxError("Variable names can't contain ! and ' characters.");
  }

  const value = args.length === 1 ? VOID : evaluate(args[args.length - 1], env);
  env[args[0].name] = value;
  return value;
};
specialForms['+='] = function (args, env) {
  if (args.length === 0 || args[0].type !== 'word') {
    console.error(args);
    printErrors('Invalid use of operation +=');
    throw new SyntaxError('Invalid use of operation +=');
  }
  const valName = args[0].name;
  let value = evaluate(args[0], env);
  const inc = args[1] ? evaluate(args[1], env) : 1;
  for (let scope = env; scope; scope = Object.getPrototypeOf(scope)) {
    if (Object.prototype.hasOwnProperty.call(scope, valName)) {
      value += inc;
      scope[valName] = value;
      return value;
    }
  }
  printErrors(`Tried incrementing an undefined variable: ${valName}`);
  throw new ReferenceError(
    `Tried incrementing an undefined variable: ${valName}`
  );
};
specialForms['-='] = function (args, env) {
  if (args.length === 0 || args[0].type !== 'word') {
    console.error(args);
    printErrors('Invalid use of operation -=');
    throw new SyntaxError('Invalid use of operation -=');
  }
  const valName = args[0].name;
  let value = evaluate(args[0], env);
  const inc = args[1] ? evaluate(args[1], env) : 1;
  for (let scope = env; scope; scope = Object.getPrototypeOf(scope)) {
    if (Object.prototype.hasOwnProperty.call(scope, valName)) {
      value -= inc;
      scope[valName] = value;
      return value;
    }
  }
  printErrors(`Tried incrementing an undefined variable: ${valName}`);
  throw new ReferenceError(
    `Tried incrementing an undefined variable: ${valName}`
  );
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
      printErrors('Invalid number of arguments');
      throw new TypeError('Invalid number of arguments');
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
    printErrors('Invalid use of operation =');
    throw new SyntaxError('Invalid use of operation =');
  }

  const valName = args[0].name;
  const value = evaluate(args[1], env);
  for (let scope = env; scope; scope = Object.getPrototypeOf(scope)) {
    if (Object.prototype.hasOwnProperty.call(scope, valName)) {
      scope[valName] = value;
      return value;
    }
  }
  printErrors(`Tried setting an undefined variable: ${valName}`);
  throw new ReferenceError(`Tried setting an undefined variable: ${valName}`);
};
specialForms['.='] = function (args, env) {
  if (args.length !== 3 || args[0].type !== 'word') {
    console.error(args);
    printErrors('Invalid use of operation .=');
    throw new SyntaxError('Invalid use of operation .=');
  }

  const valName = args[0].name;
  const prop = evaluate(args[1], env);
  const value = evaluate(args[2], env);
  for (let scope = env; scope; scope = Object.getPrototypeOf(scope)) {
    if (Object.prototype.hasOwnProperty.call(scope, valName)) {
      scope[valName][prop] = value;
      return value;
    }
  }
};
specialForms['.-'] = function (args, env) {
  if (args.length !== 2 || args[0].type !== 'word') {
    console.error(args);
    printErrors('Invalid use of operation .-');
    throw new SyntaxError('Invalid use of operation .-');
  }

  const valName = args[0].name;
  const prop = evaluate(args[1], env);
  for (let scope = env; scope; scope = Object.getPrototypeOf(scope)) {
    if (Object.prototype.hasOwnProperty.call(scope, valName)) {
      const value = scope[valName][prop];
      delete scope[valName][prop];
      return value;
    }
  }
};
specialForms['.'] = function (args, env) {
  if (args.length !== 2) {
    console.error(args);
    printErrors('Invalid use of operation .');
    throw new SyntaxError('Invalid use of operation .');
  }

  const valName = args[0].name;

  const prop =
    args[1].type === 'value' ? args[1].value : evaluate(args[1], env);

  for (let scope = env; scope; scope = Object.getPrototypeOf(scope)) {
    if (Object.prototype.hasOwnProperty.call(scope, valName)) {
      return scope[valName][prop];
    }
  }
};

specialForms['::'] = function (args, env) {
  try {
    let count = 0;
    return Object.fromEntries(
      args.reduce((acc, item, i) => {
        if (i % 2) {
          acc[count].push(
            item.type === 'value' ? item.value : evaluate(item, env)
          );
          count++;
        } else acc[count] = [item.value];
        return acc;
      }, [])
    );
  } catch (err) {
    printErrors(err);
  }
};

const topEnv = Object.create(null);
const operatorsMap = {
  ['+']: (first, ...args) => args.reduce((acc, x) => (acc += x), first),
  ['-']: (first, ...args) => args.reduce((acc, x) => (acc -= x), first),
  ['*']: (first, ...args) => args.reduce((acc, x) => (acc *= x), first),
  ['/']: (first, ...args) => args.reduce((acc, x) => (acc /= x), first),
  ['==']: (first, ...args) => +args.every(x => first === x),
  ['!=']: (first, ...args) => +args.every(x => first != x),
  ['>']: (first, ...args) => +args.every(x => first > x),
  ['<']: (first, ...args) => +args.every(x => first < x),
  ['>=']: (first, ...args) => +args.every(x => first >= x),
  ['<=']: (first, ...args) => +args.every(x => first <= x),
  ['%']: (left, right) => left % right,
  ['**']: (left, right) => left ** (right ?? 2)
};
['+', '-', '*', '/', '==', '<', '>', '>=', '<=', '%', '**', '!='].forEach(
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
    const AST = parse(program);
    return { result: evaluate(AST, env), env, AST };
  };
}
