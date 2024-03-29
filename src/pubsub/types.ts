import type {Observable} from 'rxjs';

export type TopicPredicate<Data = unknown> = string | number | ((topic: string | number, data: Data) => boolean);

export interface PubSub {
  /** Whether the pubsub service supports binary Uint8Array payloads. */
  bin?: boolean;
  pub: <Data = unknown>(topic: string | number, data: Data) => void;
  sub$: <Data = unknown>(topicPredicate: TopicPredicate<Data>) => Observable<Data>;
  end: () => void;
  end$: Observable<void>;
}
