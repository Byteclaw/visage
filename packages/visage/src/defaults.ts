import { createEmotionStyleGenerator } from './emotionStyleGenerator';

// https://zellwk.com/blog/media-query-units/
const MOBILE_BP = `(max-width: ${767 / 16}em)`;
const TABLET_BP = `(min-width: ${768 / 16}em) and (max-width: ${1024 / 16}em)`;
const DESKTOP_BP = `(min-width: ${1025 / 16}em)`;

export const defaultBreakpoints = [MOBILE_BP, TABLET_BP, DESKTOP_BP];

export const defaultStyleGenerator = createEmotionStyleGenerator();
