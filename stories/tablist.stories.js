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
});

list.leader$.subscribe((leader) => {
  console.log('leader:', leader);
});

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
