import {BehaviorSubject} from 'rxjs';
import {windowSize$, WindowSizeState} from './windowSize$';
import {raf} from './raf';
import {ReadonlyBehaviorSubject} from './types';

export const windowSizeRaf$: ReadonlyBehaviorSubject<WindowSizeState> = new BehaviorSubject(windowSize$.getValue());

windowSize$.pipe(raf()).subscribe(windowSizeRaf$ as BehaviorSubject<WindowSizeState>);
