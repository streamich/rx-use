import {darkTheme$} from '../src/darkTheme$';

export default {
  title: 'darkTheme$',
};

export const Default = () => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.innerText = 'Hello Button';
  darkTheme$.subscribe(value => {
    btn.innerText = value ? 'TRUE' : 'FALSE';

  });
  btn.addEventListener('click', e => console.log(e));
  return btn;
};
