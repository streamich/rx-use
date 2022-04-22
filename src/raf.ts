import {Observable, Subject, OperatorFunction, animationFrameScheduler} from 'rxjs';
import {window} from './window';

export type WindowWithRaf = Pick<Window, 'requestAnimationFrame' | 'cancelAnimationFrame'>;

const isWindowWithRaf = (w: unknown): w is WindowWithRaf =>
  typeof w === 'object' && !!(w as WindowWithRaf)?.requestAnimationFrame;

/**
 * De-bounces an observable using `window.requestAnimationFrame`. Emits the first
 * value immediately, subsequently only the last value received before each
 * request animation frame execution is emitted.
 */
export const raf =
  <T>(): OperatorFunction<T, T> =>
  (observable: Observable<T>): Observable<T> => {
    if (!isWindowWithRaf(window)) return observable;

    const w = window;
    const subject = new Subject<T>();

    let frame: unknown | 0 = 0;
    let next: unknown;
    let hasNext: boolean = false;

    const loop = () => {
      frame = w.requestAnimationFrame(() => {
        frame = 0;
        loop();
        const doEmit = hasNext;
        hasNext = false;
        if (doEmit) subject.next(next as T);
      });
    };

    observable.subscribe(
      (value) => {
        if (!frame) {
          subject.next(value);
          loop();
        } else {
          next = value;
          hasNext = true;
        }
      },
      (error) => {
        if (frame) w.cancelAnimationFrame(frame as number);
        subject.error(error);
      },
      () => {
        if (frame) w.cancelAnimationFrame(frame as number);
        subject.complete();
      },
    );

    return subject;
  };
