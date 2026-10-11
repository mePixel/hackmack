import assert from 'node:assert/strict';
import { init } from '../src/scripts/nav.js';

const nav = {};
const brand = { offsetHeight: 52, closest: () => nav };
const bar = { querySelector: () => brand, classList: { remove() {}, add() {} } };
let observer;
let headerHeight;
globalThis.ResizeObserver = class {
  constructor(callback) { observer = callback; }
  observe(element) { assert.equal(element, brand); }
};
globalThis.getComputedStyle = element => {
  assert.equal(element, nav);
  return { paddingTop: '32px', paddingBottom: '32px' };
};
globalThis.window = { scrollY: 0, addEventListener() {} };
globalThis.document = {
  querySelector: () => bar,
  getElementById: () => null,
  documentElement: { style: { setProperty(name, value) {
    assert.equal(name, '--nav-height');
    headerHeight = value;
  } } },
};

try {
  init(true);
  observer();
  assert.equal(headerHeight, '116px');
  brand.offsetHeight = 78;
  observer();
  assert.equal(headerHeight, '142px');
  console.log('Header clearance follows the wordmark when it wraps.');
} finally {
  for (const key of ['ResizeObserver', 'getComputedStyle', 'window', 'document']) delete globalThis[key];
}
