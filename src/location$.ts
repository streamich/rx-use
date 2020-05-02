import { BehaviorSubject, merge, fromEvent, Observable } from 'rxjs';
import { map, share, filter } from 'rxjs/operators';
import { window } from './window';

const patchHistoryMethod = (method: 'pushState' | 'replaceState', eventName: string) => {
  const original = history[method];
  history[method] = function (state) {
    // tslint:disable-next-line
    const result = original.apply(this, arguments as any);
    const event = new Event(eventName);
    (event as any).state = state;
    window!.dispatchEvent(event);
    return result;
  };
};

if (!!window) {
  patchHistoryMethod('pushState', 'rx-pushstate');
  patchHistoryMethod('replaceState', 'rx-replacestate');
}

export type LocationFields = Pick<Location, 'hash' | 'host' | 'hostname' | 'href' | 'origin' | 'pathname' | 'port' | 'protocol' | 'search'>;
export type HistoryFields = Pick<History, 'state' | 'length'>;
export type LocationStateEvent = 'load' | 'pop' | 'push' | 'replace';

export interface LocationState extends LocationFields, HistoryFields {
  event: LocationStateEvent;
}

const buildState = (event: LocationStateEvent, location: LocationFields, history: HistoryFields): LocationState => {
  const { state, length } = history;
  const { hash, host, hostname, href, origin, pathname, port, protocol, search } = location;
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
  const location$ = new BehaviorSubject(buildState('load', window!.location, window!.history));
  merge<LocationStateEvent>(
    fromEvent(window!, 'popstate').pipe(map(() => 'pop')) as Observable<LocationStateEvent>,
    fromEvent(window!, 'rx-pushstate').pipe(map(() => 'push')) as Observable<LocationStateEvent>,
    fromEvent(window!, 'rx-replacestate').pipe(map(() => 'replace')) as Observable<LocationStateEvent>,
  ).pipe(
    share(),
    filter(() => window!.location.href !== location$.getValue().href),
    map(event => buildState(event, window!.location, window!.history))
  ).subscribe(location$);
  return location$;
};

const createServerLocation$ = (): BehaviorSubject<LocationState> =>
  new BehaviorSubject(buildState('load', {
    hash: '',
    host: '',
    hostname: '',
    href: '',
    origin: '',
    pathname: '',
    port: '',
    protocol: '',
    search: '',
  }, {
    length: 0,
    state: null,
  }));

export const location$: BehaviorSubject<LocationState> = !!window
  ? createBrowserLocation$()
  : createServerLocation$();
