import {filter, map} from "rxjs/operators";
import {Subject} from "rxjs";
import type {Observable} from "rxjs";
import type {PubSub, TopicPredicate} from "./types";

type Message = [topic: string, data: unknown];

export abstract class PubSubA implements Pick<PubSub, 'sub$'> {
  protected readonly bus$ = new Subject<Message>();

  public readonly sub$ = <Data = unknown>(topicPredicate: TopicPredicate<Data>): Observable<Data> => {
    const predicate: (msg: Message) => boolean = typeof topicPredicate === 'string'
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
      if (!Array.isArray(e.data) || e.data.length !== 2 || typeof e.data[0] !== 'string') return;
      this.bus$.next(e.data as Message);
    };
  }

  public readonly pub = (topic: string, data: unknown) => {
    this.ch.postMessage([topic, data]);
  };

  public readonly end = () => {
    this.ch.close();
  };
}

export class PubSubLS extends PubSubA implements PubSub {
  private listener = (e: StorageEvent) => {
    if (e.key !== this.bus) return;
    if (!e.newValue) return;
    const msg = JSON.parse(e.newValue);
    if (!Array.isArray(msg) || msg.length !== 2 || typeof msg[0] !== 'string') return;
    this.bus$.next(msg as Message);
  };

  constructor(public readonly bus: string) {
    super();
    window.addEventListener('storage', this.listener);
  }

  public readonly pub = (topic: string, data: unknown) => {
    const msg: Message = [topic, data];
    localStorage.setItem(this.bus, JSON.stringify(msg));
    localStorage.removeItem(this.bus);
  };

  public readonly end = () => {
    window.removeEventListener('storage', this.listener);
  };
}

export class PubSubM extends PubSubA implements PubSub {
  public readonly pub = (topic: string, data: unknown) => {
    const msg: Message = [topic, data];
    this.bus$.next(msg);
  };

  public readonly end = () => {};
}

const bus = 'rx-use';

export const pubsub = typeof BroadcastChannel !== 'undefined'
  ? new PubSubBC(bus)
  : (typeof window !== 'undefined') && 'localStorage' in window
    ? new PubSubLS(bus)
    : new PubSubM();
