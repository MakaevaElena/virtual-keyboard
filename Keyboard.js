import { moveRow } from './utils.js';

export default class Keyboard {
  constructor(data) {
    this.data = data;
  }

  elements = {
    main: null,
    keysContainer: null,
    keys: [],
    textarea: null,
    about: null,
    close: null,
  };

  eventHandlers = {
    oninput: null,
    onclose: null,
  };

  properties = {
    value: '',
    capsLock: false,
    shift: false,
    langEn: true,
    sound: false,
    speech: true,
  };

  init() {
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');
    this.elements.textarea = document.createElement('textarea');
    this.elements.about = document.createElement('div');
    this.elements.close = document.createElement('div');

    this.elements.main.classList.add('keyboard', 'keyboard--hidden');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.textarea.classList.add('use-keyboard-input');
    this.elements.about.classList.add('about', 'keyboard--hidden');
    this.elements.close.classList.add('close', 'keyboard--hidden');
    this.elements.about.innerHTML +=
      '<p>Change lang: press key <strong>Eng / Ru</strong></p><p>On Sound: press key <strong>Sound</strong></p>';
    this.elements.close.innerText = 'CLOSE V - keyboard';
    this.elements.textarea.placeholder = 'Click here';
    this.elements.textarea.setAttribute('type', 'text');
    this.elements.textarea.setAttribute('x-webkit-speech', 'true');
    this.elements.keysContainer.appendChild(this._createKeys());
    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.textarea);
    document.body.appendChild(this.elements.main);
    document.body.appendChild(this.elements.about);
    document.body.appendChild(this.elements.close);

    document.querySelectorAll('.use-keyboard-input').forEach((element) => {
      element.addEventListener('blur', () => element.focus());

      element.addEventListener('focus', () => {
        this.open(element.value, (currentValue) => {
          element.value = currentValue;
        });
      });
    });

    //Keydown
    document.addEventListener('keydown', (evt) => {
      // console.log(evt.code);
      if (evt.repeat) return;
      const sameKeyElement = document.querySelector(`.keyboard__key[data-key=${evt.code}]`);
      sameKeyElement.classList.add('active');

      if (evt.code === 'ShiftLeft') {
        this._toggleLang();
        console.log(this.properties.langEn);
      }
    });

    document.addEventListener('keyup', (evt) => {
      const sameKeyElement = document.querySelector(`.keyboard__key[data-key=${evt.code}]`);
      sameKeyElement.classList.remove('active');
      // console.log(evt.code);
    });

