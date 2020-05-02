import {windowSize$, SizeWindow} from '../windowSize$';
const {window, _listeners} = require('../window');

type Listener = {event: string; listener: (...args: any) => void};

const listeners: Listener[] = _listeners;

jest.mock('../window', () => {
  const listeners: Listener[] = [];
  const removedListeners: Listener[] = [];
  const wnd: SizeWindow = {
    innerHeight: -1,
    innerWidth: -1,
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
  windowSize$.subscribe(() => {});
});

test('attaches 1 listener', () => {
  expect(listeners.length).toBe(1);
  expect(listeners).toMatchInlineSnapshot(`
    Array [
      Object {
        "event": "resize",
        "listener": [Function],
      },
    ]
  `);
});

test('holds default state', () => {
  expect(windowSize$.getValue()).toMatchInlineSnapshot(`
    Object {
      "height": -1,
      "width": -1,
    }
  `);
});

test('emits new value when window resizes', () => {
  const spy = jest.fn();
  windowSize$.subscribe(spy);
  expect(spy).toHaveBeenCalledTimes(1);
  window.innerWidth = 1024;
  window.innerHeight = 768;
  listeners[0].listener(new Event('resize'));
  expect(spy).toHaveBeenCalledTimes(2);
});

test('does not emit new value when window size hasn\'t changed', () => {
  const spy = jest.fn();
  windowSize$.subscribe(spy);
  expect(spy).toHaveBeenCalledTimes(1);
  listeners[0].listener(new Event('resize'));
  expect(spy).toHaveBeenCalledTimes(1);
});

test('multiple resizes with multiple subscribers work', () => {
  const spy1 = jest.fn();
  const spy2 = jest.fn();
  const sub1 = windowSize$.subscribe(spy1);

  expect(spy1).toHaveBeenCalledTimes(1);
  expect(spy2).toHaveBeenCalledTimes(0);

  listeners[0].listener(new Event('resize'));

  const sub2 = windowSize$.subscribe(spy2);

  expect(spy1).toHaveBeenCalledTimes(1);
  expect(spy2).toHaveBeenCalledTimes(1);

  window.innerWidth = 1111;
  window.innerHeight = 2222;
  listeners[0].listener(new Event('resize'));

  expect(spy1).toHaveBeenCalledTimes(2);
  expect(spy2).toHaveBeenCalledTimes(2);

  window.innerWidth = 333;
  listeners[0].listener(new Event('resize'));

  expect(spy1).toHaveBeenCalledTimes(3);
  expect(spy2).toHaveBeenCalledTimes(3);

  window.innerHeight = 555;
  listeners[0].listener(new Event('resize'));

  expect(spy1).toHaveBeenCalledTimes(4);
  expect(spy2).toHaveBeenCalledTimes(4);

  sub1.unsubscribe();

  window.innerHeight = 666;
  listeners[0].listener(new Event('resize'));

  expect(spy1).toHaveBeenCalledTimes(4);
  expect(spy2).toHaveBeenCalledTimes(5);

  sub2.unsubscribe();

  window.innerHeight = 777;
  listeners[0].listener(new Event('resize'));

  expect(spy1).toHaveBeenCalledTimes(4);
  expect(spy2).toHaveBeenCalledTimes(5);
});

test('still has a single global event listener', () => {
  expect(listeners.length).toBe(1);
});
