import {raf, WindowWithRaf} from '../raf';
import {Subject} from 'rxjs';
const {flush} = require('../window');

jest.mock('../window', () => {
  const listeners: Array<[number, (...args: any) => any]> = [];
  const flush = () => {
    const copy = [...listeners];
    listeners.splice(0);
    for (const [, listener] of copy) listener();
  };
  const wnd: WindowWithRaf = {
    requestAnimationFrame: (listener) => {
      const frame = Math.round(1e8 * Math.random());
      listeners.push([frame, listener]);
      return frame;
    },
    cancelAnimationFrame: (frame) => {
      const index = listeners.findIndex((item) => item[0] === frame);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    },
  };
  return {
    wnd,
    listeners,
    flush,
  };
});

test('is an operator function', () => {
  expect(typeof raf()).toBe('function');
});

test('emits first value immediately', () => {
  const subj = new Subject();
  const spy = jest.fn();
  const throttled = subj.pipe(raf());
  throttled.subscribe(spy);
  expect(spy).toHaveBeenCalledTimes(0);
  subj.next(1);
  expect(spy).toHaveBeenCalledTimes(1);
});

test('throttles second value', () => {
  const subj = new Subject();
  const spy = jest.fn();
  const throttled = subj.pipe(raf());
  throttled.subscribe(spy);
  expect(spy).toHaveBeenCalledTimes(0);
  subj.next(1);
  expect(spy).toHaveBeenCalledTimes(1);
  subj.next(2);
  expect(spy).toHaveBeenCalledTimes(1);
});

test('does not emit throttled values unit animation frame executes', () => {
  const subj = new Subject();
  const spy = jest.fn();
  const throttled = subj.pipe(raf());
  throttled.subscribe(spy);
  expect(spy).toHaveBeenCalledTimes(0);
  subj.next(1);
  expect(spy).toHaveBeenCalledTimes(1);
  subj.next(2);
  expect(spy).toHaveBeenCalledTimes(1);
  subj.next(3);
  expect(spy).toHaveBeenCalledTimes(1);
  subj.next(4);
  expect(spy).toHaveBeenCalledTimes(1);
  flush();
  expect(spy).toHaveBeenCalledTimes(2);

  expect(spy).toHaveBeenCalledWith(1);
  expect(spy).not.toHaveBeenCalledWith(2);
  expect(spy).not.toHaveBeenCalledWith(3);
  expect(spy).toHaveBeenCalledWith(4);
});

test('throttles events in multiple animation frame iterations', () => {
  flush();
  const subj = new Subject();
  const spy = jest.fn();
  const throttled = subj.pipe(raf());
  throttled.subscribe(spy);

  subj.next(1);
  expect(spy).toHaveBeenCalledTimes(1);

  subj.next(2);
  subj.next(3);
  subj.next(4);
  subj.next(5);
  flush();
  flush();
  expect(spy).toHaveBeenCalledTimes(2);

  subj.next(6);
  flush();
  expect(spy).toHaveBeenCalledTimes(3);
  flush();
  flush();
  expect(spy).toHaveBeenCalledTimes(3);

  subj.next(7);
  subj.next(8);
  subj.next(9);
  flush();

  subj.next(10);
  subj.next(11);
  subj.next(12);
  flush();

  expect(spy).toHaveBeenCalledTimes(5);
  expect(spy).toHaveBeenCalledWith(1);
  expect(spy).toHaveBeenCalledWith(6);
  expect(spy).toHaveBeenCalledWith(9);
  expect(spy).toHaveBeenCalledWith(12);
});

test('stops when source observable completes', () => {
  flush();
  const subj = new Subject();
  const spy = jest.fn();
  const throttled = subj.pipe(raf());
  throttled.subscribe(spy);

  subj.next(1);
  expect(spy).toHaveBeenCalledTimes(1);

  subj.next(2);
  subj.next(3);
  subj.next(4);
  subj.next(5);
  flush();
  flush();
  expect(spy).toHaveBeenCalledTimes(2);

  subj.next(6);
  flush();
  expect(spy).toHaveBeenCalledTimes(3);
  flush();
  flush();
  expect(spy).toHaveBeenCalledTimes(3);

  subj.next(7);
  subj.next(8);
  subj.next(9);
  flush();

  subj.complete();

  subj.next(10);
  subj.next(11);
  subj.next(12);
  flush();

  expect(spy).toHaveBeenCalledTimes(4);
  expect(spy).toHaveBeenCalledWith(1);
  expect(spy).toHaveBeenCalledWith(6);
  expect(spy).toHaveBeenCalledWith(9);
});
