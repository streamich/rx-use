import {colorSchemeNoPreference$} from '../colorSchemeNoPreference$';
const {window, _query, _addListener, _removeListener, _mql} = require('../window');

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
    window: wnd,
    _query,
    _addListener,
    _removeListener,
    _mql,
  };
});

beforeEach(() => {
  _addListener.splice(0);
  _removeListener.splice(0);
});

test('can subscribe and unsubscribe', () => {
  colorSchemeNoPreference$.subscribe(() => {}).unsubscribe();
});

test('matches media query for light theme', () => {
  expect(_query[0]).toMatchInlineSnapshot(`"(prefers-color-scheme: no-preference)"`);
});

test('can have multiple subscribers', () => {
  const spy1 = jest.fn();
  const spy2 = jest.fn();

  colorSchemeNoPreference$.subscribe(spy1);
  colorSchemeNoPreference$.subscribe(spy2);

  _mql[0].matches = true;
  _addListener[0]();
  _mql[0].matches = false;
  _addListener[0]();
  _mql[0].matches = true;
  _addListener[0]();

  expect(spy1).toHaveBeenCalledTimes(3);
  expect(spy1.mock.calls[0][0]).toBe(true);
  expect(spy1.mock.calls[1][0]).toBe(false);
  expect(spy1.mock.calls[2][0]).toBe(true);

  expect(spy2).toHaveBeenCalledTimes(3);
  expect(spy2.mock.calls[0][0]).toBe(true);
  expect(spy2.mock.calls[1][0]).toBe(false);
  expect(spy2.mock.calls[2][0]).toBe(true);
});
