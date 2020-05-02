/** @jest-environment node */

import {windowSize$} from '../windowSize$';

test('is server', () => {
  expect(typeof window).toBe('undefined');
});

test('holds default state on server', () => {
  expect(windowSize$.getValue()).toMatchInlineSnapshot(`
    Object {
      "height": 0,
      "width": 0,
    }
  `);
});
