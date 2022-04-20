import type {Observable} from 'rxjs';

export type TopicPredicate<Data = unknown> =
  | string
  | ((topic: string, data: Data) => boolean);

export interface PubSub {
  /** Whether the pubsub service supports binary Uint8Array payloads. */
  bin?: boolean;
  pub: (topic: string, data: unknown) => void;
  sub$: <Data = unknown>(topicPredicate: TopicPredicate<Data>) => Observable<Data>;
  end: () => void;
}
