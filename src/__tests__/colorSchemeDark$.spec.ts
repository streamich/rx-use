import {colorSchemeDark$} from '../colorSchemeDark$';
const {_query, _addListener, _mql} = require('../window');

jest.mock('../window', () => {
  const _query: string[] = [];
  const _addListener: any[] = [];
  const _removeListener: any[] = [];
  const _mql: any[] = [];
  const wnd: Window = {
    matchMedia: (query) => {
      _query.push(query);
      const addListener = (listener) => {
        _addListener.push(listener);
      };
      const removeListener = (listener) => {
        _removeListener.push(listener);
      };
      const mql = {
        matches: false,
        addListener,
        removeListener,
      };

      _mql.push(mql);

      return mql;
    },
  } as any;
  return {
    wnd,
    _query,
    _addListener,
    _removeListener,
    _mql,
  };
});

test('can subscribe and unsubscribe', () => {
  colorSchemeDark$.subscribe(() => {}).unsubscribe();
});

test('matches media query for dark theme', () => {
  expect(_query[0]).toMatchInlineSnapshot(`"(prefers-color-scheme: dark)"`);
});

test('can have multiple subscribers', () => {
  const spy1 = jest.fn();
  const spy2 = jest.fn();

  colorSchemeDark$.subscribe(spy1);
  colorSchemeDark$.subscribe(spy2);

  _mql[0].matches = true;
  _addListener[0]();
  _mql[0].matches = false;
  _addListener[0]();
  _mql[0].matches = true;
  _addListener[0]();

  expect(spy1).toHaveBeenCalledTimes(4);
  expect(spy1.mock.calls[1][0]).toBe(true);
  expect(spy1.mock.calls[2][0]).toBe(false);
  expect(spy1.mock.calls[3][0]).toBe(true);

  expect(spy2).toHaveBeenCalledTimes(4);
  expect(spy2.mock.calls[1][0]).toBe(true);
  expect(spy2.mock.calls[2][0]).toBe(false);
  expect(spy2.mock.calls[3][0]).toBe(true);
});
