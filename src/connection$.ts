import {window} from './window';
import {BehaviorSubject, fromEvent} from 'rxjs';
import {map} from 'rxjs/operators';

export interface ConnectionState {
  downlink?: number;
  downlinkMax?: number;
  effectiveType?: string;
  rtt?: number;
  type?: string;
}

export interface Connection extends ConnectionState, EventSource {}

export interface NavigatorWithConnection extends Navigator {
  connection?: Connection;
  mozConnection?: Connection;
  webkitConnection?: Connection;
}

const navigator: NavigatorWithConnection | undefined =
  (window && (window.navigator as NavigatorWithConnection)) || undefined;
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

export const connection$: BehaviorSubject<ConnectionState> = new BehaviorSubject(state());

if (!!connection) {
  fromEvent(connection, 'change').pipe(map(state)).subscribe(connection$);
}
