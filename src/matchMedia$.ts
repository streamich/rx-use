import {Observable, BehaviorSubject} from 'rxjs';
import {window} from './window';
import {ReadonlyBehaviorSubject} from './types';

const matchMediaClient$ = (query: string): ReadonlyBehaviorSubject<boolean> => {
  const mql = window!.matchMedia(query);
  let last: boolean = mql.matches;
  const observable:  ReadonlyBehaviorSubject<boolean> = Observable.create(observer => {
    const listener = () => {
      if (last === mql.matches) return;
      observer.next(last = mql.matches);
    };
    mql.addListener(listener);
    return () => mql.removeListener(listener);
  });
  observable.getValue = () => mql.matches;
  return observable;
};

const matchMediaServer$ = (query: string): ReadonlyBehaviorSubject<boolean> =>
  new BehaviorSubject<boolean>(false);

export const matchMedia$: (query: string) => ReadonlyBehaviorSubject<boolean> = window
  ? matchMediaClient$ : matchMediaServer$;
