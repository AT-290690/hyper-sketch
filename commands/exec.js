import { printErrors } from '../extentions/dna.js';
import { editor } from '../main.js';
import map from '../extentions/map.js';

export const execute = CONSOLE => {
  const CMD = CONSOLE.value.trim().toUpperCase();
  editor.focus();
  switch (CMD) {
    case 'ENCODE': {
      const limit = 2000;
      const value = editor.getValue().replace(/;;.+/g, '');
      const out = [
        ...new Set(
          value
            .replace(/[^$a-zA-z\d]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .split(' ')
            .filter(x => x.length > 3 && x[0] !== '$' && isNaN(x))
        )
      ]
        .reduce((acc, item) => {
          if (item in map) {
            acc = acc.split(item + '(').join('+' + map[item] + '(');
          }
          return acc;
        }, value.replace(/\s+/g, ''))
        .split(');)')
        .join('))')
        .split('')
        .reduce(
          (acc, item, index, items) => {
            if (item === ')') {
              acc.count++;
            } else {
              if (acc.count === 1) {
                acc.result += ')';
                acc.count = 0;
              } else if (acc.count > 1) {
                acc.result += '#' + acc.count;
                acc.count = 0;
              }
              acc.result += item;
            }

            return acc;
          },
          { result: '', count: 0 }
        );
      if (out.count > 0) {
        out.result += '#' + out.count;
      }
      const encoded =
        location.href +
        '?s=' +
        LZUTF8.compress(out.result.trim(), {
          outputEncoding: 'Base64'
        });
      if (encoded.length > limit) {
        printErrors(
          `Sketch is too large. Expected < (sketch; ${limit}). Reduce your sketch by ${
            limit - encoded.length
          } chararacters.`
        );
      } else {
        editor.setValue(encoded);
        CONSOLE.value = '';
      }

      return;
    }
    case 'DECODE': {
      const content = editor
        .getValue()
        .trim()
        .replace(location.href + '?s=', '');
      const value = LZUTF8.decompress(content, {
        inputEncoding: 'Base64',
        outputEncoding: 'String'
      }).trim();
      const keys = Object.keys(map);
      const prefix = [...new Set(value.match(/\+?\d+\(/g))];
      const suffix = [...new Set(value.match(/\#+?\d+/g))];
      const matcher = suffix.reduce(
        (acc, m) => acc.split(m).join(')'.repeat(parseInt(m.substring(1)))),
        prefix.reduce(
          (acc, m) => acc.split(m).join(keys[parseInt(m)] + '('),
          value
        )
      );

      editor.setValue(
        matcher
          .split(':=(')
          .join('\n:=(')
          .split(';')
          .map(x => (x.includes('->') ? '\n' + x : x))
          .join('; ')
      );
      CONSOLE.value = '';
      return;
    }
  }
};
