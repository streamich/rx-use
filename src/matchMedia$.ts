import {BehaviorSubject, fromEventPattern} from 'rxjs';
import {window} from './window';
import {ReadonlyBehaviorSubject} from './types';

const matchMediaClient$ = (query: string): ReadonlyBehaviorSubject<boolean> => {
  const mql = window!.matchMedia(query);
  const isMatch = mql.matches;
  const subject = new BehaviorSubject<boolean>(isMatch);
  const onChange = () => subject.next(mql.matches);
  const addHandler = () => mql.addListener(onChange)
  const removeHandler = () => mql.removeListener(onChange);
  const changes$ = fromEventPattern<boolean>(addHandler, removeHandler);
  changes$.subscribe(subject);
  return subject;
};

const matchMediaServer$ = (query: string): ReadonlyBehaviorSubject<boolean> =>
  new BehaviorSubject<boolean>(false);

export const matchMedia$: (query: string) => ReadonlyBehaviorSubject<boolean> = window
  ? matchMediaClient$ : matchMediaServer$;
