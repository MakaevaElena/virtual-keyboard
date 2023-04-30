// const audio = new Audio('/audio/tink.wav');

import { data } from './data.js';

function soundClick() {
  var audio = new Audio();
  audio.src = './assets/keysound.mp3';
  audio.autoplay = true;
  audio.volume = 0.6;
}

const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
    textarea: null,
    about: null,
    sound: null,
    close: null,
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: '',
    capsLock: false,
    langEn: true,
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    this.elements.textarea = document.createElement('textarea');
    this.elements.about = document.createElement('div');
    this.elements.sound = document.createElement('div');
    this.elements.close = document.createElement('div');

    // Setup main elements
    this.elements.main.classList.add('keyboard', 'keyboard--hidden');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.textarea.classList.add('use-keyboard-input');
    this.elements.about.classList.add('about', 'keyboard--hidden');
    this.elements.sound.classList.add('sound', 'keyboard--hidden');
    this.elements.close.classList.add('close', 'keyboard--hidden');

    this.elements.about.innerHTML += '<p>Change lang: Shift + Alt</p>';
    this.elements.sound.innerText = 'Sound';
    this.elements.close.innerText = 'CLOSE V-keyboard';

    this.elements.textarea.placeholder = 'Click here';
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.textarea);
    document.body.appendChild(this.elements.main);
    document.body.appendChild(this.elements.about);
    document.body.appendChild(this.elements.sound);
    document.body.appendChild(this.elements.close);

    // Automatically use keyboard for elements with .use-keyboard-input

    document.querySelectorAll('.use-keyboard-input').forEach((element) => {
      element.addEventListener('focus', () => {
        this.open(element.value, (currentValue) => {
          element.value = currentValue;
        });
      });
    });

    //! keydown
    document.addEventListener('keydown', (evt) => {
      if (evt.repeat) return;
      // soundClick();
      const sameKeyElement = document.querySelector(`.keyboard__key[data-key=${evt.code}]`);
      sameKeyElement.classList.add('active');
      console.log(evt.code);

      if (evt.code === 'ShiftLeft') {
        this._toggleLang();
        console.log(this.properties.langEn);
      }
    });

    document.addEventListener('keyup', (evt) => {
      const sameKeyElement = document.querySelector(`.keyboard__key[data-key=${evt.code}]`);
      sameKeyElement.classList.remove('active');
    });

    this.elements.close.addEventListener('click', () => {
      this.elements.main.classList.add('keyboard--hidden');
      this.elements.close.classList.add('keyboard--hidden');
      this.elements.sound.classList.add('keyboard--hidden');
    });

    //! lang
    // const langBtn = document.querySelector('#55');
    // console.log(langBtn);
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    let lang = '';

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    data.forEach((dataKey, i) => {
      // this.properties.langEn ? (lang = key.en) : (lang = key.ru);
      const keyElement = document.createElement('button');
      const insertLineBreak = ['Backspace', 'DEL', 'ENTER'].indexOf(dataKey.en) !== -1 || i === 55;

      // Add attributes/classes
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');
      keyElement.dataset.key = dataKey.key;
      keyElement.id = i;

      switch (dataKey.en) {
        case 'Backspace':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
          // keyElement.innerHTML = createIconHTML('Backspace');
          keyElement.textContent = dataKey.en;

          keyElement.addEventListener('click', () => {
            soundClick();
            this.properties.value = this.properties.value.substring(
              0,
              this.properties.value.length - 1,
            );
            this._triggerEvent('oninput');
          });

          break;

        case 'DEL':
          keyElement.classList.add('keyboard__key--dark');
          // keyElement.innerHTML = createIconHTML('DEL');
          keyElement.textContent = dataKey.en;

          keyElement.addEventListener('click', () => {
            soundClick();
            this.properties.value = this.properties.value.substring(
              0,
              this.properties.value.length - 1,
            );
            this._triggerEvent('oninput');
          });

          break;

        case 'Caps Lock':
          keyElement.classList.add(
            'keyboard__key--wide',
            'keyboard__key--dark',
            'keyboard__key--activatable',
          );
          // keyElement.innerHTML = createIconHTML('Caps Lock');
          keyElement.textContent = dataKey.en;

          keyElement.addEventListener('click', () => {
            soundClick();
            this._toggleCapsLock();
            keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
          });

          break;

        case 'ENTER':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
          // keyElement.innerHTML = createIconHTML('ENTER');
          keyElement.textContent = dataKey.en;

          keyElement.addEventListener('click', () => {
            soundClick();
            this.properties.value += '\n';
            this._triggerEvent('oninput');
          });

          break;

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide');
          // keyElement.innerHTML = createIconHTML('space_bar');
          keyElement.textContent = dataKey.en;

          keyElement.addEventListener('click', () => {
            soundClick();
            this.properties.value += ' ';
            this._triggerEvent('oninput');
          });

          break;

        case 'Shift':
          keyElement.classList.add('keyboard__key--dark');
          if (i !== 55) keyElement.classList.add('keyboard__key--wide');
          if (i === 42) keyElement.dataset.key = 'ShiftLeft';
          if (i === 55) keyElement.dataset.key = 'ShiftRight';
          // keyElement.innerHTML = createIconHTML('Shift');
          keyElement.textContent = dataKey.en;

          keyElement.addEventListener('click', () => {
            soundClick();
            // this.close();
            // this._triggerEvent('onclose');
          });

          break;

        case 'Up':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.innerHTML = createIconHTML('arrow_drop_up');

          keyElement.addEventListener('click', () => {
            soundClick();
            // this.close();
            // this._triggerEvent('onclose');
          });

          break;

        case 'Down':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.innerHTML = createIconHTML('arrow_drop_down');

          keyElement.addEventListener('click', () => {
            soundClick();
            // this.close();
            // this._triggerEvent('onclose');
          });

          break;

        case 'Left':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.innerHTML = createIconHTML('arrow_left');

          keyElement.addEventListener('click', () => {
            soundClick();
            // this.close();
            // this._triggerEvent('onclose');
          });

          break;

        case 'Right':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.innerHTML = createIconHTML('arrow_right');

          keyElement.addEventListener('click', () => {
            soundClick();
            // this.close();
            // this._triggerEvent('onclose');
          });

          break;

        case 'Ctrl':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.textContent = dataKey.en;

          keyElement.addEventListener('click', () => {
            soundClick();
            // this.close();
            // this._triggerEvent('onclose');
          });

          break;

        case 'Win':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.textContent = dataKey.en;

          keyElement.addEventListener('click', () => {
            soundClick();
            // this.close();
            // this._triggerEvent('onclose');
          });

          break;

        case 'Alt':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.textContent = dataKey.en;

          keyElement.addEventListener('click', () => {
            soundClick();
            // this.close();
            // this._triggerEvent('onclose');
          });

          break;

        case 'Tab':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.textContent = dataKey.en;

          keyElement.addEventListener('click', () => {
            soundClick();
            // this.close();
            // this._triggerEvent('onclose');
          });

          break;

        case 'Lang':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.textContent = dataKey.en;

          keyElement.addEventListener('click', () => {
            soundClick();
            this._toggleLang();
            console.log(this.properties.langEn);
            // this.close();
            // this._triggerEvent('onclose');
          });

          break;

        //!
        default:
          this.properties.langEn ? (lang = dataKey.en) : (lang = dataKey.ru);
          // console.log(this.properties.langEn);
          // console.log(lang);
          keyElement.textContent = lang.toLowerCase();

          // this.properties.langEn
          //   ? (keyElement.textContent = key.en.toLowerCase())
          //   : (keyElement.textContent = key.ru.toLowerCase());

          keyElement.addEventListener('click', () => {
            soundClick();

            if (this.properties.langEn) {
              this.properties.value += this.properties.capsLock
                ? dataKey.en.toUpperCase()
                : dataKey.en.toLowerCase();
            } else {
              this.properties.value += this.properties.capsLock
                ? dataKey.ru.toUpperCase()
                : dataKey.ru.toLowerCase();
            }

            this._triggerEvent('oninput');
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      const isDark = key.classList.contains('keyboard__key--dark');

      if (key.childElementCount === 0 && !isDark) {
        key.textContent = this.properties.capsLock
          ? key.textContent.toUpperCase()
          : key.textContent.toLowerCase();
      }
    }
  },

  //!
  _toggleLang() {
    this.properties.langEn = !this.properties.langEn;
    for (const key of this.elements.keys) {
      const elem = data.filter((obj) => obj.key === key.dataset.key)[0];
      // console.log(a);
      key.textContent = this.properties.langEn ? elem.en : elem.ru;
    }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboard--hidden');

    this.elements.about.classList.remove('keyboard--hidden');
    this.elements.sound.classList.remove('keyboard--hidden');
    this.elements.close.classList.remove('keyboard--hidden');
  },

  close() {
    this.properties.value = '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add('keyboard--hidden');
  },
};

window.addEventListener('DOMContentLoaded', function () {
  Keyboard.init();
});
