import type {Observable} from 'rxjs';

export type TopicPredicate<Data = unknown> =
  | string
  | number
  | ((topic: string | number, data: Data) => boolean);

export interface PubSub {
  /** Whether the pubsub service supports binary Uint8Array payloads. */
  bin?: boolean;
  pub: (topic: string | number, data: unknown) => void;
  sub$: <Data = unknown>(topicPredicate: TopicPredicate<Data>) => Observable<Data>;
  end: () => void;
}
