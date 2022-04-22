import {BehaviorSubject, Observable, timer} from "rxjs";
import {pubsub} from "../pubsub";
import type {PubSub} from "../pubsub/types";

const enum CHANNEL {
  /** New tab asks for peer list. */
  HELLO,
  /** All tabs send their peer list. */
  LIST,
  /** Notify other tabs that this tab is alive. */
  PING,
  /** Call another tab. Establish a bi-directional private channel. */
  CALL,
}

type HelloMessage = number;
type PingMessage = number;
type ListMessage = [id: number, peers: PeerList];
type CallMessage = [caller: number, callee: number];

type PeerList = Record<number, number>;

export interface TabListDependencies {
  readonly bus: PubSub;
  readonly newBus: (name: string) => PubSub;
  readonly clock?: number;
}

export class TabList {
  /** Unique ID of the current browser tab instance. Zero is not allowed. */
  public readonly id: number = (Date.now() * 0x100) + Math.floor(Math.random() * 256);
  public readonly leader$ = new BehaviorSubject<number>(0);
  public readonly peers: PeerList = {};
  protected readonly clock$: Observable<number>;
  protected pingTimeout: number

  /** Send other tabs a heartbeat. This is sent automatically in a loop. */
  public ping = () => {
    this.deps.bus.pub(CHANNEL.PING, this.id);
  }

  public constructor(protected readonly deps: TabListDependencies) {
    const {bus, clock = 200} = deps;
    this.clock$ = timer(clock, clock);
    this.pingTimeout = clock * 5;

    // Listen for new peers joining.
    bus.sub$<HelloMessage>(CHANNEL.HELLO).subscribe((id) => {
      const now = Date.now();
      this.mergePeers({[id]: now}, now);
      bus.pub<ListMessage>(CHANNEL.LIST, [this.id, this.peers]);
    });

    // Listen for peer list updates.
    bus.sub$<ListMessage>(CHANNEL.LIST).subscribe(([id, peers]) => {
      const now = Date.now();
      peers[id] = now;
      this.mergePeers(peers, now);
    });

    // Join the swarm.
    bus.pub<HelloMessage>(CHANNEL.HELLO, this.id);

    // Send heartbeats to other tabs.
    this.clock$.subscribe(this.ping);

    // Listen to heartbeats from other tabs.
    bus.sub$<PingMessage>(CHANNEL.PING).subscribe((id) => {
      const now = Date.now();
      this.mergePeers({[id]: now}, now);
    });
  }

  protected mergePeers(peers: PeerList, now: number = Date.now()): number {
    let leader = this.id;
    Object.assign(this.peers, peers);
    for (const [key, time] of Object.entries(this.peers)) {
      const id = Number(key);
      if ((time + this.pingTimeout < now) || (id === this.id)) delete this.peers[id];
      if (leader > id) leader = id;
    }
    if (leader !== this.leader$.getValue()) this.leader$.next(leader);
    return leader;
  }

  private getCallNumber(tabId: number): string {
    let id1 = this.id;
    let id2 = tabId;
    if (id1 > id2) [id1, id2] = [id2, id1];
    return `${id1.toString(36)}-${id2.toString(36)}`;
  }

  /** Establish a bi-directional channel with another tab. */
  public async call(tabId: number): Promise<PubSub> {
    const callNumber = this.getCallNumber(tabId);
    const channel = pubsub(callNumber);
    this.deps.bus.pub<CallMessage>(CHANNEL.CALL, [this.id, tabId]);
    return channel;
  };
}
