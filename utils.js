export const moveRow = (keyCode) => {
  const textarea = document.querySelector('.use-keyboard-input');

  const goHorizontally = () => {
    let shifting = textarea.selectionStart;
    shifting += keyCode === 'ArrowLeft' ? -1 : 1;

    if (shifting !== -1) {
      textarea.setSelectionRange(shifting, shifting);
    }
  };

  const goVertically = () => {
    let carriagePosition = textarea.selectionEnd;

    const prevLine = textarea.value.lastIndexOf('\n', carriagePosition);
    const nextLine = textarea.value.lastIndexOf('\n', carriagePosition + 1);
    const prevPrevLine = textarea.value.lastIndexOf('\n', prevLine - 1);

    if (nextLine !== -1) {
      carriagePosition -= keyCode === 'ArrowUp' ? prevLine : -prevLine;
      carriagePosition += keyCode === 'ArrowUp' ? prevPrevLine : nextLine;
      textarea.setSelectionRange(carriagePosition, carriagePosition);
    }
  };

  switch (keyCode) {
    case 'ArrowLeft':
    case 'ArrowRight':
      goHorizontally();
      break;
    case 'ArrowUp':
    case 'ArrowDown':
      goVertically();
      break;
    default:
      throw new Error('Error');
  }

  return this;
};
