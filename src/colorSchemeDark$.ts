import {matchMedia$} from './matchMedia$';
import {share} from 'rxjs/operators';

export const colorSchemeDark$ = matchMedia$('(prefers-color-scheme: dark)').pipe(share());
