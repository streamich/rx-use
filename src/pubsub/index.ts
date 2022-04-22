import {filter, map} from "rxjs/operators";
import {Subject} from "rxjs";
import type {Observable} from "rxjs";
import type {PubSub, TopicPredicate} from "./types";

type Message = [topic: string | number, data: unknown, clock?: number];

export abstract class PubSubA implements Pick<PubSub, 'sub$'> {
  protected readonly bus$ = new Subject<Message>();

  public readonly sub$ = <Data = unknown>(topicPredicate: TopicPredicate<Data>): Observable<Data> => {
    const predicate: (msg: Message) => boolean = (typeof topicPredicate === 'string') || (typeof topicPredicate === 'number')
      ? (msg: Message) => msg[0] === topicPredicate
      : ([topic, data]: Message) => topicPredicate(topic, data as Data);
    return this.bus$.pipe(
      filter(predicate),
      map(([topic, data]) => data),
    ) as Observable<Data>;
  }
}

export class PubSubBC extends PubSubA implements PubSub {
  public readonly ch: BroadcastChannel;

  constructor(public readonly bus: string) {
    super();
    this.ch = new BroadcastChannel(bus);
    this.ch.onmessage = (e) => {
      this.bus$.next(e.data as Message);
    };
  }

  public readonly pub = (topic: string | number, data: unknown) => {
    this.ch.postMessage([topic, data]);
  };

  public readonly end = () => {
    this.ch.close();
  };
}

export class PubSubLS extends PubSubA implements PubSub {
  private clock = 0;

  private listener = (e: StorageEvent) => {
    if (e.key !== this.bus) return;
    if (!e.newValue) return;
    const msg = JSON.parse(e.newValue);
    this.bus$.next(msg as Message);
  };

  constructor(public readonly bus: string) {
    super();
    window.addEventListener('storage', this.listener);
  }

  public readonly pub = (topic: string | number, data: unknown) => {
    const msg: Message = [topic, data, this.clock++];
    const LS = localStorage;
    LS.setItem(this.bus, JSON.stringify(msg));
    LS.removeItem(this.bus);
  };

  public readonly end = () => {
    window.removeEventListener('storage', this.listener);
  };
}

export class PubSubM extends PubSubA implements PubSub {
  public readonly pub = (topic: string | number, data: unknown) => {
    const msg: Message = [topic, data];
    this.bus$.next(msg);
  };

  public readonly end = () => {};
}

const hasBC = typeof BroadcastChannel !== 'undefined';
const hasLS = (typeof window !== 'undefined') && 'localStorage' in window;

/**
 * Specifies whether the pubsub channels are binary safe. If true, the data
 * can be binary blobs such as Uint8Array or ArrayBuffer. If false, the user
 * has to make sure the data is JSON serializable.
 */
export const binSafe = hasBC || !hasLS;

/** Cache of global in-memory pubsub instances. */
const memoryCache: Record<string, PubSubM> = {};

/**
 * Creates new cross-tab pubsub broadcast channel. Own messages are not received.
 * 
 * @param bus The name of the broadcast bus, where messages will be published.
 * @returns A PubSub instance that publishes messages to the specified bus.
 */
export const pubsub = (bus: string): PubSub => {
  return hasBC
    ? new PubSubBC(bus)
    : hasLS
      ? new PubSubLS(bus)
      : (memoryCache[bus] || (memoryCache[bus] = new PubSubM()));
};
