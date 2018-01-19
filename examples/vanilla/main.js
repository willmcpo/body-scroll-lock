const bodyScrollLock = require('../../lib/bodyScrollLock.js');

const disableBodyScrollButton = document.querySelector('.disableBodyScroll');
const enableBodyScrollButton = document.querySelector('.enableBodyScroll');
const statusElement = document.querySelector('.bodyScrollLockStatus');

disableBodyScrollButton.onclick = function() {
  console.info('disableBodyScrollButton');
  bodyScrollLock.disableBodyScroll(document.querySelector('.scrollTarget'));

  statusElement.innerHTML = ' &mdash; Scroll Locked';
  statusElement.style.color = 'red';
};

enableBodyScrollButton.onclick = function() {
  console.info('enableBodyScrollButton');
  bodyScrollLock.enableBodyScroll(document.querySelector('.scrollTarget'));

  statusElement.innerHTML = ' &mdash; Scroll Unlocked';
  statusElement.style.color = '';
};

