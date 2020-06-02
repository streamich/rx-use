import {BehaviorSubject} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';
import {colorSchemeNoPreference$} from './colorSchemeNoPreference$';
import {colorSchemeDark$} from './colorSchemeDark$';
import {colorSchemeLight$} from './colorSchemeLight$';
import {ReadonlyBehaviorSubject} from './types';

const defaultIsNightTime = (): boolean => {
  const hour = new Date().getHours();
  const isNight = hour < 4 || hour > 18;
  return isNight;
};

export const createDarkTheme$ = (isNightTime: () => boolean = defaultIsNightTime): ReadonlyBehaviorSubject<boolean> => {
  const subject = new BehaviorSubject<boolean>(false);

  colorSchemeNoPreference$.pipe(
    filter(Boolean),
    map(() => isNightTime()),
  ).subscribe(subject);

  colorSchemeDark$.pipe(
    filter<boolean>(Boolean),
  ).subscribe(subject);

  colorSchemeLight$.pipe(
    filter(isLight => !isLight),
    map(() => false),
  ).subscribe(subject);

  return subject;
};

export const darkTheme$ = createDarkTheme$();
