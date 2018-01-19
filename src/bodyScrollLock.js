// @flow

// Adopted and modified solution from Bohdan Didukh (2017)
// https://stackoverflow.com/questions/41594997/ios-10-safari-prevent-scrolling-behind-a-fixed-overlay-and-maintain-scroll-posi

import { isMobileOrTabletSafari } from './utils/userAgent';

type HandleScrollEvent = TouchEvent;

const allTargetElements: { [any]: any } = {};
let initialClientY: number = -1;

const preventDefault = (rawEvent: HandleScrollEvent): boolean => {
  const e = rawEvent || window.event;
  if (e.preventDefault) e.preventDefault();

  return false;
};

const isTargetElementTotallyScrolled = (targetElement: any): boolean =>
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
  targetElement ? targetElement.scrollHeight - targetElement.scrollTop <= targetElement.clientHeight : false;

const handleScroll = (event: HandleScrollEvent, targetElement: any): boolean => {
  const clientY = event.targetTouches[0].clientY - initialClientY;

  if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
    // element is at the top of its scroll
    return preventDefault(event);
  }

  if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
    // element is at the top of its scroll
    return preventDefault(event);
  }

  return true;
};

export const disableBodyScroll = (targetElement: any): void => {
  if (isMobileOrTabletSafari) {
    if (targetElement) {
      allTargetElements[targetElement] = targetElement;

      targetElement.ontouchstart = (event: HandleScrollEvent) => {
        if (event.targetTouches.length === 1) {
          // detect single touch
          initialClientY = event.targetTouches[0].clientY;
        }
      };
      targetElement.ontouchmove = (event: HandleScrollEvent) => {
        if (event.targetTouches.length === 1) {
          // detect single touch
          handleScroll(event, targetElement);
        }
      };
    }
  } else {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }
};

export const clearAllScrollHandlers = (): void => {
  // Clear all allTargetElements ontouchstart/ontouchmove handlers, and the references
  Object.entries(allTargetElements).forEach(([key, targetElement]: [any, any]) => {
    targetElement.ontouchstart = null;
    targetElement.ontouchmove = null;

    allTargetElements.delete(key);
  });

  // Reset initial clientY
  initialClientY = -1;
};

export const enableBodyScroll = (targetElement: any): void => {
  if (isMobileOrTabletSafari) {
    targetElement.ontouchstart = null;
    targetElement.ontouchmove = null;
  } else {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
  }
};
