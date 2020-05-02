import {location$, LocationFields, HistoryFields} from '../location$';
const {window, _listeners} = require('../window');

type Listener = {event: string; listener: (...args: any) => void};

const listeners: Listener[] = _listeners;

jest.mock('../window', () => {
  const listeners: Listener[] = [];
  const removedListeners: Listener[] = [];
  const location: LocationFields = {
    hash: '',
    host: 'google.com',
    href: 'http://google.com',
    hostname: '',
    origin: '',
    pathname: '',
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
  location$.subscribe(() => {});
});

test('attaches 3 listeners', async () => {
  expect(listeners.length).toBe(3);
});

test('emits immediately on subscription', async () => {
  const spy = jest.fn();
  expect(spy).toHaveBeenCalledTimes(0);
  location$.subscribe(spy);
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy.mock.calls[0][0]).toMatchInlineSnapshot(`
    Object {
      "event": "load",
      "hash": "",
      "host": "google.com",
      "hostname": "",
      "href": "http://google.com",
      "length": 0,
      "origin": "",
      "pathname": "",
      "port": "",
      "protocol": "",
      "search": "",
      "state": null,
    }
  `);
});

test('does not emit first time if href has not changed', async () => {
  const spy = jest.fn();
  location$.subscribe(spy);
  expect(spy).toHaveBeenCalledTimes(1);
  const event = new Event('popstate');
  listeners[0].listener(event);
  expect(spy).toHaveBeenCalledTimes(1);
});

test('emits when href changes', async () => {
  const spy = jest.fn();
  location$.subscribe(spy);
  expect(spy).toHaveBeenCalledTimes(1);
  window.location.hash = 'asdf';
  window.location.href = 'http://google.com#asdf';
  const event = new Event('popstate');
  listeners[0].listener(event);
  expect(spy).toHaveBeenCalledTimes(2);
});

test('emits every time location changes to new href with the latest up-to-date state', async () => {
  const spy = jest.fn();
  location$.subscribe(spy);

  window.location.hash = 'foo';
  window.location.href = 'http://google.com#foo';
  const event1 = new Event('popstate');
  listeners[0].listener(event1);
  expect(spy).toHaveBeenCalledTimes(2);
  expect(spy.mock.calls[1][0]).toMatchInlineSnapshot(`
    Object {
      "event": "pop",
      "hash": "foo",
      "host": "google.com",
      "hostname": "",
      "href": "http://google.com#foo",
      "length": 0,
      "origin": "",
      "pathname": "",
      "port": "",
      "protocol": "",
      "search": "",
      "state": null,
    }
  `);

  const event2 = new Event('popstate');
  const event3 = new Event('popstate');
  listeners[0].listener(event2);
  listeners[0].listener(event3);
  expect(spy).toHaveBeenCalledTimes(2);

  window.location.hash = 'bar';
  window.location.href = 'http://google.com#bar';
  const event4 = new Event('popstate');
  listeners[0].listener(event4);
  expect(spy).toHaveBeenCalledTimes(3);
  expect(spy.mock.calls[2][0]).toMatchInlineSnapshot(`
    Object {
      "event": "pop",
      "hash": "bar",
      "host": "google.com",
      "hostname": "",
      "href": "http://google.com#bar",
      "length": 0,
      "origin": "",
      "pathname": "",
      "port": "",
      "protocol": "",
      "search": "",
      "state": null,
    }
  `);
});

test('still only 3 listeners are attached to window global', async () => {
  expect(listeners.length).toBe(3);
});
