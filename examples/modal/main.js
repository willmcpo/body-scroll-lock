const bodyScrollLock = require('../../lib/bodyScrollLock.min.js');

const disableBodyScrollButtons = document.querySelectorAll('.disableBodyScroll');
const enableBodyScrollButton = document.querySelector('.enableBodyScroll');
const statusElements = document.querySelectorAll('.bodyScrollLockStatus');
const modalElement = document.querySelector('.modal');
const scrollTargetElement = document.querySelector('.scrollTarget');

function onDisableBodyScroll() {
  console.info('disableBodyScrollButton');

  // show modal
  modalElement.classList.add('active');

  bodyScrollLock.disableBodyScroll(scrollTargetElement);

  statusElements.forEach(el => {
    el.innerHTML = ' &mdash; Scroll Locked';
    el.style.color = 'red';
  });
};

disableBodyScrollButtons.forEach(btn => { btn.onclick = onDisableBodyScroll; });

enableBodyScrollButton.onclick = function() {
  console.info('enableBodyScrollButton');

  // hide modal
  modalElement.classList.remove('active');

  bodyScrollLock.enableBodyScroll(scrollTargetElement);

  statusElements.forEach(el => {
    el.innerHTML = ' &mdash; Scroll Unlocked';
    el.style.color = '';
  });
};
