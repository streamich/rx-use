# `location$`

`ReadonlyBehaviorSubject` that tracks the latest state of browser's `window.location`
and `window.history` properties. Is stubbed to also work on sever.

```ts
import { location$ } from 'rx-use/lib/location$';

location$.subscribe(({ protocol }) => {
  console.log(protocol); // https:
});
```

Now you can listen to browser's `history` updates.

```js
history.pushState( ... );
```
