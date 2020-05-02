import { merge, from, fromEvent, Observable } from 'rxjs';
import { map, share, distinctUntilChanged } from 'rxjs/operators';
import { window } from './window';

export const location$: Observable<Location> = !!window
  ? merge(
    fromEvent(window, 'popstate'),
    fromEvent(window, 'pushstate'),
    fromEvent(window, 'replacestate'),
  ).pipe(
    share(),
    map(() => window!.location.href),
    distinctUntilChanged((href1, href2) => href1 === href2),
    map(() => window!.location)
  )
  : from([]);
