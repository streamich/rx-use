import {window} from './window';
import {BehaviorSubject, fromEvent} from 'rxjs';
import {share, map, filter} from 'rxjs/operators';

export type SizeWindow = Pick<Window, 'addEventListener' | 'removeEventListener' | 'innerHeight' | 'innerWidth'>;

const isWindow = (w: unknown): w is SizeWindow => typeof w === 'object';

export interface WindowSizeState {
  width: number;
  height: number;
}

const createBrowserWindowSize$ = () => {
  if (!isWindow(window)) return new BehaviorSubject({width: 0, height: 0});

  const w = window;
  const state = (): WindowSizeState => ({
    width: w.innerWidth,
    height: w.innerHeight,
  });
  const windowSize$ = new BehaviorSubject(state());

  fromEvent(window, 'resize')
    .pipe(
      filter(() => {
        const {width, height} = windowSize$.getValue();
        return width !== w.innerWidth || height !== w.innerHeight;
      }),
      map(state),
      share(),
    )
    .subscribe(windowSize$);

  return windowSize$;
};

export const windowSize$: BehaviorSubject<WindowSizeState> = createBrowserWindowSize$();
