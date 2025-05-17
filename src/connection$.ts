import {wnd} from './window';
import {BehaviorSubject, fromEvent} from 'rxjs';
import {map} from 'rxjs/operators';
import {ReadonlyBehaviorSubject} from './types';

export interface ConnectionState {
  downlink?: number;
  downlinkMax?: number;
  effectiveType?: string;
  rtt?: number;
  type?: string;
}

export interface Connection extends ConnectionState, EventSource {}

export type NavigatorWithConnection = Navigator & {
  connection?: Connection;
  mozConnection?: Connection;
  webkitConnection?: Connection;
};

const navigator: NavigatorWithConnection | undefined =
  (wnd && (wnd.navigator as NavigatorWithConnection)) || undefined;
const connection: Connection | undefined =
  navigator && (navigator.connection || navigator.mozConnection || navigator.webkitConnection)
    ? navigator.connection || navigator.mozConnection || navigator.webkitConnection
    : undefined;

const state = (): ConnectionState => {
  if (!connection) return {};
  const {downlink, downlinkMax, effectiveType, type, rtt} = connection;
  return {
    downlink,
    downlinkMax,
    effectiveType,
    type,
    rtt,
  };
};

export const connection$: ReadonlyBehaviorSubject<ConnectionState> = new BehaviorSubject(state());

if (!!connection) {
  fromEvent(connection, 'change')
    .pipe(map(state))
    .subscribe(connection$ as BehaviorSubject<ConnectionState>);
}
