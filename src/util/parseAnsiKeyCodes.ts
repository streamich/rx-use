export interface Key {
  key: string;
  code: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
}

/**
 * This interface resembles browser `KeyboardEvent`.
 */
export class KeyboardEvent {
  raw: string;

  key: string;
  code: string;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;

  constructor(raw: string, key: string, code: string, altKey = false, ctrlKey = false, metaKey = false, shiftKey = false) {
    this.raw = raw;
    this.key = key;
    this.code = code;
    this.altKey = altKey;
    this.ctrlKey = ctrlKey;
    this.metaKey = metaKey;
    this.shiftKey = shiftKey;
  }
}

const commonSpecialChars: Record<number, {key: string, code: string, shiftKey?: boolean}> = {
  41: {key: ')', code: 'Digit0', shiftKey: true},
  33: {key: '!', code: 'Digit1', shiftKey: true},
  64: {key: '@', code: 'Digit2', shiftKey: true},
  35: {key: '#', code: 'Digit3', shiftKey: true},
  36: {key: '$', code: 'Digit4', shiftKey: true},
  37: {key: '%', code: 'Digit5', shiftKey: true},
  94: {key: '^', code: 'Digit6', shiftKey: true},
  38: {key: '&', code: 'Digit7', shiftKey: true},
  42: {key: '*', code: 'Digit8', shiftKey: true},
  40: {key: '(', code: 'Digit9', shiftKey: true},

  39: {key: "'", code: 'Quote'},
  34: {key: '"', code: 'Quote', shiftKey: true},
  44: {key: ',', code: 'Comma'},
  60: {key: '<', code: 'Comma', shiftKey: true},
  45: {key: '-', code: 'Minus'},
  95: {key: '_', code: 'Minus', shiftKey: true},
  46: {key: '.', code: 'Period'},
  62: {key: '>', code: 'Period', shiftKey: true},
  47: {key: '/', code: 'Slash'},
  63: {key: '?', code: 'Slash', shiftKey: true},
  59: {key: ';', code: 'Semicolon'},
  58: {key: ':', code: 'Semicolon', shiftKey: true},
  61: {key: '=', code: 'Equal'},
  43: {key: '+', code: 'Equal', shiftKey: true},
  91: {key: '[', code: 'BracketLeft'},
  123: {key: '{', code: 'BracketLeft', shiftKey: true},
  92: {key: '\\', code: 'Backslash'},
  124: {key: '|', code: 'Backslash', shiftKey: true},
  93: {key: ']', code: 'BracketRight'},
  125: {key: '}', code: 'BracketRight', shiftKey: true},
  96: {key: '`', code: 'Backquote'},
  126: {key: '~', code: 'Backquote', shiftKey: true},

  0x1b: {key: 'Escape', code: 'Escape'},
  13: {key: 'Enter', code: 'Enter'},
  9: {key: 'Tab', code: 'Tab'},
  127: {key: 'Backspace', code: 'Backspace'},
};

const parseOneChar = (code: number): null | Key => {
  const char = commonSpecialChars[code];
  if (char) return char;
  else if ((code >= 97) && (code <= 122)) { // a..z
    const key = String.fromCharCode(code);
    return {key, code: 'Key' + key.toUpperCase()};
  } else if ((code >= 65) && (code <= 90)) { // A..Z
    const key = String.fromCharCode(code);
    return {key, code: 'Key' + key, shiftKey: true};
  } else if ((code >= 1) && (code <= 26)) { // Ctrl + a..z
    const key = String.fromCharCode(code + 97 - 1);
    return {key, code: 'Digit' + key, ctrlKey: true};
  } else if ((code >= 48) && (code <= 57)) { // 0..9
    const key = String(code - 48);
    return {key, code: 'Digit' + key};
  } else return null;
};

const parseArrows = (c1: number, c2: number, c3: number): null | Key => {
  if (c1 !== 0x1b) return null;
  if (c2 !== 0x5b) return null;
  if (c3 === 0x41) return {key: 'ArrowUp', code: 'ArrowUp'};
  if (c3 === 0x42) return {key: 'ArrowDown', code: 'ArrowDown'};
  if (c3 === 0x43) return {key: 'ArrowRight', code: 'ArrowRight'};
  if (c3 === 0x44) return {key: 'ArrowLeft', code: 'ArrowLeft'};
  return null;
};

export const parseAnsiKeyCodes = (data: Uint8Array) => {
  const length = data.length;
  let i = 0;

  const tokens: KeyboardEvent[] = [];

  const eat = (size: number, key: Key) => {
    const rawCodes: number[] = [];
    for (let j = 0; j < size; j++) rawCodes.push(data[i + j]);
    const raw = String.fromCharCode(...rawCodes);
    const token = new KeyboardEvent(raw, key.key, key.code, key.altKey, key.ctrlKey, key.metaKey, key.shiftKey);
    tokens.push(token);
    i += size;
    return token;
  };

  const skip = (size: number) => eat(size, {key: '', code: 'Unknown'});

  while (i < length) {
    const code = data[i];

    const arrow = parseArrows(code, data[i + 1], data[i + 2]);
    if (arrow) { eat(3, arrow); continue; }

    const char = parseOneChar(code);
    if (!char) { skip(1); continue; }

    if (char.key === 'Escape') {
      const code1 = data[i + 1];

      const arrow = parseArrows(data[i + 1], data[i + 2], data[i + 3]);
      if (arrow) { eat(4, {...arrow, altKey: true}); continue; }

      if ((code1 === 0x4f) && (data[i + 2] === 0x50)) { eat(3, {key: 'F1', code: 'F1'}); continue; }
      else if ((code1 === 0x4f) && (data[i + 2] === 0x51)) { eat(3, {key: 'F2', code: 'F2'}); continue; }
      else if ((code1 === 0x4f) && (data[i + 2] === 0x52)) { eat(3, {key: 'F3', code: 'F3'}); continue; }
      else if ((code1 === 0x4f) && (data[i + 2] === 0x53)) { eat(3, {key: 'F4', code: 'F4'}); continue; }

      const char1 = parseOneChar(code1);
      if (!char1) { eat(1, char); continue; }
      else eat(2, {...char1, altKey: true});
    }

    eat(1, char);
  }

  return { tokens };
};
