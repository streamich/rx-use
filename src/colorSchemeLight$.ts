import {matchMedia$} from './matchMedia$';
import {share} from 'rxjs/operators';

export const colorSchemeLight$ = matchMedia$('(prefers-color-scheme: light)').pipe(share());
