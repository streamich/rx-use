import {filter, map} from "rxjs/operators";
import {Subject} from "rxjs/internal/Subject";
import type {Observable} from "rxjs";
import type {PubSub, TopicPredicate} from "./types";

type Message = [topic: string, data: unknown];

export class PubSubBC implements PubSub {
  public readonly ch: BroadcastChannel;
  private readonly bus$ = new Subject<Message>();

  constructor(public readonly bus: string) {
    this.ch = new BroadcastChannel(bus);
    this.ch.onmessage = (e) => {
      if (!Array.isArray(e.data) || e.data.length !== 2 || typeof e.data[0] !== 'string') return;
      this.bus$.next(e.data as Message);
    };
  }

  public readonly pub = (topic: string, data: unknown) => {
    this.ch.postMessage([topic, data]);
  };

  public readonly sub$ = <Data = unknown>(topicPredicate: TopicPredicate<Data>): Observable<Data> => {
    const predicate: (msg: Message) => boolean = typeof topicPredicate === 'string'
      ? (msg: Message) => msg[0] === topicPredicate
      : ([topic, data]: Message) => topicPredicate(topic, data as Data);
    return this.bus$.pipe(
      filter(predicate),
      map(([topic, data]) => data),
    ) as Observable<Data>;
  }

  public readonly end = () => {
    this.ch.close();
  };
}
