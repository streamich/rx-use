/** @jest-environment node */

import {onLine$} from '../onLine$';

test('is server', () => {
  expect(typeof window).toBe('undefined');
});

test('holds "true" on server', () => {
  expect(onLine$.getValue()).toBe(true);
});
