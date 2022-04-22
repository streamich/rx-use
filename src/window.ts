export const window: Window | undefined = typeof document === 'object' ? (global as unknown as Window) : undefined;