    this.elements.close.addEventListener('click', () => {
      this.elements.main.classList.add('keyboard--hidden');
      // this.elements.close.classList.add('keyboard--hidden');
      this.elements.close.innerText = 'OPEN keyboard';
      this.elements.about.classList.add('keyboard--hidden');
    });
  }

  _createIconHTML = (icon_name) => {
    return `<i class="material-icons">${icon_name}</i>`;
  };

  _soundClickEn() {
    const audio = new Audio();
    audio.src = './assets/sound0.mp3';
    audio.autoplay = true;
  }

  _soundClickRu() {
    const audio = new Audio();
    audio.src = './assets/sound1.mp3';
    audio.autoplay = true;
  }

  _soundSpecial() {
    const audio = new Audio();
    audio.src = './assets/sound2.mp3';
    audio.autoplay = true;
  }

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const language = localStorage.getItem('language');
    let lang = '';

    this.data.forEach((dataKey, i) => {
      const keyElement = document.createElement('button');
      const insertLineBreak = ['Backspace', 'DEL', 'ENTER'].indexOf(dataKey.en) !== -1 || i === 55;

      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');
      keyElement.dataset.key = dataKey.key;
      keyElement.id = i;

      switch (dataKey.en) {
        case 'Backspace':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
          keyElement.textContent = dataKey.en;

          keyElement.addEventListener('click', () => {
            if (this.properties.sound) this._soundSpecial();
            this.properties.value = this.properties.value.substring(
              0,
              this.properties.value.length - 1,
            );
            this._triggerEvent('oninput');
          });

          break;

        case 'DEL':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.textContent = dataKey.en;

          keyElement.addEventListener('click', () => {
            if (this.properties.sound) this._soundSpecial();
            this.properties.value = this.properties.value.substring(
              0,
              this.properties.value.length - 1,
              // this.properties.value.innerText.slice(0, -1),
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
          keyElement.textContent = dataKey.en;

          keyElement.addEventListener('click', () => {
            if (this.properties.sound) this._soundSpecial();
            this._toggleCapsLock();
            keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
          });

          break;

        case 'ENTER':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
          keyElement.textContent = dataKey.en;

          keyElement.addEventListener('click', () => {
            if (this.properties.sound) this._soundSpecial();
            this.properties.value += '\n';
            this._triggerEvent('oninput');
          });

          break;

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.textContent = dataKey.en;

          keyElement.addEventListener('click', () => {
            if (this.properties.sound) this._soundSpecial();
            this.properties.value += ' ';
            this._triggerEvent('oninput');
          });

          break;

        //! shift
        case 'Shift':
          keyElement.classList.add('keyboard__key--dark', 'keyboard__key--activatable');
          if (i !== 55) keyElement.classList.add('keyboard__key--wide');
          if (i === 42) keyElement.dataset.key = 'ShiftLeft';
          if (i === 55) keyElement.dataset.key = 'ShiftRight';
          keyElement.textContent = dataKey.en;

          keyElement.addEventListener('click', () => {
            if (this.properties.sound) this._soundSpecial();
            this._toggleShift();
            keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);

            // if (typeof +dataKey.en === 'number') {
            //   this.properties.value += this.properties.shift ? dataKey.simbol : dataKey.en;
            // }
          });

          break;

        case 'Up':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.innerHTML = this._createIconHTML('arrow_drop_up');

          keyElement.addEventListener('click', () => {
            moveRow(dataKey.key);
            if (this.properties.sound) this._soundSpecial();
          });

          break;

        case 'Down':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.innerHTML = this._createIconHTML('arrow_drop_down');

          keyElement.addEventListener('click', () => {
            moveRow(dataKey.key);
            if (this.properties.sound) this._soundSpecial();
          });

          break;

        case 'Left':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.innerHTML = this._createIconHTML('arrow_left');

          keyElement.addEventListener('click', () => {
            moveRow(dataKey.key);
            if (this.properties.sound) this._soundSpecial();
          });

          break;

        case 'Right':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.innerHTML = this._createIconHTML('arrow_right');

          keyElement.addEventListener('click', () => {
            moveRow(dataKey.key);
            if (this.properties.sound) this._soundSpecial();
          });

          break;

        case 'Sound':
          keyElement.classList.add('keyboard__key--dark', 'keyboard__key--activatable');
          keyElement.innerHTML = this._createIconHTML('volume_up');
          keyElement.textContent = dataKey.en;

          keyElement.addEventListener('click', () => {
            if (this.properties.sound) this._soundSpecial();
            this._toggleSound();
            keyElement.classList.toggle('keyboard__key--active', this.properties.sound);
          });

          break;

        case 'Ctrl':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.textContent = dataKey.en;

          keyElement.addEventListener('click', () => {
            if (this.properties.sound) this._soundSpecial();
          });

          break;

        case 'Win':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.textContent = dataKey.en;

          keyElement.addEventListener('click', () => {
            if (this.properties.sound) this._soundSpecial();
          });

          break;

        case 'Alt':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.textContent = dataKey.en;

          keyElement.addEventListener('click', () => {
            if (this.properties.sound) this._soundSpecial();
          });

          break;

        case 'Speech':
          keyElement.classList.add('keyboard__key--dark', 'speech');
          keyElement.innerHTML = this.properties.speech
            ? this._createIconHTML('mic')
            : this._createIconHTML('mic_off');

          keyElement.addEventListener('click', () => {
            if (this.properties.sound) this._soundSpecial();
            this._toggleSpeech();
          });

          break;

        case 'Tab':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.textContent = dataKey.en;

          keyElement.addEventListener('click', () => {
            if (this.properties.sound) this._soundSpecial();
            this.properties.value += '    ';
            this._triggerEvent('oninput');
          });

          break;

        case 'Eng':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.textContent = dataKey.en;

          keyElement.addEventListener('click', () => {
            if (this.properties.sound) this._soundSpecial();
            this._toggleLang();
          });

          break;

        default:
          console.log('localStorage', language);

          this.properties.langEn ? (lang = dataKey.en) : (lang = dataKey.ru);
          if (this.properties.shift) keyElement.textContent = dataKey.simbol;
          keyElement.textContent = lang.toLowerCase();

          keyElement.addEventListener('click', () => {
            if (this.properties.shift && dataKey.simbol) {
              this.properties.value += dataKey.simbol ? dataKey.simbol : dataKey.en;
            } else if (this.properties.langEn) {
              if (this.properties.sound) this._soundClickEn();
              this.properties.value += this.properties.capsLock
                ? dataKey.en.toUpperCase()
                : dataKey.en.toLowerCase();
            } else {
              if (this.properties.sound) this._soundClickRu();
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
  }

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  }

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
  }

  _toggleSound() {
    this.properties.sound = !this.properties.sound;
  }

  //! shift
  _toggleShift() {
    this.properties.capsLock = !this.properties.capsLock;
    this.properties.shift = !this.properties.shift;

    for (const key of this.elements.keys) {
      const isDark = key.classList.contains('keyboard__key--dark');

      if (key.childElementCount === 0 && !isDark) {
        const elem = this.data.filter((obj) => obj.key === key.dataset.key)[0];
        key.textContent = this.properties.shift ? (elem.simbol ? elem.simbol : elem.en) : elem.en;

        if (this.properties.capsLock) key.textContent = key.textContent.toUpperCase();
      }
    }
  }

  _toggleLang() {
    this.properties.langEn = !this.properties.langEn;
    localStorage.setItem('language', this.properties.langEn);
    console.log(localStorage.getItem('language'));
    for (const key of this.elements.keys) {
      const isDark = key.classList.contains('keyboard__key--dark');

      if ((key.childElementCount === 0 && !isDark) || key.dataset.key === 'ShiftRight') {
        const elem = this.data.filter((obj) => obj.key === key.dataset.key)[0];

        key.textContent = this.properties.langEn ? elem.en : elem.ru;
        if (this.properties.capsLock) key.textContent = key.textContent.toUpperCase();
      }
    }
  }

  //! speech
  _toggleSpeech() {
    this.properties.speech = !this.properties.speech;
    this.elements.textarea.webkitSpeech = this.properties.speech ? true : false;

    document.querySelector('.speech').innerHTML = this.properties.speech
      ? this._createIconHTML('mic')
      : this._createIconHTML('mic_off');
  }

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboard--hidden');

    this.elements.about.classList.remove('keyboard--hidden');
    this.elements.close.classList.remove('keyboard--hidden');
    this.elements.close.innerText = 'CLOSE keyboard';
  }

  close() {
    this.properties.value = '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add('keyboard--hidden');
  }
}
