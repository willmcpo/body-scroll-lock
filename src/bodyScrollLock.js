// @flow

import { isMobileOrTabletSafari } from './utils/userAgent';

let originalBodyPosition;
const allLockedTargetElements: { [any]: boolean } = {};

export const disableBodyScroll = (targetElement: any): void => {
  if (!allLockedTargetElements[targetElement]) {
    if (isMobileOrTabletSafari) {
      originalBodyPosition = document.body.style.position;

      document.body.style.transform = `translateY(-${document.body.scrollTop}px)`;
      document.body.style.position = 'fixed';
    } else {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
  }
};

export const enableBodyScroll = (targetElement: any): void => {
  if (allLockedTargetElements[targetElement]) {
    if (isMobileOrTabletSafari) {
      document.body.style.position = originalBodyPosition;
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }

    delete allLockedTargetElements[targetElement];
  }
};
