import { printErrors } from '../extentions/dna.js';
import { editor } from '../main.js';
import map from '../extentions/map.js';

export const execute = CONSOLE => {
  const CMD = CONSOLE.value.trim();
  editor.focus();
  switch (CMD) {
    case 'encode': {
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
      ].reduce((acc, item) => {
        if (item in map) {
          acc = acc.split(item + '(').join('+' + map[item].i + '(');
        }
        return acc;
      }, value.replace(/\s+/g, ''));
      const encoded =
        location.href +
        '?sketch=' +
        LZUTF8.compress(out.trim(), {
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
    case 'decode': {
      const content = editor.getValue().trim();
      const value = LZUTF8.decompress(
        content.includes('?sketch=') ? content.split('?sketch=')[1] : content,
        {
          inputEncoding: 'Base64',
          outputEncoding: 'String'
        }
      ).trim();

      const matchers = [...new Set(value.match(/\+?\d+\(/g))];
      const keys = Object.keys(map);
      editor.setValue(
        matchers
          .reduce((acc, m) => acc.split(m).join(keys[parseInt(m)] + '('), value)
          .split(':=')
          .join('\n:=')
          .split(';')
          .map(x => (x.includes('->') ? '\n' + x : x))
          .join('; ')
      );
      CONSOLE.value = '';
      return;
    }
  }
};
