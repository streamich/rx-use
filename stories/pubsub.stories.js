import {pubsub} from '../src/pubsub';
import {el} from '../src/el';

export default {
  title: 'pubsub',
};

pubsub.sub$('test').subscribe((data) => {
  console.log('data received:', data);
});

export const Default = () => {
  return el('div', {}, [
    el('input', {type: 'text'}),
    el('button', {type: 'button', on: {
      click: (ev) => {
        console.log('Click!');
        pubsub.pub('test', 'Hello from pubsub');    
      },
    }}, 'Send message')
  ]).el
};
