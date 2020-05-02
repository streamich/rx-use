/** @jest-environment node */

import {raf} from '../raf';
import {Subject} from 'rxjs';

test('is server', () => {
  expect(typeof window).toBe('undefined');
});

test('does not throttle on server, simply passes through data', () => {
  const subj = new Subject();
  const throttled = subj.pipe(raf());
  const spy = jest.fn();
  throttled.subscribe(spy);
  expect(spy).toHaveBeenCalledTimes(0);
  subj.next(1);
  expect(spy).toHaveBeenCalledTimes(1);
  subj.next(2);
  expect(spy).toHaveBeenCalledTimes(2);

  expect(spy).toHaveBeenCalledWith(1);
  expect(spy).toHaveBeenCalledWith(2);
});
