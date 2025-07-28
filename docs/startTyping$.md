# `startTyping$`

Observable that fires when user starts typing in the browser, but no input field is selected. Analogous to the [`useStartTyping` hook](https://github.com/streamich/react-use/blob/master/docs/useStartTyping.md) from react-use.

The observable emits `KeyboardEvent` objects when:
- User presses a valid typing character (letters a-z, numbers 0-9)
- No modifier keys are pressed (ctrl, alt, meta)
- No editable element has focus (no INPUT, TEXTAREA, or contenteditable elements are focused)

Is server-safe and returns an empty observable on the server.

```ts
import { startTyping$ } from 'rx-use/lib/startTyping$';

startTyping$.subscribe((event: KeyboardEvent) => {
  console.log('User started typing:', event.key);
  // Focus a search input, open a command palette, etc.
});
```

## Use Cases

- Auto-focus search inputs when user starts typing
- Open command palettes or quick actions
- Implement keyboard shortcuts for navigation
- Start search-as-you-type functionality