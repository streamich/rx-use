import {wnd} from './window';
import {Observable, EMPTY} from 'rxjs';
import {share, filter} from 'rxjs/operators';

const isFocusedElementEditable = (): boolean => {
  if (!wnd) return false;
  
  const { activeElement, body } = wnd.document;

  if (!activeElement) {
    return false;
  }

  // If no element has focus, we assume it is not editable, too.
  if (activeElement === body) {
    return false;
  }

  // Assume <input> and <textarea> elements are editable.
  switch (activeElement.tagName) {
    case 'INPUT':
    case 'TEXTAREA':
      return true;
  }

  // Check if any other focused element is editable.
  return activeElement.hasAttribute('contenteditable');
};

const isTypedCharGood = ({ keyCode, metaKey, ctrlKey, altKey }: KeyboardEvent): boolean => {
  if (metaKey || ctrlKey || altKey) {
    return false;
  }
  // 0...9
  if (keyCode >= 48 && keyCode <= 57) {
    return true;
  }
  // a...z
  if (keyCode >= 65 && keyCode <= 90) {
    return true;
  }
  // All other keys.
  return false;
};

const createStartTyping$ = (): Observable<KeyboardEvent> => {
  if (!wnd) return EMPTY;

  return new Observable<KeyboardEvent>((subscriber) => {
    const keydownHandler = (event: KeyboardEvent) => {
      if (!isFocusedElementEditable() && isTypedCharGood(event)) {
        subscriber.next(event);
      }
    };

    wnd!.document.addEventListener('keydown', keydownHandler);
    
    return () => {
      if (wnd) {
        wnd.document.removeEventListener('keydown', keydownHandler);
      }
    };
  });
};

export const startTyping$ = createStartTyping$().pipe(share());