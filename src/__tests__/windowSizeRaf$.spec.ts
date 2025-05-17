import {SizeWindow} from '../windowSize$';
import {windowSizeRaf$} from '../windowSizeRaf$';
const {wnd, _listeners} = require('../window');

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
    wnd,
    _listeners: listeners,
    _removedListeners: removedListeners,
  };
});

test('can subscribe', () => {
  windowSizeRaf$.subscribe(() => {});
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
  expect(windowSizeRaf$.getValue()).toMatchInlineSnapshot(`
    Object {
      "height": -1,
      "width": -1,
    }
  `);
});

test('emits new value when window resizes', () => {
  const spy = jest.fn();
  windowSizeRaf$.subscribe(spy);
  expect(spy).toHaveBeenCalledTimes(1);
  wnd.innerWidth = 1024;
  wnd.innerHeight = 768;
  listeners[0].listener(new Event('resize'));
  expect(spy).toHaveBeenCalledTimes(2);
});

test("does not emit new value when window size hasn't changed", () => {
  const spy = jest.fn();
  windowSizeRaf$.subscribe(spy);
  expect(spy).toHaveBeenCalledTimes(1);
  listeners[0].listener(new Event('resize'));
  expect(spy).toHaveBeenCalledTimes(1);
});

test('multiple resizes with multiple subscribers work', () => {
  const spy1 = jest.fn();
  const spy2 = jest.fn();
  const sub1 = windowSizeRaf$.subscribe(spy1);

  expect(spy1).toHaveBeenCalledTimes(1);
  expect(spy2).toHaveBeenCalledTimes(0);

  listeners[0].listener(new Event('resize'));

  const sub2 = windowSizeRaf$.subscribe(spy2);

  expect(spy1).toHaveBeenCalledTimes(1);
  expect(spy2).toHaveBeenCalledTimes(1);

  wnd.innerWidth = 1111;
  wnd.innerHeight = 2222;
  listeners[0].listener(new Event('resize'));

  expect(spy1).toHaveBeenCalledTimes(2);
  expect(spy2).toHaveBeenCalledTimes(2);

  wnd.innerWidth = 333;
  listeners[0].listener(new Event('resize'));

  expect(spy1).toHaveBeenCalledTimes(3);
  expect(spy2).toHaveBeenCalledTimes(3);

  wnd.innerHeight = 555;
  listeners[0].listener(new Event('resize'));

  expect(spy1).toHaveBeenCalledTimes(4);
  expect(spy2).toHaveBeenCalledTimes(4);

  sub1.unsubscribe();

  wnd.innerHeight = 666;
  listeners[0].listener(new Event('resize'));

  expect(spy1).toHaveBeenCalledTimes(4);
  expect(spy2).toHaveBeenCalledTimes(5);

  sub2.unsubscribe();

  wnd.innerHeight = 777;
  listeners[0].listener(new Event('resize'));

  expect(spy1).toHaveBeenCalledTimes(4);
  expect(spy2).toHaveBeenCalledTimes(5);
});

test('still has a single global event listener', () => {
  expect(listeners.length).toBe(1);
});
