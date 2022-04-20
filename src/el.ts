import {Observable, Observer} from "rxjs";

export type HtmlEventHandler<K extends keyof HTMLElementEventMap> = (this: HTMLObjectElement, ev: HTMLElementEventMap[K]) => any;

export type RxHtmlElementAttributes = Record<string, unknown | Observable<unknown>> & {
  on: {[K in keyof HTMLElementEventMap]?: Observer<HTMLElementEventMap[K]> | HtmlEventHandler<K>};
};

export type RxHtmlElementChild =
  | string
  | number
  | boolean
  | null
  | undefined
  | RxHtmlElement<any>
  | RxHtmlElementChild[];

export class RxHtmlElement<K extends keyof HTMLElementTagNameMap> {
  public readonly el: HTMLElementTagNameMap[K];

  constructor(tagName: K) {
    this.el = document.createElement<K>(tagName);
  }

  on$<T extends keyof HTMLElementEventMap>(type: T): Observable<HTMLElementEventMap[T]> {
    return new Observable<HTMLElementEventMap[T]>((observer: Observer<HTMLElementEventMap[T]>) => {
      const handler = (e: HTMLElementEventMap[T]) => observer.next(e);
      this.el.addEventListener(type, handler as any);
      return () => this.el.removeEventListener(type, handler as any);
    });
  }
}

const appendChildren = (el: RxHtmlElement<any>, children?: RxHtmlElementChild[]) => {
  if (!children) return;
  for (const child of children) {
    switch (typeof child) {
      case "string":
      case "number": {
        const text = document.createTextNode(String(child));
        el.el.appendChild(text);
        break;
      }
      case "object": {
        if (child instanceof RxHtmlElement) {
          el.el.appendChild(child.el);
        } else if (child instanceof Array) {
          appendChildren(el, child);
        }
        break;
      }
    }
  }
};

export const el = <K extends keyof HTMLElementTagNameMap>(tag: K, attributes: RxHtmlElementAttributes, children?: RxHtmlElement<K>[]) => {
  const el = new RxHtmlElement<K>(tag);
  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'on') continue;
    if (value instanceof Observable) value.subscribe((v) => el.el.setAttribute(key, v));
    else el.el.setAttribute(key, String(value));
  }
  if (attributes.on)
    for (const [type, observer] of Object.entries(attributes.on)) {
      if (typeof observer === 'function') {
        el.on$(type as any).subscribe({next: observer});
      } else {
        el.on$(type as any).subscribe(observer);
      }
    }
  appendChildren(el, children);
  return el;
};
