import {matchMedia$} from './matchMedia$';
import {share} from 'rxjs/operators';

export const colorSchemeNoPreference$ = matchMedia$('(prefers-color-scheme: no-preference)').pipe(share());
