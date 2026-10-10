import assert from 'node:assert/strict';
import { init } from '../src/scripts/delegation.js';
const element = (step) => ({
  dataset: { step: String(step) },
  classList: { toggle() {} },
  setAttribute(key, value) { this[key] = value; },
  closest() { return this; },
  addEventListener(type, handler) { this[type] = handler; },
  focus() { document.activeElement = this; },
});
const buttons = [element(0), element(1)];
const mocks = [element(0), element(1)];
const stage = {};
const tablist = element(0);
const media = { matches: true, addEventListener(_, handler) { this.change = handler; } };
globalThis.window = { matchMedia: () => media };
globalThis.document = { getElementById: () => ({
  querySelectorAll: selector => selector === '.feature__btn' ? buttons : mocks,
  querySelector: selector => ({ '.stage': stage, '.features': tablist, '.delegation__inner': { style: { setProperty() {} } } })[selector],
}) };
try {
  init(true);
  buttons[0].click();
  assert.equal(stage.hidden, true);
  assert(mocks.every(mock => mock.hidden));
  assert.equal(buttons[0].tabIndex, 0);
  buttons[0].click();
  assert.equal(stage.hidden, false);
  const animations = [];
  stage.getBoundingClientRect = () => ({ height: 340 });
  stage.animate = (frames) => {
    const animation = { frames, cancel() { this.onfinish = null; } };
    animations.push(animation);
    return animation;
  };
  media.matches = true;
  init(false);
  buttons[0].click();
  assert.equal(stage.hidden, false, 'Closing panel stays visible until animation ends');
  assert.equal(stage.inert, true);
  assert.deepEqual(animations.at(-1).frames.height, ['340px', '0px']);
  animations.at(-1).onfinish();
  assert.equal(stage.hidden, true);
  buttons[0].click();
  assert.equal(stage.hidden, false);
  assert.equal(stage.inert, false);
  assert.deepEqual(animations.at(-1).frames.height, ['0px', '340px']);
  buttons[0].click();
  const interrupted = animations.at(-1);
  buttons[1].click();
  assert.equal(interrupted.onfinish, null);
  assert.equal(stage.hidden, false);
  init(true);
  assert.equal(mocks[0].hidden, false);
  buttons[1].click();
  assert.deepEqual(mocks.map(mock => mock.hidden), [true, false]);
  buttons[1].click();
  buttons[1].focus();
  tablist.keydown({ key: 'ArrowLeft', preventDefault() {} });
  assert.equal(stage.hidden, false);
  buttons[0].click();
  media.matches = false;
  media.change();
  assert.equal(stage.hidden, false);
  buttons[0].click();
  assert.equal(stage.hidden, false);
  console.log('Challenge collapse, reopen, switching, keyboard, and desktop checks passed.');
} finally {
  delete globalThis.window;
  delete globalThis.document;
}
