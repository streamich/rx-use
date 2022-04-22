import {BehaviorSubject, Observable, timer} from "rxjs";
import type {PubSub} from "../pubsub/types";

const enum CHANNEL {
  /** New tab asks for peer list. */
  HELLO,
  /** All tabs send their peer list. */
  LIST,
  /** Notify other tabs that this tab is alive. */
  PING,
}

type HelloMessage = number;
type PingMessage = number;
type ListMessage = [id: number, peers: PeerList];

type PeerList = Record<number, number>;

/**  */
export class TabList {
  /** Unique ID of the current browser tab instance. Zero is not allowed. */
  public readonly id: number = Math.ceil(Math.random() * 0xFFFFFFFFFFFFFF);
  public readonly leader$ = new BehaviorSubject<number>(0);
  public readonly peers: PeerList = {};
  protected readonly clock$: Observable<number>;
  protected pingTimeout: number

  public ping = () => {
    this.pubsub.pub(CHANNEL.PING, this.id);
  }

  public constructor(protected readonly pubsub: PubSub, clock: number = 200) {
    this.clock$ = timer(clock, clock);
    this.pingTimeout = clock * 5;

    // Listen for new peers joining.
    pubsub.sub$<HelloMessage>(CHANNEL.HELLO).subscribe((id) => {
      const now = Date.now();
      this.mergePeers({[id]: now}, now);
      pubsub.pub<ListMessage>(CHANNEL.LIST, [this.id, this.peers]);
    });

    // Listen for peer list updates.
    pubsub.sub$<ListMessage>(CHANNEL.LIST).subscribe(([id, peers]) => {
      const now = Date.now();
      peers[id] = now;
      this.mergePeers(peers, now);
    });

    // Join the swarm.
    this.pubsub.pub<HelloMessage>(CHANNEL.HELLO, this.id);

    // Send heartbeats to other tabs.
    this.clock$.subscribe(this.ping);

    // Listen to heartbeats from other tabs.
    pubsub.sub$<PingMessage>(CHANNEL.PING).subscribe((id) => {
      const now = Date.now();
      this.mergePeers({[id]: now}, now);
    });
  }

  public mergePeers(peers: PeerList, now: number = Date.now()): number {
    let leader = 0;
    const localList = this.peers;
    for (const [key, time] of Object.entries(peers)) {
      const id = Number(key);
      if ((time + this.pingTimeout < now) || (id === this.id)) continue;
      if (!localList[id]) localList[id] = time;
      else if (localList[id] < time) localList[id] = time;
      if (leader < id) leader = id;
    }
    for (const [key, time] of Object.entries(localList)) {
      const id = Number(key);
      if ((time + this.pingTimeout < now) || (id === this.id)) delete localList[id];
      if (leader < id) leader = id;
    }
    if (this.id > leader) leader = this.id;
    if (leader !== this.leader$.getValue()) this.leader$.next(leader);
    return leader;
  }
}
