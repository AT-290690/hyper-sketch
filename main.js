import { CodeMirror } from './libs/editor/cell.editor.bundle.js';
import cell from './parser/parser.js';
import {
  std,
  processing,
  consoleElement,
  editorContainer
} from './extentions/composition.js';
import { execute } from './commands/exec.js';
export const editor = CodeMirror(editorContainer, {});
export const State = {
  list: {},
  lastSelection: '',
  drawMode: undefined,
  AST: {},
  activeWindow: editorContainer
};

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

export const runP5 = () => {
  updateP5();
  editor.setSize(window.innerWidth - 15);
  canvasContainer.style.display = 'none';
  canvasContainer.innerHTML = '';
  // consoleElement.style.visibility = 'hidden';
  consoleElement.value = '';
  consoleElement.classList.add('info_line');
  consoleElement.classList.remove('error_line');
  P5 = new p5(engine => {
    const { result, env, AST } = cell({ ...std, ...processing(engine) })(
      `=> (
        ${editor.getValue()}
      )`
    );
    State.list = env;
    State.AST = AST;
    return result;
  });
};

export const canvasContainer = document.getElementById('canvas-container');
canvasContainer.addEventListener(
  'click',
  () => (State.activeWindow = canvasContainer)
);
editorContainer.addEventListener(
  'click',
  () => (State.activeWindow = editorContainer)
);

window.addEventListener('resize', () => {
  if (canvasContainer.innerHTML) {
    canvasContainer.style.display = 'none';
    canvasContainer.innerHTML = '';
  }

  editor.setSize(window.innerWidth - 15, window.innerHeight - 80);
});

document.addEventListener('keydown', e => {
  const activeElement = document.activeElement;
  if (e.key.toLowerCase() === 's' && (e.ctrlKey || e.metaKey)) {
    e = e || window.event;
    e.preventDefault();
    e.stopPropagation();
    runP5();
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
  } else if (e.key === 'Escape') {
    if (activeElement === consoleElement) {
      editor.focus();
      State.activeWindow = editorContainer;
    } else if (State.activeWindow === editorContainer) {
      consoleElement.focus();
    }
  }
});

setTimeout(() => {
  document.body.removeChild(document.getElementById('splash-screen'));
  editor.setValue(`
setup (-> (
  => (
    ;; createCanvas ();
))); 
  
draw (-> (
  => (
    ;; background (30);
)));`);
}, 1000);
