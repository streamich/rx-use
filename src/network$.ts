import {onLine$} from './onLine$';
import {ConnectionState, connection$} from './connection$';
import {BehaviorSubject, merge} from 'rxjs';
import {skip, map} from 'rxjs/operators';
import {ReadonlyBehaviorSubject} from './types';

export interface NetworkState extends ConnectionState {
  since: Date;
  onLine: boolean;
}

const state = (): NetworkState => ({
  since: new Date(),
  onLine: onLine$.getValue(),
  ...connection$.getValue(),
});

export const network$: ReadonlyBehaviorSubject<NetworkState> = new BehaviorSubject(state());

merge(onLine$.pipe(skip(1)), connection$.pipe(skip(1)))
  .pipe(map(state))
  .subscribe(network$ as BehaviorSubject<NetworkState>);
