// @flow
import { isMobileOrTabletSafari } from './utils/userAgent';

type HandleScrollEvent = Event & WheelEvent;

const earlierScrollHandlers: Array<(HandleScrollEvent) => boolean> = [];
let previousPageY: number = -1;

// We block scrolling up on initialisation.
// We set unBlockCounter as 0 so it scrolling down works immediately.
let isBlocked: boolean = true;
let unblockCounter: number = 0;
let disableBodyScrollLockHolder: HTMLElement | null = null;

const preventDefault = (rawEvent: HandleScrollEvent): boolean => {
  const e = rawEvent || window.event;
  if (e.preventDefault) e.preventDefault();

  return false;
};

const handleScroll = (e: HandleScrollEvent, targetElement: HTMLElement | null): boolean => {
  if (!targetElement) return false;

  if (e.deltaY > 0 || (previousPageY >= 0 && e.pageY < previousPageY)) {
    if (isBlocked) {
      unblockCounter += 1;

      if (unblockCounter === 1) {
        isBlocked = false;
        unblockCounter = 0;
      } else {
        return preventDefault(e);
      }
    }

    if (targetElement.scrollTop + targetElement.offsetHeight === targetElement.scrollHeight) {
      previousPageY = e.pageY;
      isBlocked = true;
      unblockCounter = 0;
      return preventDefault(e);
    }
  } else if (e.deltaY < 0 || (previousPageY >= 0 && e.pageY > previousPageY)) {
    if (isBlocked) {
      unblockCounter -= 1;

      if (unblockCounter === -1) {
        isBlocked = false;
        unblockCounter = 0;
      } else {
        return preventDefault(e);
      }
    }

    if (targetElement.scrollTop === 0) {
      previousPageY = e.pageY;
      isBlocked = true;
      unblockCounter = 0;
      return preventDefault(e);
    }
  } else {
    previousPageY = e.pageY;
    return preventDefault(e);
  }

  previousPageY = e.pageY;
  return true;
};

export const enableBodyScroll = (targetElement: HTMLElement | null): void => {
  // If the holder of the body scroll lock is not equal to the provided element,
  // return immediately (only the holder is able to re-enable the scroll).
  if (disableBodyScrollLockHolder === targetElement) {
    disableBodyScrollLockHolder = null;

    if (isMobileOrTabletSafari) {
      document.body.ontouchmove = null;
      document.body.ontouchend = null;
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }
  } else if (isMobileOrTabletSafari) {
    // Re-instate previous scrollHandler
    document.body.ontouchmove = earlierScrollHandlers.pop();
  }
};

export const clearAllScrollHandlers = (): void => {
  // Clear all earlierScrollHandlers
  earlierScrollHandlers.splice(0);

  // Clear the scroll lock holder
  enableBodyScroll(disableBodyScrollLockHolder);

  // Reset other initial values
  previousPageY = -1;
  isBlocked = true;
  unblockCounter = 0;
};

export const disableBodyScroll = (targetElement: HTMLElement | null): void => {
  // If there is already an element holding the disable body scroll lock, then
  // return immediately.
  if (!disableBodyScrollLockHolder) {
    disableBodyScrollLockHolder = targetElement;
  }

  if (isMobileOrTabletSafari) {
    const scrollHandler = (event: HandleScrollEvent) => {
      handleScroll(event, targetElement);
    };

    // If there was a previous scroll handler used, save it.
    if (document.body.ontouchmove) {
      earlierScrollHandlers.push(document.body.ontouchmove);
    }

    document.body.ontouchmove = scrollHandler;
    document.body.ontouchend = () => {
      previousPageY = -1;
    };
  } else {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }
};
