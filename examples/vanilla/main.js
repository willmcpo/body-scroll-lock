const bodyScrollLock = require('../../lib/bodyScrollLock.js');

const scrollTarget = document.querySelector('.scrollTarget');
const disableBodyScrollButton = document.querySelector('.disableBodyScroll');
const enableBodyScrollButton = document.querySelector('.enableBodyScroll');
const disableBodyScrollButtonNoTargetElement = document.querySelector('.disableBodyScrollNoTargetElement');
const enableBodyScrollButtonNoTargetElement = document.querySelector('.enableBodyScrollNoTargetElement');
const statusElement = document.querySelector('.bodyScrollLockStatus');
const targetStatusElement = document.querySelector('.targetElementLockStatus');

function clearActiveButton() {
  const enabledButton = document.querySelector('.active');
  if (enabledButton) {
    enabledButton.classList.remove('active');
  }
}

disableBodyScrollButton.onclick = function(e) {
  console.info('disableBodyScrollButton');
  clearActiveButton();
  e.target.classList.add('active');
  bodyScrollLock.disableBodyScroll(scrollTarget);

  statusElement.innerHTML = ' &mdash; Scroll Locked';
  statusElement.style.color = 'red';

  targetStatusElement.innerHTML = ' &mdash; Scroll Enabled';
  targetStatusElement.style.color = 'green';
};

enableBodyScrollButton.onclick = function(e) {
  console.info('enableBodyScrollButton');
  clearActiveButton();
  e.target.classList.add('active');
  bodyScrollLock.enableBodyScroll(scrollTarget);

  statusElement.innerHTML = ' &mdash; Scroll Unlocked';
  statusElement.style.color = '';

  targetStatusElement.innerHTML = '';
  targetStatusElement.style.color = '';
};

disableBodyScrollButtonNoTargetElement.onclick = function(e) {
  console.info('disableBodyScrollButtonNoTargetElement');
  clearActiveButton();
  e.target.classList.add('active');
  bodyScrollLock.disableBodyScroll();

  statusElement.innerHTML = ' &mdash; Scroll Locked';
  statusElement.style.color = 'red';

  targetStatusElement.innerHTML = '';
  targetStatusElement.style.color = '';
};

enableBodyScrollButtonNoTargetElement.onclick = function(e) {
  console.info('enableBodyScrollButtonNoTargetElement');
  clearActiveButton();
  e.target.classList.add('active');
  bodyScrollLock.enableBodyScroll();

  statusElement.innerHTML = ' &mdash; Scroll Unlocked';
  statusElement.style.color = '';

  targetStatusElement.innerHTML = '';
  targetStatusElement.style.color = '';
};
