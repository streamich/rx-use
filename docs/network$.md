# `network$`

`BehaviorSubject` that tracks user's network connection status. Is stubbed to also work on sever.

```ts
import { network$ } from 'rx-use/lib/network$';

network$.getValue();
/*
{
  since: Date;
  onLine: boolean;
  downlink?: number;
  downlinkMax?: number;
  effectiveType?: string;
  rtt?: number;
  type?: string;
}
*/

network$.subscribe((network) => {
  // ..
});
```
