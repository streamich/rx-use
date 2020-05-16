import {location$, LocationState} from './location$';
import {BehaviorSubject} from 'rxjs';
import {map, filter} from 'rxjs/operators';
import { ReadonlyBehaviorSubject } from './types';

const selector = ({pathname}: LocationState) => pathname;

export const pathname$: ReadonlyBehaviorSubject<string> = new BehaviorSubject<string>(selector(location$.getValue()));

location$
  .pipe(
    map(selector),
    filter((pathname) => pathname !== pathname$.getValue()),
  )
  .subscribe(pathname$ as BehaviorSubject<string>);
