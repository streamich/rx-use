import {startTyping$} from '../startTyping$';
const {wnd: window, _listeners} = require('../window');

type Listener = {event: string; listener: (...args: any) => void};

const listeners: Listener[] = _listeners;

jest.mock('../window', () => {
  const listeners: Listener[] = [];
  const removedListeners: Listener[] = [];
  const activeElement = document.createElement('div');
  const body = document.createElement('body');
  const wnd = {
    document: {
      activeElement,
      body,
      addEventListener: (event: string, listener: any) => {
        listeners.push({event, listener});
      },
      removeEventListener: (event: string, listener: any) => {
        removedListeners.push({event, listener});
      },
    },
  };
  return {
    wnd,
    _listeners: listeners,
    _removedListeners: removedListeners,
    _activeElement: activeElement,
    _body: body,
  };
});

test('can subscribe', () => {
  startTyping$.subscribe(() => {});
});

test('attaches 1 keydown listener', () => {
  expect(listeners.length).toBe(1);
  expect(listeners).toMatchInlineSnapshot(`
    Array [
      Object {
        "event": "keydown",
        "listener": [Function],
      },
    ]
  `);
});

test('emits when typing valid character with no focused editable element', () => {
  const spy = jest.fn();
  startTyping$.subscribe(spy);
  
  // Simulate typing 'a' (keyCode 65)
  const event = new KeyboardEvent('keydown', {
    keyCode: 65,
    metaKey: false,
    ctrlKey: false,
    altKey: false,
  } as any);
  
  listeners[0].listener(event);
  expect(spy).toHaveBeenCalledWith(event);
});

test('emits when typing valid number with no focused editable element', () => {
  const spy = jest.fn();
  startTyping$.subscribe(spy);
  
  // Simulate typing '5' (keyCode 53)
  const event = new KeyboardEvent('keydown', {
    keyCode: 53,
    metaKey: false,
    ctrlKey: false,
    altKey: false,
  } as any);
  
  listeners[0].listener(event);
  expect(spy).toHaveBeenCalledWith(event);
});

test('does not emit when modifier keys are pressed', () => {
  const spy = jest.fn();
  startTyping$.subscribe(spy);
  
  // Test with ctrl+a
  const ctrlEvent = new KeyboardEvent('keydown', {
    keyCode: 65,
    metaKey: false,
    ctrlKey: true,
    altKey: false,
  } as any);
  
  listeners[0].listener(ctrlEvent);
  expect(spy).not.toHaveBeenCalled();
  
  // Test with alt+a
  const altEvent = new KeyboardEvent('keydown', {
    keyCode: 65,
    metaKey: false,
    ctrlKey: false,
    altKey: true,
  } as any);
  
  listeners[0].listener(altEvent);
  expect(spy).not.toHaveBeenCalled();
  
  // Test with meta+a
  const metaEvent = new KeyboardEvent('keydown', {
    keyCode: 65,
    metaKey: true,
    ctrlKey: false,
    altKey: false,
  } as any);
  
  listeners[0].listener(metaEvent);
  expect(spy).not.toHaveBeenCalled();
});

test('does not emit for invalid key codes', () => {
  const spy = jest.fn();
  startTyping$.subscribe(spy);
  
  // Test space bar (keyCode 32)
  const spaceEvent = new KeyboardEvent('keydown', {
    keyCode: 32,
    metaKey: false,
    ctrlKey: false,
    altKey: false,
  } as any);
  
  listeners[0].listener(spaceEvent);
  expect(spy).not.toHaveBeenCalled();
  
  // Test arrow key (keyCode 37)
  const arrowEvent = new KeyboardEvent('keydown', {
    keyCode: 37,
    metaKey: false,
    ctrlKey: false,
    altKey: false,
  } as any);
  
  listeners[0].listener(arrowEvent);
  expect(spy).not.toHaveBeenCalled();
});

test('does not emit when input element is focused', () => {
  const spy = jest.fn();
  startTyping$.subscribe(spy);
  
  // Mock focused input element
  const input = {
    tagName: 'INPUT',
    hasAttribute: () => false,
  };
  (window.document as any).activeElement = input;
  
  const event = new KeyboardEvent('keydown', {
    keyCode: 65,
    metaKey: false,
    ctrlKey: false,
    altKey: false,
  } as any);
  
  listeners[0].listener(event);
  expect(spy).not.toHaveBeenCalled();
});

test('does not emit when textarea element is focused', () => {
  const spy = jest.fn();
  startTyping$.subscribe(spy);
  
  // Mock focused textarea element
  const textarea = {
    tagName: 'TEXTAREA',
    hasAttribute: () => false,
  };
  (window.document as any).activeElement = textarea;
  
  const event = new KeyboardEvent('keydown', {
    keyCode: 65,
    metaKey: false,
    ctrlKey: false,
    altKey: false,
  } as any);
  
  listeners[0].listener(event);
  expect(spy).not.toHaveBeenCalled();
});

test('does not emit when contenteditable element is focused', () => {
  const spy = jest.fn();
  startTyping$.subscribe(spy);
  
  // Mock focused contenteditable element
  const div = {
    tagName: 'DIV',
    hasAttribute: jest.fn().mockReturnValue(true),
  };
  (window.document as any).activeElement = div;
  
  const event = new KeyboardEvent('keydown', {
    keyCode: 65,
    metaKey: false,
    ctrlKey: false,
    altKey: false,
  } as any);
  
  listeners[0].listener(event);
  expect(spy).not.toHaveBeenCalled();
});

test('multiple subscribers work correctly', () => {
  const spy1 = jest.fn();
  const spy2 = jest.fn();
  
  const sub1 = startTyping$.subscribe(spy1);
  const sub2 = startTyping$.subscribe(spy2);
  
  // Reset activeElement to non-editable
  (window.document as any).activeElement = window.document.body;
  
  const event = new KeyboardEvent('keydown', {
    keyCode: 65,
    metaKey: false,
    ctrlKey: false,
    altKey: false,
  } as any);
  
  listeners[0].listener(event);
  
  expect(spy1).toHaveBeenCalledWith(event);
  expect(spy2).toHaveBeenCalledWith(event);
  
  sub1.unsubscribe();
  sub2.unsubscribe();
});

test('still has a single global event listener', () => {
  expect(listeners.length).toBe(1);
});