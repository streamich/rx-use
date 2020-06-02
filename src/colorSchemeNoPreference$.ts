import {matchMedia$} from './matchMedia$';
import {shareReplay} from 'rxjs/operators';

export const colorSchemeNoPreference$ = matchMedia$('(prefers-color-scheme: no-preference)').pipe(shareReplay(1));
