import {BehaviorSubject} from 'rxjs';
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

  colorSchemeNoPreference$.subscribe(noPreference => {
    if (noPreference) subject.next(isNightTime());
  });

  colorSchemeDark$.subscribe(isDark => {
    if (isDark && !subject.getValue()) subject.next(true);
  });

  colorSchemeLight$.subscribe(isLight => {
    if (isLight && subject.getValue()) subject.next(false);
  });

  return subject;
};

export const darkTheme$ = createDarkTheme$();
