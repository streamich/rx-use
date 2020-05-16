import {matchMedia$} from '../matchMedia$';
const {window, _query, _addListener, _removeListener, _mql} = require('../window');

jest.mock('../window', () => {
  const _query: string[] = [];
  const _addListener: any[] = [];
  const _removeListener: any[] =  []
  const _mql: any[] =  []
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
  _query.splice(0);
  _addListener.splice(0);
  _removeListener.splice(0);
  _mql.splice(0);
});

test('can subscribe and unsubscribe', () => {
  matchMedia$('test').subscribe(() => {}).unsubscribe();
});

test('subscribes to the right query', () => {
  matchMedia$('prefers-reduced-motion').subscribe(() => {});
  expect(_query[0]).toBe('prefers-reduced-motion');
});

test('subscribes and unsubscribes to media query listeners', () => {
  const subscription = matchMedia$('test').subscribe(() => {});

  expect(_addListener.length).toBe(1);
  expect(_removeListener.length).toBe(0);

  subscription.unsubscribe();

  expect(_addListener.length).toBe(1);
  expect(_removeListener.length).toBe(1);
});

test('returns synchronously latest value', () => {
  const value = matchMedia$('test').getValue();
  expect(value).toBe(false);
});

test('subscribes and unsubscribes to media query listeners', () => {
  const spy = jest.fn();
  matchMedia$('test').subscribe(spy);

  _mql[0].matches = true;
  _addListener[0]();

  _mql[0].matches = false;
  _addListener[0]();

  _mql[0].matches = true;
  _addListener[0]();
  
  expect(spy).toHaveBeenCalledTimes(3);
  expect(spy.mock.calls[0][0]).toBe(true);
  expect(spy.mock.calls[1][0]).toBe(false);
  expect(spy.mock.calls[2][0]).toBe(true);
});

test('does not emit the same value', () => {
  const spy = jest.fn();
  matchMedia$('test').subscribe(spy);

  _mql[0].matches = true;
  _addListener[0]();
  _mql[0].matches = true;
  _addListener[0]();
  _mql[0].matches = true;
  _addListener[0]();

  _mql[0].matches = false;
  _addListener[0]();
  _mql[0].matches = false;
  _addListener[0]();
  _mql[0].matches = false;
  _addListener[0]();
  
  _mql[0].matches = true;
  _addListener[0]();
  
  expect(spy).toHaveBeenCalledTimes(3);
  expect(spy.mock.calls[0][0]).toBe(true);
  expect(spy.mock.calls[1][0]).toBe(false);
  expect(spy.mock.calls[2][0]).toBe(true);
});
