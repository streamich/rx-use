import {colorSchemeDark$} from '../src/colorSchemeDark$';

export default {
  title: 'colorSchemeDark$',
};

export const Default = () => {
  const btn = document.createElement('button');
  colorSchemeDark$.subscribe(value => {
    console.log('value', value);
    btn.innerText = value ? 'TRUE' : 'FALSE';
  });
  btn.addEventListener('click', e => console.log(e));
  return btn;
};
