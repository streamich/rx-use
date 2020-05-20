# `matchMedia$`

`ReadonlyBehaviorSubject` that tracks status of a media query. Emits `true` or `false` values.
Does not emit same value in sequence.

```ts
import { matchMedia$ } from 'rx-use/lib/matchMedia$';

matchMedia$('only screen and (max-width: 600px)').subscribe(() => {});
matchMedia$('prefers-reduced-motion').subscribe(() => {});
matchMedia$('(prefers-color-scheme: dark)').subscribe(() => {});
```
