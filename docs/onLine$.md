# `onLine$`

`BehaviorSubject` which tracks the latest value of `window.onLine` property, boolean.
Is stubbed to also work on sever.

```ts
import { onLine$ } from 'rx-use/lib/onLine$';

onLine$.getValue(); // true

onLine$.subscribe((onLine) => {
  // true / false
});
```
