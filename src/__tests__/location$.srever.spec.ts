/** @jest-environment node */

import {location$} from '../location$';

test('is server', () => {
  expect(typeof window).toBe('undefined');
});

test('holds default state on server', () => {
  expect(location$.getValue()).toMatchInlineSnapshot(`
    Object {
      "event": "load",
      "hash": "",
      "host": "",
      "hostname": "",
      "href": "",
      "length": 0,
      "origin": "",
      "pathname": "",
      "port": "",
      "protocol": "",
      "search": "",
      "state": null,
    }
  `);
});
