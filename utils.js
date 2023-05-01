export const moveRow = (keyCode) => {
  const textarea = document.querySelector('.use-keyboard-input');

  const goLeftNRight = () => {
    let shifting = textarea.selectionStart;
    shifting += keyCode === 'ArrowLeft' ? -1 : 1;

    if (shifting !== -1) {
      textarea.setSelectionRange(shifting, shifting);
    }
  };

  const goUpNDown = () => {
    let position = textarea.selectionEnd;

    const prev = textarea.value.lastIndexOf('\n', position);
    const next = textarea.value.lastIndexOf('\n', position + 1);
    const prevPrevLine = textarea.value.lastIndexOf('\n', prev - 1);

    if (next !== -1) {
      position -= keyCode === 'ArrowUp' ? prev : -prev;
      position += keyCode === 'ArrowUp' ? prevPrevLine : next;
      textarea.setSelectionRange(position, position);
    }
  };

  switch (keyCode) {
    case 'ArrowLeft':
    case 'ArrowRight':
      goLeftNRight();
      break;
    case 'ArrowUp':
    case 'ArrowDown':
      goUpNDown();
      break;
    default:
      throw new Error('Error');
  }

  return this;
};
