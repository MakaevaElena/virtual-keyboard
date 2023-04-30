import Keyboard from './Keyboard.js';
import { data } from './data.js';

window.addEventListener('DOMContentLoaded', function () {
  const keyboard = new Keyboard(data);
  keyboard.init();
});
