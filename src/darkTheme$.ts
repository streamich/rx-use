import {merge, BehaviorSubject, Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';
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
  const observable: Observable<boolean> = merge(
    colorSchemeNoPreference$.pipe(
      filter(Boolean),
      map(() => isNightTime())
    ),
    colorSchemeDark$.pipe(
      filter<boolean>(Boolean)
    ),
    colorSchemeLight$.pipe(
      filter(Boolean),
      map(() => false)
    ),
  );

  let value: boolean = false;
  observable.subscribe(v => value = v).unsubscribe();

  const subject = new BehaviorSubject<boolean>(value);
  observable.subscribe(subject);

  return subject;
};

export const darkTheme$ = createDarkTheme$();
