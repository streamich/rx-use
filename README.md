# rx-use

Sensor and side-effect library for [`rxjs`](https://rxjs-dev.firebaseapp.com/).


## `location$`

`BehaviorSubject` that tracks the latest state of browser's `window.location`
and `window.history` properties. Is stubbed to also work on sever.

```ts
import { location$ } from 'rx-use';

location$.subscribe(({ protocol }) => {
  console.log(protocol); // https:
});
```


## License

[Unlicense](LICENSE) &mdash; public domain.
