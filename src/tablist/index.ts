import {BehaviorSubject, Observable, timer, firstValueFrom, take, Subject, filter, switchMap, of, from} from "rxjs";
import {PubSubA, Message} from "../pubsub";
import type {PubSub} from "../pubsub/types";

const enum MSG {
  /** New tab asks for peer list. */
  HELLO,
  /** All tabs send their peer list. */
  LIST,
  /** Notify other tabs that this tab is alive. */
  HEARTBEAT,
  /** Call another tab. Establish a bi-directional private channel. */
  CALL,
  /** Send call accept message over the private channel. */
  CALL_ACK,
  /** Send a message over the private call channel. */
  CALL_MSG,
  /** Close private call channel. */
  CALL_END,
  /** Acknowledge closing private call channel. */
  CALL_END_ACK,
}

type HelloMessage = number;
type PingMessage = number;
type ListMessage = [id: number, peers: PeerList];
type CallMessage = [caller: number, callee: number];

type PeerList = Record<number, number>;

export interface TabListDependencies {
  /** Message broadcast bus to all tabs. */
  readonly bus: PubSub;
  /** Factory of one-to-one private channels between tabs. */
  readonly newBus: (name: string) => PubSub;
  /** How often to send heartbeat pings. */
  readonly clock?: number;
}

export class TabList {
  /** Unique ID of the current browser tab instance. Zero is not allowed. */
  public readonly id: number = (Date.now() * 0x100) + Math.floor(Math.random() * 256);
  /** ID of the leader tab. If equal to `.id`, then current tab is the leader. */
  public readonly leader$ = new BehaviorSubject<number>(0);
  /** List of known peers. Where key is peer ID and value is last heartbeat time. */
  public readonly peers: PeerList = {};
  /** Emitted on new incoming call. */
  public readonly incomingCall$ = new Subject<[tabId: number, call: PubSub]>();

  protected readonly clock$: Observable<number>;
  protected pingTimeout: number;

  /** Send other tabs a heartbeat. This is sent automatically in a loop. */
  public ping = () => this.deps.bus.pub(MSG.HEARTBEAT, this.id);

  public constructor(protected readonly deps: TabListDependencies) {
    const {bus, clock = 200} = deps;
    this.clock$ = timer(clock, clock);
    this.pingTimeout = clock * 5;

    // Listen for new peers joining.
    bus.sub$<HelloMessage>(MSG.HELLO).subscribe((id) => {
      const now = Date.now();
      this.mergePeers({[id]: now}, now);
      bus.pub<ListMessage>(MSG.LIST, [this.id, this.peers]);
    });

    // Listen for peer list updates.
    bus.sub$<ListMessage>(MSG.LIST).subscribe(([id, peers]) => {
      const now = Date.now();
      peers[id] = now;
      this.mergePeers(peers, now);
    });

    // Join the swarm.
    bus.pub<HelloMessage>(MSG.HELLO, this.id);

    // Send heartbeats to other tabs.
    this.clock$.subscribe(this.ping);

    // Listen to heartbeats from other tabs.
    bus.sub$<PingMessage>(MSG.HEARTBEAT).subscribe((id) => {
      const now = Date.now();
      this.mergePeers({[id]: now}, now);
    });

    // Setup a bi-directional channel for incoming calls.
    bus.sub$<CallMessage>(MSG.CALL).subscribe(([caller, callee]) => {
      if (callee !== this.id) return;
      const call = this.startCall(caller, callee);
      call.pub(MSG.CALL_ACK, 0);
      this.incomingCall$.next([caller, call]);
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

  private getCallNumber(caller: number, callee: number): string {
    return `${caller.toString(36)}-${callee.toString(36)}`;
  }

  private calls: Record<string, PubSub> = {};
  private startCall(caller: number, callee: number): PubSub {
    const callNumber = this.getCallNumber(caller, callee);
    if (!this.calls[callNumber]) {
      const self = this;
      const channel = this.deps.newBus(callNumber);
      let endReceived = false;
      const call = new class Call extends PubSubA {
        protected readonly s = channel.sub$<Message>(MSG.CALL_MSG).subscribe(this.bus$);
        public readonly pub = <Data = unknown>(topic: string | number, data: Data): void => channel.pub(MSG.CALL_MSG, [topic, data]);
        public readonly end = () => {
          channel.pub(endReceived ? MSG.CALL_END_ACK : MSG.CALL_END, 0);
          super.end();
          this.s.unsubscribe();
          channel.end();
          delete self.calls[callNumber];
        };
      };
      channel.sub$<number>(MSG.CALL_END).pipe(take(1)).subscribe(() => {
        endReceived = true;
        call.end();
      });
      this.calls[callNumber] = call;
    }
    return this.calls[callNumber];
  }

  /** Establish a bi-directional channel with another tab. */
  public call$(tabId: number): Observable<PubSub> {
    const callNumber = this.getCallNumber(this.id, tabId);
    const call = this.calls[callNumber];
    if (call) return of(call);
    return from((async () => {
      const call = this.startCall(this.id, tabId);
      const ack = firstValueFrom(call.sub$<number>(MSG.CALL_ACK));
      this.deps.bus.pub<CallMessage>(MSG.CALL, [this.id, tabId]);
      let timer; const timeout = new Promise((resolve, reject) => {
        timer = setTimeout(() => {
          call.end();
          reject(new Error('TIMEOUT'));
        }, 1000);
      });
      await Promise.race([ack, timeout]);
      clearTimeout(timer);
      return call;
    })());
  };

  public callLeader$(): Observable<PubSub> {
    return this.leader$.pipe(
      filter(id => !!id),
      switchMap(id => this.call$(id)),
    );
  }
}
