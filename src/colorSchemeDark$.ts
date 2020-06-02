import {matchMedia$} from './matchMedia$';
import {shareReplay} from 'rxjs/operators';

export const colorSchemeDark$ = matchMedia$('(prefers-color-scheme: dark)').pipe(shareReplay(1));
