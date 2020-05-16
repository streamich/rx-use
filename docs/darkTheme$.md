# `darkTheme$`

`ReadonlyBehaviorSubject` emits boolean, `true` if UI should be displayed as dark theme.
It uses `prefers-color-scheme` media query to figure out system setting user has
selected, if user has not explicitly selected color scheme it uses current time to
decide if mode should be dark.
