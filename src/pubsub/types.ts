import type {Observable} from 'rxjs';

export type TopicPredicate<Data = unknown> = string | number | ((topic: string | number, data: Data) => boolean);

export interface PubSub<Data = unknown> {
  /** Whether the pubsub service supports binary Uint8Array payloads. */
  bin?: boolean;

  /**
   * Publish an event to a topic.
   * @param topic The topic to publish to.
   * @param data The data to publish.
   * @param loopback Whether to loop back the event to the sender.
   * @returns
   */
  pub: (topic: string | number, data: Data, loopback?: boolean) => void;

  /**
   * Subscribe to events on a topic.
   * @param topicPredicate The topic to subscribe to.
   * @returns An observable that emits events from the topic.
   */
  sub$: (topicPredicate: TopicPredicate<Data>) => Observable<Data>;


  end: () => void;
  end$: Observable<void>;
}
