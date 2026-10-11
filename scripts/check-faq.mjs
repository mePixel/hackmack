import assert from 'node:assert/strict';
import { init } from '../src/scripts/faq.js';

const items = Array.from({ length: 2 }, () => {
  const summary = new EventTarget();
  const animations = [];
  const answer = {
    offsetHeight: 40, scrollHeight: 40, style: {},
    animate() {
      const animation = { cancel() {} };
      animations.push(animation);
      return animation;
    },
  };
  return {
    summary, animations, open: false,
    querySelector: selector => selector === 'summary' ? summary : answer,
    setAttribute() { this.open = true; },
    removeAttribute() { this.open = false; },
    hasAttribute() { return this.open; },
  };
});
globalThis.document = { querySelectorAll: () => items };

try {
  init(true);
  const click = item => {
    item.summary.dispatchEvent(new Event('click', { cancelable: true }));
    item.animations.at(-1).onfinish();
  };
  click(items[0]);
  click(items[1]);
  assert.deepEqual(items.map(item => item.open), [true, true]);
  click(items[0]);
  assert.deepEqual(items.map(item => item.open), [false, true]);
  console.log('FAQ answers open and close independently.');
} finally {
  delete globalThis.document;
}
