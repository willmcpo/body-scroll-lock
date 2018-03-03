import UAParser from 'ua-parser-js';
const parser = new UAParser();
export const isIosDevice = typeof window !== 'undefined' && parser.getOS().name === 'iOS';
