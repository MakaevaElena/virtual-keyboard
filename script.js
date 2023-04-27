// const audio = new Audio('/audio/tink.wav');

const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
    textarea: null,
    about: null,
    sound: null,
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: '',
    capsLock: false,
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    this.elements.textarea = document.createElement('textarea');
    this.elements.about = document.createElement('div');
    this.elements.sound = document.createElement('div');

    // Setup main elements
    this.elements.main.classList.add('keyboard', 'keyboard--hidden');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.textarea.classList.add('use-keyboard-input');
    this.elements.about.classList.add('about');
    this.elements.sound.classList.add('sound');
    this.elements.about.innerHTML += '<p>Change lang: Shift + Alt</p>';
    this.elements.sound.innerText = 'Sound';

    this.elements.textarea.placeholder = 'Click here';
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.textarea);
    document.body.appendChild(this.elements.main);
    document.body.appendChild(this.elements.about);
    document.body.appendChild(this.elements.sound);

    // Automatically use keyboard for elements with .use-keyboard-input

    document.querySelectorAll('.use-keyboard-input').forEach((element) => {
      element.addEventListener('focus', () => {
        this.open(element.value, (currentValue) => {
          element.value = currentValue;
        });
      });
    });
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      '`',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
      '-',
      '=',
      'Backspace',
      'Tab',
      'q',
      'w',
      'e',
      'r',
      't',
      'y',
      'u',
      'i',
      'o',
      'p',
      '[',
      ']',
      '\\',
      'DEL',
      'Caps Lock',
      'a',
      's',
      'd',
      'f',
      'g',
      'h',
      'j',
      'k',
      'l',
      ';',
      "'",
      'ENTER',
      'Shift',
      "''",
      'z',
      'x',
      'c',
      'v',
      'b',
      'n',
      'm',
      '.',
      ',',
      '/',
      'Up',
      'Shift',
      'Ctrl',
      'Win',
      'Alt',
      'space',
      'Alt',
      'Ctrl',
      'Left',
      'Down',
      'Right',
    ];

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    // console.log('shift', keyLayout.indexOf('Shift'));

    keyLayout.forEach((key, i) => {
      const keyElement = document.createElement('button');

      const insertLineBreak = ['Backspace', 'DEL', 'ENTER'].indexOf(key) !== -1 || i === 55;

      const virtualKeyHandler = () => {
        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
        this._triggerEvent('oninput');
      };

      // Add attributes/classes
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');

      switch (key) {
        case 'Backspace':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
          // keyElement.innerHTML = createIconHTML('Backspace');
          keyElement.textContent = key;

          keyElement.addEventListener('click', () => {
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
          keyElement.textContent = key;

          keyElement.addEventListener('click', () => {
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
          keyElement.textContent = key;

          keyElement.addEventListener('click', () => {
            this._toggleCapsLock();
            keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
          });

          break;

        case 'ENTER':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
          // keyElement.innerHTML = createIconHTML('ENTER');
          keyElement.textContent = key;

          keyElement.addEventListener('click', () => {
            this.properties.value += '\n';
            this._triggerEvent('oninput');
          });

          break;

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide');
          // keyElement.innerHTML = createIconHTML('space_bar');
          keyElement.textContent = key;

          keyElement.addEventListener('click', () => {
            this.properties.value += ' ';
            this._triggerEvent('oninput');
          });

          break;

        case 'Shift':
          keyElement.classList.add('keyboard__key--dark');
          if (i !== 55) keyElement.classList.add('keyboard__key--wide');

          // keyElement.innerHTML = createIconHTML('Shift');
          keyElement.textContent = key;

          keyElement.addEventListener('click', () => {
            this.close();
            this._triggerEvent('onclose');
          });

          break;

        case 'Up':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.innerHTML = createIconHTML('arrow_drop_up');

          keyElement.addEventListener('click', () => {
            this.close();
            this._triggerEvent('onclose');
          });

          break;

        case 'Down':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.innerHTML = createIconHTML('arrow_drop_down');

          keyElement.addEventListener('click', () => {
            this.close();
            this._triggerEvent('onclose');
          });

          break;

        case 'Left':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.innerHTML = createIconHTML('arrow_left');

          keyElement.addEventListener('click', () => {
            this.close();
            this._triggerEvent('onclose');
          });

          break;

        case 'Right':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.innerHTML = createIconHTML('arrow_right');

          keyElement.addEventListener('click', () => {
            this.close();
            this._triggerEvent('onclose');
          });

          break;

        case 'Ctrl':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.textContent = key;

          keyElement.addEventListener('click', () => {
            this.close();
            this._triggerEvent('onclose');
          });

          break;

        case 'Win':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.textContent = key;

          keyElement.addEventListener('click', () => {
            this.close();
            this._triggerEvent('onclose');
          });

          break;

        case 'Alt':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.textContent = key;

          keyElement.addEventListener('click', () => {
            this.close();
            this._triggerEvent('onclose');
          });

          break;

        case 'Tab':
          keyElement.classList.add('keyboard__key--dark');
          keyElement.textContent = key;

          keyElement.addEventListener('click', () => {
            this.close();
            this._triggerEvent('onclose');
          });

          break;

        default:
          keyElement.textContent = key.toLowerCase();

          // const fisicalKeyHandler = (evt) => {
          //   console.log(keyElement.innerText);

          //   keyElement.classList.add('active');
          //   if (evt.code === `Key${keyElement.innerText}`) {
          //     keyElement.classList.add('active');
          //   }
          // };

          keyElement.addEventListener('click', virtualKeyHandler);

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

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboard--hidden');
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
