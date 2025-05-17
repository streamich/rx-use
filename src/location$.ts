import {BehaviorSubject, merge, fromEvent, Observable} from 'rxjs';
import {map, share, filter} from 'rxjs/operators';
import {wnd} from './window';
import {ReadonlyBehaviorSubject} from './types';

const patchHistoryMethod = (method: 'pushState' | 'replaceState', eventName: string) => {
  const original = history[method];
  history[method] = function (state) {
    // tslint:disable-next-line
    const result = original.apply(this, arguments as any);
    const event = new Event(eventName);
    (event as any).state = state;
    wnd!.dispatchEvent(event);
    return result;
  };
};

if (!!wnd) {
  patchHistoryMethod('pushState', 'rx-pushstate');
  patchHistoryMethod('replaceState', 'rx-replacestate');
}

export type LocationFields = Pick<
  Location,
  'hash' | 'host' | 'hostname' | 'href' | 'origin' | 'pathname' | 'port' | 'protocol' | 'search'
>;
export type HistoryFields = Pick<History, 'state' | 'length'>;
export type LocationStateEvent = 'load' | 'pop' | 'push' | 'replace';

export interface LocationState extends LocationFields, HistoryFields {
  event: LocationStateEvent;
}

const buildState = (event: LocationStateEvent, location: LocationFields, history: HistoryFields): LocationState => {
  const {state, length} = history;
  const {hash, host, hostname, href, origin, pathname, port, protocol, search} = location;
  return {
    event,
    state,
    length,
    hash,
    host,
    hostname,
    href,
    origin,
    pathname,
    port,
    protocol,
    search,
  };
};

const createBrowserLocation$ = (): BehaviorSubject<LocationState> => {
  const location$ = new BehaviorSubject(buildState('load', wnd!.location, wnd!.history));
  merge(
    fromEvent(wnd!, 'popstate').pipe(map(() => 'pop')) as Observable<LocationStateEvent>,
    fromEvent(wnd!, 'rx-pushstate').pipe(map(() => 'push')) as Observable<LocationStateEvent>,
    fromEvent(wnd!, 'rx-replacestate').pipe(map(() => 'replace')) as Observable<LocationStateEvent>,
  )
    .pipe(
      share(),
      filter(() => wnd!.location.href !== location$.getValue().href),
      map((event) => buildState(event, wnd!.location, wnd!.history)),
    )
    .subscribe(location$);
  return location$;
};

const createServerLocation$ = (): BehaviorSubject<LocationState> =>
  new BehaviorSubject(
    buildState(
      'load',
      {
        hash: '',
        host: '',
        hostname: '',
        href: '',
        origin: '',
        pathname: '',
        port: '',
        protocol: '',
        search: '',
      },
      {
        length: 0,
        state: null,
      },
    ),
  );

export const location$: ReadonlyBehaviorSubject<LocationState> = !!wnd
  ? createBrowserLocation$()
  : createServerLocation$();
