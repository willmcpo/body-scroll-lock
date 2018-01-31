// @flow

import { isMobileOrTabletSafari } from './utils/userAgent';

let originalBodyPosition = '';
let originalBodyScrollTop = 0;
const allLockedTargetElements: { [any]: boolean } = {};

export const disableBodyScroll = (targetElement: any): void => {
  if (!allLockedTargetElements[targetElement]) {
    if (isMobileOrTabletSafari) {
      originalBodyPosition = document.body.style.position;
      originalBodyScrollTop = document.body.scrollTop;

      document.body.style.transform = `translateY(-${originalBodyScrollTop}px)`;
      document.body.style.position = 'fixed';
    } else {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }

    allLockedTargetElements[targetElement] = true;
  }
};

export const enableBodyScroll = (targetElement: any): void => {
  if (allLockedTargetElements[targetElement]) {
    if (isMobileOrTabletSafari) {
      document.body.style.position = originalBodyPosition;
      document.body.style.transform = '';
      window.scrollTo(0, originalBodyScrollTop);

      originalBodyPosition = '';
      originalBodyScrollTop = 0;
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }

    delete allLockedTargetElements[targetElement];
  }
};
