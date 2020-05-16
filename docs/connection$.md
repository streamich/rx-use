# `connection$`

`ReadonlyBehaviorSubject` that changes in `window.navigator.connection` object.
Is stubbed to also work on sever.

```ts
import { connection$ } from 'rx-use/lib/connection$';

connection$.getValue();
/*
{
  downlink?: number;
  downlinkMax?: number;
  effectiveType?: string;
  rtt?: number;
  type?: string;
}
*/

connection$.subscribe((connection) => {
  // ..
});
```
