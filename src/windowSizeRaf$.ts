import {BehaviorSubject} from 'rxjs';
import {windowSize$} from './windowSize$';
import {raf} from './raf';

export const windowSizeRaf$ = new BehaviorSubject(windowSize$.getValue());

windowSize$.pipe(raf()).subscribe(windowSizeRaf$);
