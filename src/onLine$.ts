import {window} from './window';
import {BehaviorSubject, fromEvent} from 'rxjs';
import {map, filter} from 'rxjs/operators';

const navigator = (window && window.navigator) || undefined;

export const onLine$ = new BehaviorSubject<boolean>(!!navigator ? navigator.onLine : true);

if (!!window && !!navigator) {
  fromEvent(window, 'online')
    .pipe(
      map(() => navigator.onLine),
      filter((onLine) => onLine !== onLine$.getValue()),
    )
    .subscribe(onLine$);
}
