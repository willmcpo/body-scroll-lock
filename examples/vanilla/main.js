const bodyScrollLock = require('../../lib/bodyScrollLock.js');

function initialize(id) {
  const disableBodyScrollButton = document.querySelector(`.disableBodyScroll.${id}`);
  const enableBodyScrollButton = document.querySelector(`.enableBodyScroll.${id}`);
  const statusElement = document.querySelector(`.bodyScrollLockStatus.${id}`);

  disableBodyScrollButton.onclick = function() {
    console.info(`disableBodyScrollButton ${id}`);
    bodyScrollLock.disableBodyScroll(document.querySelector(`.scrollTarget.${id}`));

    statusElement.innerHTML = ' &mdash; Scroll Locked';
    statusElement.style.color = 'red';
  };

  enableBodyScrollButton.onclick = function() {
    console.info(`enableBodyScrollButton ${id}`);
    bodyScrollLock.enableBodyScroll(document.querySelector(`.scrollTarget.${id}`));

    statusElement.innerHTML = ' &mdash; Scroll Unlocked';
    statusElement.style.color = '';
  };
}

initialize('top')
initialize('bottom')