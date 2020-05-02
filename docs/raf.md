# `raf()`

`rxjs` operator which de-bounces events using `window.requestAnimationFrame`.
Emits the first value immediately. On sever, is stubbed and has no effect.

```ts
import { raf } from 'rx-use';

fromEvent(el, 'scroll').pipe(raf());
```
