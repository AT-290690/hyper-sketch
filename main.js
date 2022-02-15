import { CodeMirror } from './libs/editor/cell.editor.bundle.js';
import cell from './parser/cell.js';
import { std, processing, consoleElement } from './extentions/dna.js';
import { execute } from './commands/exec.js';
export const editorContainer = document.getElementById('editor-container');
export const editor = CodeMirror(editorContainer, {});
export const State = { list: {}, lastSelection: '', drawMode: undefined };

editor.changeFontSize('12px');
editor.setSize(window.innerWidth - 15, window.innerHeight - 80);
let P5;
const updateP5 = () => {
  if (P5) {
    let id = setTimeout(function () {}, 0);
    while (id--) clearTimeout(id);
    cancelAnimationFrame(P5.draw);
    const canv = P5.createCanvas(0, 0, State.drawMode);
    canv.parent('canvas-container');
    P5.remove();
  }
};
//  invoke: (inst, method, ...args) => inst[method](...args)
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('s')) {
  editor.setValue(window.location.search.split('?s=')[1].trim());
  execute({ value: 'decode' });
  // .match(/([^()]+|[^(]+\([^)]*\)[^()]*)/g).map(x=>x.length > 1 ? '\n' + x : 'x')
} else {
  editor.setValue(`
setup (-> (
  |> (
    ;; createCanvas ();
))); 
  
draw (-> (
  |> (
    ;; background (30);
)));`);
}
export const canvasContainer = document.getElementById('canvas-container');
window.addEventListener('resize', () => {
  if (canvasContainer.innerHTML) {
    canvasContainer.style.display = 'none';
    canvasContainer.innerHTML = '';
  }
  if (consoleElement.style.height !== '50px') {
    consoleElement.style.width = `90vw`;
    consoleElement.style.height = `50px`;
    consoleElement.style.border = 'none';
  }
  -editor.setSize(window.innerWidth - 15, window.innerHeight - 80);
});

document.addEventListener('keydown', e => {
  const activeElement = document.activeElement;
  if (e.key.toLowerCase() === 's' && (e.ctrlKey || e.metaKey)) {
    e = e || window.event;
    e.preventDefault();
    e.stopPropagation();
    updateP5();
    editor.setSize(window.innerWidth - 15);
    canvasContainer.style.display = 'none';
    canvasContainer.innerHTML = '';
    // consoleElement.style.visibility = 'hidden';
    consoleElement.value = '';
    consoleElement.classList.add('info_line');
    consoleElement.classList.remove('error_line');
    P5 = new p5(engine => {
      const { result, env } = cell({ ...std, ...processing(engine) })(
        `|> (
          ${editor.getValue()}
        )`
      );
      State.list = env;
      return result;
    });
  } else if (e.key.toLowerCase() === 'q' && e.ctrlKey) {
    e = e || window.event;
    e.preventDefault();
    e.stopPropagation();
    const selection = editor.getSelection();
    // const cursor = editor.getCursor();
    if (selection && !selection.includes('print')) {
      State.lastSelection = selection;
      const updatedSelection = `print (${selection})`;
      editor.replaceSelection(updatedSelection);
      // editor.setSelection(
      //   cursor - State.lastSelection.length,
      //   cursor - State.lastSelection.length + updatedSelection.length
      // );
    } else if (selection && State.lastSelection) {
      editor.replaceSelection(State.lastSelection);
      State.lastSelection = '';
    }
  } else if (e.key === 'Enter') {
    if (activeElement === consoleElement) {
      execute(consoleElement);
    }
  }
});

consoleElement.addEventListener('dblclick', () => {
  if (consoleElement.style.height === '50px') {
    consoleElement.style.height = `${window.innerHeight / 2 + 40}px`;
    consoleElement.style.width = `${window.innerWidth}px`;
    consoleElement.style.border = '1px solid var(--border)';
    editor.setSize(undefined, window.innerHeight / 2 - 60);
  } else {
    consoleElement.style.width = `90vw`;
    consoleElement.style.height = `50px`;
    canvasContainer.style.display = 'block';
    consoleElement.style.border = 'none';

    editor.setSize(undefined, window.innerHeight - 80);
  }
});
setTimeout(
  () => document.body.removeChild(document.getElementById('splash-screen')),
  1000
);
