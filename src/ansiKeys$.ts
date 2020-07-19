import { parseAnsiKeyCodes, KeyboardEvent } from './util/parseAnsiKeyCodes';
import { map, mergeMap, share } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { stdin$ } from './stdin$';

const _ansiKeys$ = new Observable<KeyboardEvent>(subscriber => {
  process.stdin.setRawMode(true);

  stdin$.pipe(
    map(buf => parseAnsiKeyCodes(buf).tokens),
    mergeMap(arr => from(arr)),
  ).subscribe(subscriber);

  return () => {
    process.stdin.setRawMode(false);
  };
});

export const ansiKeys$ = _ansiKeys$.pipe(share());
  
// ansiKeys$.subscribe(key => {
//   if (key.key === 'c' && key.ctrlKey) process.exit(0);
//   console.log(key);
// });
