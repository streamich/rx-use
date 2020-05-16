# `windowSize$`

`ReadonlyBehaviorSubject` that tracks the latest state of browser's window dimensions.
Is stubbed to also work on sever.

```ts
import { windowSize$ } from 'rx-use';

windowSize$.subscribe(({ width, height }) => {
  console.log(width, height); // 1024, 768
});
```
