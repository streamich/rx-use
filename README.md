# rx-use

Sensor and side-effect library for [`rxjs`](https://rxjs-dev.firebaseapp.com/).


## Observables

- [`location$`](./docs/location$.md) &mdash; browser location and history sensor.
  - [`pathname$`](./docs/pathname$.md) &mdash; browser location pathname sensor.
- [`network$`](./docs/network$.md) &mdash; returns consolidate network status info.
  - [`onLine$`](./docs/onLine$.md) &mdash; `boolean` whether user is on-line.
  - [`connection$`](./docs/connection$.md) &mdash; information about user's network connection.
- [`windowSize$`](./docs/windowSize$.md) and [`windowSizeRaf$`](./docs/windowSizeRaf$.md) &mdash; browser window dimension sensor.
- [`matchMedia$()`](./docs/matchMedia$.md) &mdash; returns boolean indicating media query match.


## Operators

- [`raf()`](./docs/raf.md) &mdash; de-bounces events using `window.requestAnimationFrame`.


## License

[Unlicense](LICENSE) &mdash; public domain.
