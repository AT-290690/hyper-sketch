import { consoleElement, printErrors } from '../extentions/composition.js';
import { editor, runP5, State } from '../main.js';
import { DEPENDENCY_LIST } from '../extentions/dependencies.js';
const HASH_TRESHOLD = 3;
const ABC =
  'abcdefghijklmnopqrstuvwxyz'.toUpperCase() + 'abcdefghijklmnopqrstuvwxyz';

export const execute = CONSOLE => {
  const CMD = CONSOLE.value.split(' ')[0].trim().toUpperCase();

  switch (CMD) {
    case 'ENCODE':
      {
        window.history.pushState({}, document.title, window.location.pathname);
        const limit = 2000;
        const value = editor.getValue().replace(/;;.+/g, '');
        const wordTokens = value
          .replace(/[^0-9a-zA-Z]+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .split(' ')
          .filter(x => isNaN(+x));

        const words = wordTokens.filter(x => x.length > HASH_TRESHOLD);
        const out = [...new Set(words)]
          .reduce((acc, item, items) => {
            if (item in DEPENDENCY_LIST) {
              acc = acc
                .split(item + '(')
                .join('!' + DEPENDENCY_LIST[item] + '(');
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
        const ignoreSet = new Set(value.match(/\$[a-zA-Z0-9]+/g));
        const tokenSet = new Set([...wordTokens]);
        const abc = [...ABC].filter(x => !tokenSet.has(x));
        [
          ...new Set(
            words.filter(
              x => !(x in DEPENDENCY_LIST) && !ignoreSet.has('$' + x)
            )
          )
        ]
          .sort((a, b) => (a.length > b.length ? -1 : 1))
          .slice(0, ABC.length)
          .forEach(x => {
            out.result = out.result.replaceAll(x, abc.pop());
          });

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
          consoleElement.value = '';
          CONSOLE.style.display = 'none';
        }
        setTimeout(() => editor.focus(), 250);
      }
      break;
    case 'DECODE':
      {
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
          // .split('')
          // .map((x, i) => ((i + 1) % 85 === 0 ? x + '\n' : x))
          // .join('')
          // .split(':=(')
          // .join('\n:=(')
          // .split(';')
          // .map(x => (x.includes('->') ? '\n' + x : x))
          // .join('; ')
        );
        CONSOLE.value = '';
        consoleElement.value = '';
        CONSOLE.style.display = 'none';
      }
      editor.focus();

      break;
    case 'DECODE_RAW':
      {
        const val = editor.getValue().trim();

        editor.setValue(
          LZUTF8.decompress(
            val.includes(location.href + '?s=')
              ? val.replace(location.href + '?s=', '')
              : val,
            {
              inputEncoding: 'Base64',
              outputEncoding: 'String'
            }
          )
        );
        CONSOLE.value = '';
        consoleElement.value = '';
      }
      break;
    case 'UPDATE_DEPENDENCY_LIST':
      {
        console.log(
          JSON.stringify(
            [...new Set(Object.keys(State.list).map(x => x.replace('.', '')))]
              .filter(x => x.length > HASH_TRESHOLD)
              .sort((a, b) => (a.length > b.length ? 1 : -1))
              .reduce((acc, item, index) => {
                acc[item] = index;
                return acc;
              }, {})
          )
        );
        CONSOLE.value = '';
        consoleElement.value = '';
        // CONSOLE.style.display = 'none';
      }
      break;
    case 'CLEAR':
      {
        window.history.pushState({}, document.title, window.location.pathname);
        editor.setValue('');
        CONSOLE.value = '';
        // CONSOLE.style.display = 'none';
        consoleElement.value = '';
      }
      break;
    case 'RESET':
      {
        window.history.pushState({}, document.title, window.location.pathname);
        editor.setValue(`
setup (-> (
  => (
    ;; createCanvas ();
))); 
  
draw (-> (
  => (
    ;; background (30);
)));`);
        CONSOLE.value = '';
        // CONSOLE.style.display = 'none';
        consoleElement.value = '';
      }
      break;
    case '>.':
      {
        const str = CONSOLE.value.split('>. ')[1];
        CONSOLE.value = str
          .split('')
          .map((_, i) => str.charCodeAt(i))
          .join(';');
      }
      break;
    case '<.':
      {
        const str = CONSOLE.value.split('<. ')[1];
        CONSOLE.value = String.fromCharCode(...str.split(';'));
      }
      break;
    case 'SAVE':
      runP5();
      CONSOLE.value = '';
      consoleElement.value = '';
      CONSOLE.style.display = 'none';
      break;
    case 'HELP':
      // CONSOLE.value = 'ENCODE: encode \nDECODE: \nCLEAR:  \nRESET:';
      // CONSOLE.style.display = 'none';
      break;
    default:
      printErrors(CMD + ' does not exist!');
      break;
  }
};
