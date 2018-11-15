// Adopted and modified solution from Bohdan Didukh (2017)
// https://stackoverflow.com/questions/41594997/ios-10-safari-prevent-scrolling-behind-a-fixed-overlay-and-maintain-scroll-posi
'use strict';

var isIosDevice =
  typeof window !== 'undefined' &&
  window.navigator &&
  window.navigator.platform &&
  /iP(ad|hone|od)/.test(window.navigator.platform);

// iOS 9 and below don't support event options (We only need this for iOS).
var isOldIos =
  isIosDevice && Number(window.navigator.userAgent.match(/OS (\d+)_/)[2]) < 10;
var listenerOptions = isOldIos ? undefined : { passive: false };

var allElements = [];
var lastClientY;
var previousOverflow;
var previousPaddingRight;
var timeoutId;
var reserveScrollBarGap;

// Setting overflow on body/documentElement synchronously in Desktop Safari slows down
// the responsiveness for some reason. Setting within a setTimeout fixes this.
function defer(fn) {
  // Always remove any existing timeout, we only want the latest.
  window.clearTimeout(timeoutId);
  timeoutId = setTimeout(fn);
}

function lockBody() {
  // Already called, do not continue.
  if (previousOverflow !== undefined) return;

  var scrollBarGap = window.innerWidth - document.documentElement.clientWidth;

  if (reserveScrollBarGap && scrollBarGap > 0) {
    var newPaddingRight =
      scrollBarGap +
      parseFloat(
        window
          .getComputedStyle(document.body, null)
          .getPropertyValue('padding-right')
      );
    previousPaddingRight = document.body.style.paddingRight;
    document.body.style.paddingRight = newPaddingRight + 'px';
  }

  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
}

function resetBody() {
  if (previousPaddingRight !== undefined) {
    document.body.style.paddingRight = previousPaddingRight;
    previousPaddingRight = undefined;
  }

  if (previousOverflow !== undefined) {
    document.body.style.overflow = previousOverflow;
    previousOverflow = undefined;
  }
}

function handleRootTouchMove(event) {
  // Do not prevent if the event has more than one touch.
  // Usually meaning this is a multi touch gesture like pinch to zoom.
  if (event.touches.length > 1) return;

  event.preventDefault();
}

function handleElementTouchStart(event) {
  if (event.targetTouches.length !== 1) return;
  lastClientY = event.targetTouches[0].clientY;
}

function handleElementTouchMove(event) {
  if (event.targetTouches.length !== 1) return;

  var currentClientY = event.targetTouches[0].clientY;
  var diffClientY = currentClientY - lastClientY;
  lastClientY = currentClientY;

  if (diffClientY === 0 || isNaN(diffClientY)) return;

  var rootElement = event.currentTarget;
  var element = event.target;

  while (element !== rootElement.parentNode) {
    if (
      // Scrolling up.
      (diffClientY > 0 &&
        // Element has room to scroll up.
        element.scrollTop > 0) ||
      // Scrolling down.
      (diffClientY < 0 &&
        // Element has room to scroll down.
        element.scrollHeight - element.scrollTop > element.clientHeight)
    ) {
      // Prevent propagation to body listener.
      event.stopPropagation();
      break;
    }
    element = element.parentNode;
  }
}

function disableBodyScroll(element, options) {
  if (!element) throw new Error('element must be provided');

  reserveScrollBarGap = options && options.reserveScrollBarGap;

  // Already have this element.
  if (allElements.indexOf(element) !== -1) return;

  allElements.push(element);

  var firstElement = allElements.length === 1;

  if (isIosDevice) {
    element.addEventListener(
      'touchstart',
      handleElementTouchStart,
      listenerOptions
    );
    element.addEventListener(
      'touchmove',
      handleElementTouchMove,
      listenerOptions
    );

    if (firstElement) {
      document.addEventListener(
        'touchmove',
        handleRootTouchMove,
        listenerOptions
      );
    }
  } else {
    if (firstElement) {
      defer(lockBody);
    }
  }
}

function enableBodyScroll(element) {
  if (!element) throw new Error('element must be provided');

  var index = allElements.indexOf(element);

  // Element was not found. Should this throw?
  if (index === -1) return;

  allElements.splice(index, 1);

  var lastElement = allElements.length === 0;

  if (isIosDevice) {
    element.removeEventListener(
      'touchstart',
      handleElementTouchStart,
      listenerOptions
    );
    element.removeEventListener(
      'touchmove',
      handleElementTouchMove,
      listenerOptions
    );

    if (lastElement) {
      document.removeEventListener(
        'touchmove',
        handleRootTouchMove,
        listenerOptions
      );
      lastClientY = undefined;
    }
  } else {
    if (lastElement) {
      defer(resetBody);
    }
  }
}

function clearAllBodyScrollLocks() {
  allElements.slice(0).forEach(enableBodyScroll);
}

module.exports = {
  disableBodyScroll: disableBodyScroll,
  enableBodyScroll: enableBodyScroll,
  clearAllBodyScrollLocks: clearAllBodyScrollLocks,
};
