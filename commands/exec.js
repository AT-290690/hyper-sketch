import { printErrors } from '../extentions/dna.js';
import { editor } from '../main.js';

export const execute = console => {
  const CMD = console.value.trim();
  editor.focus();
  switch (CMD) {
    case 'encode': {
      const limit = 2000;
      const encoded =
        location.href +
        '?sketch=' +
        LZUTF8.compress(
          editor
            .getValue()
            .replace(/\s+|;;.+/g, '')
            .trim(),
          {
            outputEncoding: 'Base64'
          }
        );
      if (encoded.length > limit) {
        printErrors(
          `Sketch is too large. Expected < (sketch; ${limit}). Reduce your sketch by ${
            limit - encoded.length
          } chararacters.`
        );
      } else {
        editor.setValue(encoded);
        console.value = '';
      }

      return;
    }
    case 'decode': {
      const val = editor.getValue().trim();
      editor.setValue(
        LZUTF8.decompress(
          val.includes('?sketch=') ? val.split('?sketch=')[1] : val,
          {
            inputEncoding: 'Base64',
            outputEncoding: 'String'
          }
        )
          .split('|>(')
          .join('\n|>(')
          .split(':=')
          .join('\n:=')
          .split(';')
          .join('; ')
      );
      console.value = '';
      return;
    }
  }
};
