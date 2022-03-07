import { consoleElement, printErrors } from '../extentions/composition.js';
import { editor, runP5, State } from '../main.js';
import { decodeUrl, encodeUrl, updateDepsList } from './utils.js';
import { DEPENDENCY_LIST } from '../extentions/dependencies.js';

export const execute = CONSOLE => {
  const CMD = CONSOLE.value.split(' ')[0].trim().toUpperCase();
  switch (CMD) {
    case 'ENCODE':
      {
        window.history.pushState({}, document.title, window.location.pathname);
        encodeUrl(
          editor.getValue(),
          DEPENDENCY_LIST,
          encoded => {
            editor.setValue(encoded);
            CONSOLE.value = '';
            consoleElement.value = '';
            setTimeout(() => editor.focus(), 250);
          },
          2000
        );
      }
      break;
    case 'DECODE':
      {
        decodeUrl(editor.getValue(), DEPENDENCY_LIST, url => {
          editor.setValue(url);
          CONSOLE.value = '';
          consoleElement.value = '';
          editor.focus();
        });
      }
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
        updateDepsList(State.list);
        CONSOLE.value = '';
        consoleElement.value = '';
      }
      break;
    case 'CLEAR':
      {
        window.history.pushState({}, document.title, window.location.pathname);
        editor.setValue('');
        CONSOLE.value = '';
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
      break;
    case 'HELP':
      // CONSOLE.value = 'ENCODE: encode \nDECODE: \nCLEAR:  \nRESET:';
      break;
    default:
      printErrors(CMD + ' does not exist!');
      break;
  }
};
