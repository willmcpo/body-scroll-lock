import UAParser from 'ua-parser-js';

const parser = new UAParser();

const isMobileDevice = () => typeof window !== 'undefined' && parser.getDevice().type === 'mobile';
const isTabletDevice = () => typeof window !== 'undefined' && parser.getDevice().type === 'tablet';

const getBrowser = () => {
  const { browser } = parser.getResult();
  return browser;
};

export const isMobileOrTablet = isMobileDevice() || isTabletDevice();
export const isMobileOrTabletSafari = typeof window !== 'undefined' && isMobileOrTablet && getBrowser().name.includes('Safari');
