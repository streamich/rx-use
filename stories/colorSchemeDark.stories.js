import {colorSchemeDark$} from '../src/colorSchemeDark$';

export default {
  title: 'colorSchemeDark$',
};

export const Default = () => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.innerText = 'Hello Button';
  colorSchemeDark$.subscribe(value => {
    btn.innerText = value ? 'TRUE' : 'FALSE';

  });
  btn.addEventListener('click', e => console.log(e));
  return btn;
};
