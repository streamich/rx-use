import {matchMedia$} from './matchMedia$';
import {shareReplay} from 'rxjs/operators';

export const colorSchemeLight$ = matchMedia$('(prefers-color-scheme: light)').pipe(shareReplay(1));
