import { createEmotionStyleGenerator } from './emotionStyleGenerator';
import { createNPointFontScaleTheme } from './theme';

// https://zellwk.com/blog/media-query-units/
const MOBILE_BP = `(max-width: ${767 / 16}em)`;
const TABLET_BP = `(min-width: ${768 / 16}em) and (max-width: ${1024 / 16}em)`;
const DESKTOP_BP = `(min-width: ${1025 / 16}em)`;

export const defaultBreakpoints = [MOBILE_BP, TABLET_BP, DESKTOP_BP];

export const defaultStyleGenerator = createEmotionStyleGenerator();

export const defaultTheme = createNPointFontScaleTheme({
  borderRadius: {
    controlBorderRadius: 6,
    keyboardBorderRadius: 3,
  },
  fontSize: { values: [10, 12, 14, 16, 20, 24, 28, 32, 40, 48], offset: 2 },
  lineHeights: {
    values: [18, 20, 22, 24, 28, 32, 36, 40, 48, 56],
    offset: 2,
  },
  baseGridSize: 8,
  fontFamily: {
    body: 'Open Sans,sans-serif',
    heading: 'Nunito Sans,sans-serif',
  },
  colors: {
    neutral: 'rgb(227, 232, 238)',
    neutralText: 'color(neutral, contrast())',
    darkShades: 'rgb(27, 38, 44)',
    darkShadesText: 'color(darkShades, contrast())',
    accent: 'rgb(219, 226, 239)',
    accentText: 'color(accent, contrast())',
    shades: 'rgb(255, 255, 255)',
    shadesText: 'color(shades, contrast())',
    primary: 'rgb(31, 167, 236)',
    primaryText: 'color(primary, contrast())',
    success: 'rgb(39, 174, 96)',
    successText: 'color(success, contrast())',
    danger: 'rgb(192, 57, 43)',
    dangerText: 'color(danger, contrast())',
    info: 'rgb(41, 128, 185)',
    infoText: 'color(info, contrast())',
    warning: 'rgb(241, 196, 15)',
    warningText: 'color(warning, contrast())',
  },
});
