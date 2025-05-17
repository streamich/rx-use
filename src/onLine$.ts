import {wnd} from './window';
import {BehaviorSubject, fromEvent} from 'rxjs';
import {map, filter} from 'rxjs/operators';
import {ReadonlyBehaviorSubject} from './types';

const navigator = (wnd && wnd.navigator) || undefined;

export const onLine$: ReadonlyBehaviorSubject<boolean> = new BehaviorSubject<boolean>(
  !!navigator ? navigator.onLine : true,
);

if (!!wnd && !!navigator) {
  fromEvent(wnd, 'online')
    .pipe(
      map(() => navigator.onLine),
      filter((onLine) => onLine !== onLine$.getValue()),
    )
    .subscribe(onLine$ as BehaviorSubject<boolean>);
}
