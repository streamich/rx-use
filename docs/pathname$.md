# `pathname$`

`ReadonlyBehaviorSubject` that tracks emits on changes in `pathname` property of
`window.location`. Is stubbed to also work on sever.

```ts
import { pathname$ } from 'rx-use';

pathname$.getValue(); // /my/path

pathname$.subscribe((pathname) => {
  console.log(pathname); // /my/path2
});
```
