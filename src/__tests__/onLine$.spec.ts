import {onLine$} from '../onLine$';
const {wnd: window, _listeners} = require('../window');

type Listener = {event: string; listener: (...args: any) => void};

const listeners: Listener[] = _listeners;

jest.mock('../window', () => {
  const listeners: Listener[] = [];
  const removedListeners: Listener[] = [];
  const wnd: Window = {
    navigator: {
      onLine: true,
    },
    addEventListener: (event, listener) => {
      listeners.push({event, listener});
    },
    removeEventListener: (event, listener) => {
      removedListeners.push({event, listener});
    },
  } as any;
  return {
    wnd,
    _listeners: listeners,
    _removedListeners: removedListeners,
  };
});

test('can subscribe', () => {
  onLine$.subscribe(() => {});
});

test('returns initial value', () => {
  expect(onLine$.getValue()).toBe(true);
});

test('attaches 1 listener', () => {
  expect(listeners.length).toBe(1);
  expect(listeners).toMatchInlineSnapshot(`
    Array [
      Object {
        "event": "online",
        "listener": [Function],
      },
    ]
  `);
});

test('does not emit if online state does not change', async () => {
  const spy = jest.fn();
  onLine$.subscribe(spy);
  expect(spy).toHaveBeenCalledTimes(1);
  listeners[0].listener(new Event('online'));
  expect(spy).toHaveBeenCalledTimes(1);
});

test('emits when online status changes', async () => {
  const spy = jest.fn();
  onLine$.subscribe(spy);
  expect(spy).toHaveBeenCalledTimes(1);

  window.navigator.onLine = false;
  listeners[0].listener(new Event('online'));

  expect(spy).toHaveBeenCalledTimes(2);
  expect(spy.mock.calls[1][0]).toBe(false);

  listeners[0].listener(new Event('online'));
  window.navigator.onLine = true;
  listeners[0].listener(new Event('online'));

  expect(spy).toHaveBeenCalledTimes(3);
  expect(spy.mock.calls[2][0]).toBe(true);
});

test('still has a single global event listener', () => {
  expect(listeners.length).toBe(1);
});
