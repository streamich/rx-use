import {location$} from './location$';
const {window, _listeners} = require('./window');

type Listener = {event: string, listener: (...args: any) => void};

const listeners: Listener[] = _listeners;

jest.mock('./window', () => {
  const listeners: Listener[] = [];
  const removedListeners: Listener[] = [];
  const location: Location = {
    hash: '',
    host: 'google.com',
    href: 'http://google.com'
  } as Location;
  const wnd = {
    location,
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
  location$.subscribe(() => {});
});

test('attaches 3 listeners', async () => {
  expect(listeners.length).toBe(3);  
});

test('fires on listener', async () => {
  const spy = jest.fn();

  location$.subscribe(spy);

  expect(spy).toHaveBeenCalledTimes(0);
  
  const event = new Event('popstate');
  listeners[0].listener(event);
  
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy.mock.calls[0][0]).toBe(window.location);
});

test('emits again on location change', async () => {
  const spy = jest.fn();

  location$.subscribe(spy);

  expect(spy).toHaveBeenCalledTimes(0);
  
  const event1 = new Event('popstate');
  listeners[0].listener(event1);
  
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy.mock.calls[0][0]).toBe(window.location);

  window.location.hash = 'asdf';
  window.location.href = 'http://google.com#asdf';

  const event2 = new Event('popstate');
  listeners[0].listener(event2);

  expect(spy).toHaveBeenCalledTimes(2);
  expect(spy.mock.calls[1][0]).toBe(window.location);
});

test('does not emit if location did not change', async () => {
  const spy = jest.fn();

  location$.subscribe(spy);

  expect(spy).toHaveBeenCalledTimes(0);
  
  const event1 = new Event('popstate');
  listeners[0].listener(event1);
  
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy.mock.calls[0][0]).toBe(window.location);

  const event2 = new Event('popstate');
  listeners[0].listener(event2);

  expect(spy).toHaveBeenCalledTimes(1);
});
