import {LocationFields, HistoryFields} from '../location$';
import {pathname$} from '../pathname$';
const {window, _listeners} = require('../window');

type Listener = {event: string; listener: (...args: any) => void};

const listeners: Listener[] = _listeners;

jest.mock('../window', () => {
  const listeners: Listener[] = [];
  const removedListeners: Listener[] = [];
  const location: LocationFields = {
    hash: '',
    host: 'google.com',
    href: 'http://google.com/path',
    hostname: '',
    origin: '',
    pathname: '/path',
    port: '',
    protocol: '',
    search: '',
  };
  const history: HistoryFields = {
    length: 0,
    state: null,
  };
  const wnd = {
    location,
    history,
    addEventListener: (event, listener) => {
      listeners.push({event, listener});
    },
    removeEventListener: (event, listener) => {
      removedListeners.push({event, listener});
    },
  };
  return {
    window: wnd,
    _listeners: listeners,
    _removedListeners: removedListeners,
  };
});

test('can subscribe', () => {
  pathname$.subscribe(() => {});
});

test('attaches 3 listeners', async () => {
  expect(listeners.length).toBe(3);
});

test('emits immediately on subscription', async () => {
  const spy = jest.fn();
  expect(spy).toHaveBeenCalledTimes(0);
  pathname$.subscribe(spy);
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy.mock.calls[0][0]).toMatchInlineSnapshot(`"/path"`);
});

test('emits when path changes', async () => {
  const spy = jest.fn();
  pathname$.subscribe(spy);
  expect(spy).toHaveBeenCalledTimes(1);
  window.location.href = 'http://google.com/foo';
  window.location.pathname = '/foo';
  const event = new Event('popstate');
  listeners[0].listener(event);
  expect(spy).toHaveBeenCalledTimes(2);
  expect(spy.mock.calls[1][0]).toBe('/foo');
});

test('does not emit when path does not change', async () => {
  window.location.hash = 'foo';
  window.location.href = 'http://google.com/qux#foo';
  window.location.pathname = '/qux';
  listeners[0].listener(new Event('popstate'));

  const spy = jest.fn();
  pathname$.subscribe(spy);
  expect(spy).toHaveBeenCalledTimes(1);

  window.location.hash = 'bar';
  window.location.href = 'http://google.com/qux#bar';
  window.location.pathname = '/qux';
  listeners[0].listener(new Event('popstate'));

  expect(spy).toHaveBeenCalledTimes(1);
});

test('emits when path chagnes - 2', async () => {
  window.location.hash = 'foo';
  window.location.href = 'http://google.com/qux#foo';
  window.location.pathname = '/qux';
  listeners[0].listener(new Event('popstate'));

  const spy = jest.fn();
  pathname$.subscribe(spy);
  expect(spy).toHaveBeenCalledTimes(1);

  window.location.hash = 'bar';
  window.location.href = 'http://google.com/qux2#bar';
  window.location.pathname = '/qux2';
  listeners[0].listener(new Event('popstate'));

  expect(spy).toHaveBeenCalledTimes(2);
  expect(spy.mock.calls[1][0]).toBe('/qux2');
});

test('still only 3 listeners are attached to window global', async () => {
  expect(listeners.length).toBe(3);
});
