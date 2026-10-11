import assert from 'node:assert/strict';
import { init } from '../src/scripts/pricing.js';

const cards = [false, false].map((featured) => {
  const card = new EventTarget();
  card.featured = featured;
  card.classList = { toggle(name, active) {
    assert.equal(name, 'is-featured');
    card.featured = active;
  } };
  return card;
});
globalThis.document = {
  querySelectorAll: (selector) => selector === '.plans'
    ? [{ querySelectorAll: () => cards }]
    : [],
};

try {
  init(true);
  cards[0].dispatchEvent(new Event('pointerenter'));
  cards[0].dispatchEvent(new Event('pointerleave'));
  assert.deepEqual(cards.map(card => card.featured), [false, false]);
  cards[1].dispatchEvent(new Event('focusin'));
  cards[1].dispatchEvent(new Event('focusout'));
  assert.deepEqual(cards.map(card => card.featured), [false, false]);
  cards[0].dispatchEvent(new Event('click'));
  assert.deepEqual(cards.map(card => card.featured), [false, false]);
  console.log('Schedule cards stay static after hover, focus, and tap.');
} finally {
  delete globalThis.document;
}
