import { CodeMirror } from './libs/editor/cell.editor.bundle.js';
import cell from './parser/cell.js';
import { std, processing, consoleElement } from './extentions/dna.js';
import { execute } from './commands/exec.js';
export const editor = CodeMirror(
  document.getElementById('editor-container'),
  {}
);
export const deps = { list: {} };
editor.changeFontSize('12px');
editor.setSize(window.innerWidth - 15, window.innerHeight - 80);
let P5;
const updateP5 = () => {
  if (P5) {
    cancelAnimationFrame(P5.draw);
    const canv = P5.createCanvas(0, 0);
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

  window.history.pushState({}, document.title, window.location.pathname);
} else {
  editor.setValue(`
setup(-> (
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
  editor.setSize(window.innerWidth - 15, window.innerHeight - 80);
});

document.addEventListener('keydown', e => {
  const activeElement = document.activeElement;
  if (e.key.toLowerCase() === 's' && (e.ctrlKey || e.metaKey)) {
    e = e || window.event;
    e.preventDefault();
    e.stopPropagation();
    updateP5();
    editor.setSize(window.innerWidth - 15, window.innerHeight - 80);
    canvasContainer.style.display = 'none';
    canvasContainer.innerHTML = '';
    // consoleElement.style.visibility = 'hidden';
    consoleElement.value = '';
    consoleElement.classList.add('info_line');
    consoleElement.classList.remove('error_line');
    P5 = new p5(engine => {
      const { result, env } = cell({ ...std, ...processing(engine) })(
        `|> (${editor.getValue()})`
      );
      deps.list = env;
      return result;
    });
  } else if (e.key.toLowerCase() === 'q' && e.ctrlKey) {
    e = e || window.event;
    e.preventDefault();
    e.stopPropagation();
    if (consoleElement.style.height === '50px') {
      canvasContainer.style.display = 'none';
      canvasContainer.innerHTML = '';
      consoleElement.style.height = `${window.innerHeight / 2 + 40}px`;
      editor.setSize(window.innerWidth - 15, window.innerHeight / 2 - 80);
    } else {
      consoleElement.style.height = `50px`;
      canvasContainer.style.display = 'block';
      editor.setSize(window.innerWidth - 15, window.innerHeight - 80);
    }
  } else if (e.key === 'Enter') {
    if (activeElement === consoleElement) {
      execute(consoleElement);
    }
  }
});
setTimeout(
  () => document.body.removeChild(document.getElementById('splash-screen')),
  1000
);
