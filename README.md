# rx-use

Sensor and side-effect library for [`rxjs`](https://rxjs-dev.firebaseapp.com/). Do you want to contribute? See, [`help wanted`](https://github.com/streamich/rx-use/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22).


## Observables

- [`location$`](./docs/location$.md) &mdash; browser location and history sensor.
  - [`pathname$`](./docs/pathname$.md) &mdash; browser location pathname sensor.
- [`network$`](./docs/network$.md) &mdash; returns consolidate network status info.
  - [`onLine$`](./docs/onLine$.md) &mdash; `boolean` whether user is on-line.
  - [`connection$`](./docs/connection$.md) &mdash; information about user's network connection.
- [`windowSize$`](./docs/windowSize$.md) and [`windowSizeRaf$`](./docs/windowSizeRaf$.md) &mdash; browser window dimension sensor.
- [`darkTheme$`](./docs/darkTheme$.md) &mdash; emits `true` if UI should use dark theme.
- [`matchMedia$()`](./docs/matchMedia$.md) &mdash; returns boolean indicating media query match.
  - [`colorSchemeDark$`](./docs/colorSchemeDark$.md) &mdash; whether user selected dark theme in system settings.
  - [`colorSchemeLight$`](./docs/colorSchemeLight$.md) &mdash; whether user selected light theme in system settings.
  - [`colorSchemeNoPreference$`](./docs/colorSchemeNoPreference$.md) &mdash; whether user has no preference for color scheme.
- `stdin$` &mdash; listen for data coming from STDIN.
- `ansiKeys$` &mdash; listen for ANSI terminal key presses.
- `pubsub` &mdash; publish/subscribe mechanism for inter-tab communication in browser.
- [`tablist`](./src/tablist/README.md) &mdash; keeps track of all same origin tabs, elects leader and allows to send messages to all tabs or create private channels between any two tabs.


## Operators

- [`raf()`](./docs/raf.md) &mdash; de-bounces events using `window.requestAnimationFrame`.


## Other

- `fromStream()` &mdash; constructs observable from Node.js readable stream.

Most observables imported from this library have `ReadonlyBehaviorSubject` type.
Which is an `Observable` with an extra `.getValue()` to access the current value of the observable.

```ts
type ReadonlyBehaviorSubject<T> = Observable<T> & Pick<BehaviorSubject<T>, 'getValue'>;
```


## License

[Unlicense](LICENSE) &mdash; public domain.
