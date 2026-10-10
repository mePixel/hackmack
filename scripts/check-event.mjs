import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const html = readFileSync('dist/index.html', 'utf8');
assert(!html.includes('Parley'), 'Old SaaS branding must not reach the homepage');
for (const match of html.matchAll(/href="(?:\/)?#([^"]+)"/g)) {
  assert(html.includes(`id="${match[1]}"`), `Missing anchor: ${match[1]}`);
}
assert(html.includes('<h1'), 'Missing primary heading');
assert(html.includes('id="cta"'), 'Missing registration section');
assert(!existsSync('dist/pricing/index.html'), 'Legacy pricing route is still published');
assert(!existsSync('dist/blog/index.html'), 'Legacy blog is still published');
assert(!html.includes('parley.startfrom.co'), 'Original canonical domain remains');
if (html.includes('Sample edition')) {
  assert(html.includes('Applications opening soon'), 'Sample registration state must be visible');
  assert(!html.includes('<form'), 'Sample edition must not simulate registration');
}
console.log('Event page, anchors, metadata, and route checks passed.');

// Verify the reused step controls update visibility and pressed state together.
const makeElement = () => ({
  hidden: false,
  attributes: {},
  active: false,
  classList: { toggle(_name, active) { this.active = active; } },
  setAttribute(name, value) { this.attributes[name] = value; },
  addEventListener(_name, callback) { this.click = callback; },
});
const pills = Array.from({ length: 3 }, makeElement);
const stages = Array.from({ length: 3 }, makeElement);
globalThis.document = { getElementById: () => ({ querySelectorAll: selector => selector === '.hiw__pill' ? pills : stages }) };
const { init } = await import('../src/scripts/how-it-works.js');
init();
pills[2].click();
assert.deepEqual(stages.map(stage => stage.hidden), [true, true, false]);
assert.deepEqual(pills.map(pill => pill.attributes['aria-pressed']), ['false', 'false', 'true']);
pills[0].click();
assert.deepEqual(stages.map(stage => stage.hidden), [false, true, true]);
delete globalThis.document;
console.log('Event step interaction checks passed.');
