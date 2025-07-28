/**
 * @jest-environment node
 */

import {startTyping$} from '../startTyping$';

test('is server', () => {
  expect(typeof window).toBe('undefined');
});

test('does not emit any events on server', () => {
  const spy = jest.fn();
  const subscription = startTyping$.subscribe(spy);
  
  // The observable should not emit any values on server
  expect(spy).not.toHaveBeenCalled();
  subscription.unsubscribe();
});