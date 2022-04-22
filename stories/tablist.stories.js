import {pubsub} from '../src/pubsub';
import {TabList} from '../src/tablist';
import {el} from '../src/el';
import {BehaviorSubject, map} from 'rxjs';

export default {
  title: 'tab list',
};

const bus = pubsub('test');
const list = new TabList({
  bus,
  newBus: (name) => pubsub(name),
});

list.leader$.subscribe((leader) => {
  console.log('leader:', leader);
});

list.incomingCall$.subscribe(([id, call]) => {
  console.log('incoming call:', id);
  call.sub$('add').subscribe(([a, b]) => {
    call.pub('result', a + b);
  });
});

// setInterval(() => {
//   console.log('peers:', list.peers);
// }, 3000);

setTimeout(async () => {
  console.log(list.peers);
  for (const [key] of Object.entries(list.peers)) {
    const id = Number(key);
    console.log('calling: ', id);
    list.call$(id).subscribe((call) => {
      console.log('call started', call);
      call.sub$('result').subscribe((result) => {
        console.log('result:', result);
      });
      call.pub('add', [1, 2]);
    });
  }
}, 3000);

export const Default = () => {
  const incoming$ = new BehaviorSubject([]);
  bus.sub$(4).subscribe((data) => {
    console.log('data received:', data);
    incoming$.next(incoming$.getValue().concat(data));
  });

  return el('div', {}, [
    'waiting...'
  ]).el
};
