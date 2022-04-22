import {pubsub} from '../src/pubsub';
import {el} from '../src/el';
import {BehaviorSubject, map} from 'rxjs';

export default {
  title: 'pubsub',
};

const channel = pubsub('test');

export const Default = () => {
  const incoming$ = new BehaviorSubject([]);
  channel.sub$('test').subscribe((data) => {
    console.log('data received:', data);
    incoming$.next(incoming$.getValue().concat(data));
  });
  const input = el('input', {type: 'text'});

  return el('div', {}, [
    input,
    el('button', {type: 'button', on: {
      click: (ev) => {
        console.log('sending:', input.el.value);
        channel.pub('test', input.el.value);
      },
    }}, 'Send message'),
    el('div', {}, [
      el('h2', {}, 'Received messages:'),
      el('ul', {}, incoming$.pipe(map((data) => data.map(msg => el('li', {}, [msg]))))),
    ]),
  ]).el
};
