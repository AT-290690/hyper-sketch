import { printErrors } from '../extentions/dna.js';
import { editor, deps } from '../main.js';
import { DEPENDENCY_LIST } from '../extentions/dependencies.js';

export const execute = CONSOLE => {
  const CMD = CONSOLE.value.trim().toUpperCase();
  editor.focus();
  switch (CMD) {
    case 'ENCODE': {
      const limit = 2000;
      const value = editor.getValue().replace(/;;.+/g, '');
      let out = [
        ...new Set(
          value
            .replace(/[^0-9a-zA-Z]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .split(' ')
            .filter(x => x.length > 1 && isNaN(x))
        )
      ]
        .reduce((acc, item, items) => {
          if (item in DEPENDENCY_LIST) {
            acc = acc.split(item + '(').join('!' + DEPENDENCY_LIST[item] + '(');
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
                acc.result += "'" + acc.count;
                acc.count = 0;
              }
              acc.result += item;
            }

            return acc;
          },
          { result: '', count: 0 }
        );
      if (out.count > 0) {
        out.result += "'" + out.count;
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
      const keys = Object.keys(DEPENDENCY_LIST);
      const prefix = [...new Set(value.match(/\!?\d+\(/g))];
      const suffix = [...new Set(value.match(/\'+?\d+/g))];
      const matcher = suffix.reduce(
        (acc, m) => acc.split(m).join(')'.repeat(parseInt(m.substring(1)))),
        prefix.reduce(
          (acc, m) => acc.split(m).join(keys[parseInt(m.substring(1))] + '('),
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
    case 'DECODE_RAW': {
      editor.setValue(
        LZUTF8.decompress(editor.getValue().trim(), {
          inputEncoding: 'Base64',
          outputEncoding: 'String'
        })
      );
    }
    case 'UPDATE_DEPENDENCY_LIST': {
      console.log(
        JSON.stringify(
          [...new Set(Object.keys(deps.list).map(x => x.replace('.', '')))]
            .filter(x => x.length > 1)
            .sort((a, b) => (a.length > b.length ? 1 : -1))
            .reduce((acc, item, index) => {
              acc[item] = index;
              return acc;
            }, {})
        )
      );
      return;
    }
  }
};
