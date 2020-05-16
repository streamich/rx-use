/** @jest-environment node */

import {matchMedia$} from '../matchMedia$';

test('is server', () => {
  expect(typeof window).toBe('undefined');
});

test('holds "false" on server', () => {
  expect(matchMedia$('test').getValue()).toBe(false);
});
